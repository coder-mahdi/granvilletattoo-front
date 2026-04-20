import { unstable_noStore } from 'next/cache';
import { ARTIST_PROFILES } from '@/app/single-artist/artistProfiles';
import { buildGranvilleDirectUrl, buildWpV2DirectUrl } from './granvilleFetchUrl';
import type { DiscoveredGalleryImage } from './discoverGalleryWebp';
import { discoverAllGalleryWebpImages } from './discoverGalleryWebp';
import { discoverArtistPortfolioWebp, type ArtistPortfolioItem } from './discoverArtistPortfolioWebp';

/** Bypass Next Data Cache; ask proxies not to serve stale JSON for CMS. */
const CMS_GALLERY_FETCH_INIT: RequestInit = {
  cache: 'no-store',
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
};

/** Unique query on each server request so upstream/CDN cannot return a cached REST body. */
function mergeCmsJsonCacheBust(
  params?: Record<string, string | number | undefined>,
): Record<string, string | number | undefined> {
  return { ...params, _cb: Date.now() };
}

/** CMS `slug` on `/granville/v1/artists` → `single-artist/[slug]` profile key */
const PROFILE_SLUG_BY_API_SLUG: Record<string, string> = {
  'kian-mokhtari': 'kian-mokhtari',
  masi: 'masi-aghdam',
  'mina-khani': 'mina-khani',
  'sami-amiri': 'sami-amiri',
};

/** Profile slug from the site → CMS artist slug for matching API rows */
export function granvilleApiSlugForProfileSlug(profileSlug: string): string | null {
  const map: Record<string, string> = {
    'kian-mokhtari': 'kian-mokhtari',
    'masi-aghdam': 'masi',
    'mina-khani': 'mina-khani',
    'mina-khanian': 'mina-khani',
    'sami-amiri': 'sami-amiri',
  };
  return map[profileSlug] ?? null;
}

export type GranvilleArtistRow = {
  id: number;
  slug: string;
  title: string;
  link?: string;
  gallery?: unknown;
  /** From `wp/v2/artist` — changes when the artist post (incl. gallery) is saved; used to bust image caches. */
  modified?: string;
  modified_gmt?: string;
  /** If the plugin exposes ACF under another key, keep it on the type as unknown. */
  acf?: unknown;
  photo_gallery?: unknown;
  photoGallery?: unknown;
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function extractUrlFromGalleryEntry(entry: unknown): string | null {
  if (entry == null) return null;
  if (typeof entry === 'string') {
    const u = entry.trim();
    return u.length > 0 ? u : null;
  }
  if (typeof entry !== 'object') return null;
  const o = entry as Record<string, unknown>;
  if (typeof o.url === 'string' && o.url.trim()) return o.url.trim();
  if (typeof o.source_url === 'string' && o.source_url.trim()) return o.source_url.trim();
  const guid = o.guid;
  if (typeof guid === 'string' && guid.trim()) return guid.trim();
  if (guid && typeof guid === 'object') {
    const rendered = (guid as { rendered?: unknown }).rendered;
    if (typeof rendered === 'string' && rendered.trim()) return rendered.trim();
  }
  const sizes = o.sizes;
  if (sizes && typeof sizes === 'object') {
    const s = sizes as Record<string, unknown>;
    for (const k of ['large', 'medium_large', 'medium', 'full', 'thumbnail']) {
      const v = s[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
  }
  return null;
}

/** PHP/JSON sometimes sends a list as object with numeric keys, or a JSON string. */
function coerceGalleryIterable(raw: unknown): unknown[] {
  if (raw == null) return [];
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t) return [];
    try {
      return coerceGalleryIterable(JSON.parse(t) as unknown);
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') {
    const vals = Object.values(raw as Record<string, unknown>);
    const looksLikeList =
      vals.length > 0 && Object.keys(raw as object).every((k) => /^\d+$/.test(k));
    if (looksLikeList) return vals;
  }
  return [];
}

/** Prefer REST `gallery`, then common plugin/ACF field names. */
function pickGalleryRaw(row: GranvilleArtistRow): unknown {
  const candidates: unknown[] = [
    row.gallery,
    (row as Record<string, unknown>).artist_gallery,
    row.photo_gallery,
    row.photoGallery,
  ];
  const acf = row.acf;
  if (acf && typeof acf === 'object') {
    const a = acf as Record<string, unknown>;
    candidates.push(a.gallery, a.photo_gallery, a.photoGallery);
  }
  const loose = row as Record<string, unknown>;
  for (const key of [
    'artist_gallery',
    'photo_gallery',
    'photoGallery',
    'photo_gallery_images',
    'gallery_images',
  ]) {
    if (loose[key] !== undefined && !candidates.includes(loose[key])) {
      candidates.push(loose[key]);
    }
  }
  for (const c of candidates) {
    const list = coerceGalleryIterable(c);
    if (list.length > 0) return list;
  }
  return row.gallery;
}

function normalizeGalleryList(raw: unknown): string[] {
  return collectGallerySrcEntries(raw, undefined).map((e) => e.src);
}

function attachmentIdFromGalleryEntry(entry: unknown): number | undefined {
  if (!entry || typeof entry !== 'object') return undefined;
  const o = entry as Record<string, unknown>;
  const id = o.id ?? o.ID;
  if (typeof id === 'number' && Number.isFinite(id)) return id;
  if (typeof id === 'string' && /^\d+$/.test(id)) return parseInt(id, 10);
  return undefined;
}

function artistPostRevisionToken(row?: GranvilleArtistRow): string | undefined {
  if (!row) return undefined;
  const raw = (row.modified_gmt ?? row.modified ?? '').trim();
  if (!raw) return undefined;
  return encodeURIComponent(raw.replace(/\s+/g, '_'));
}

/** Bust browser caches: post save time (add/remove/reorder gallery) + optional attachment id (replace file). */
function cacheBustCmsMediaUrl(url: string, attachmentId?: number, postRev?: string): string {
  if (!/^https?:\/\//i.test(url)) return url;
  const parts: string[] = [];
  if (postRev) parts.push(`p=${postRev}`);
  if (attachmentId) parts.push(`ver=${attachmentId}`);
  if (!parts.length) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}${parts.join('&')}`;
}

function collectGallerySrcEntries(raw: unknown, row?: GranvilleArtistRow): { src: string }[] {
  const postRev = artistPostRevisionToken(row);
  const iterable = coerceGalleryIterable(raw);
  const out: { src: string }[] = [];
  for (const item of iterable) {
    const u = extractUrlFromGalleryEntry(item);
    if (!u) continue;
    const id = attachmentIdFromGalleryEntry(item);
    out.push({ src: cacheBustCmsMediaUrl(u, id, postRev) });
  }
  return out;
}

function displayNameForApiRow(row: GranvilleArtistRow): string {
  const profileSlug = PROFILE_SLUG_BY_API_SLUG[row.slug];
  if (profileSlug) {
    const profile = ARTIST_PROFILES[profileSlug];
    if (profile) return profile.name;
  }
  if (row.title && row.title.trim()) return row.title.replace(/-/g, ' ');
  return row.slug;
}

function profileSlugOrFallback(row: GranvilleArtistRow): string {
  return PROFILE_SLUG_BY_API_SLUG[row.slug] ?? row.slug;
}

/**
 * Tattoo images from WordPress “Photo Gallery” (`gallery` on each artist row).
 * Returns [] if the API fails or every gallery is empty.
 */
export async function fetchTattooGalleryImagesFromCms(): Promise<DiscoveredGalleryImage[]> {
  unstable_noStore();
  const rows = await fetchArtistRowsWithGallery();
  if (!rows.length) return [];

  const out: DiscoveredGalleryImage[] = [];
  for (const row of rows) {
    const urls = shuffleArray(collectGallerySrcEntries(pickGalleryRaw(row), row)).map((e) => e.src);
    const profileSlug = profileSlugOrFallback(row);
    const artistName = displayNameForApiRow(row);
    const link = `/single-artist/${profileSlug}#portfolio`;

    urls.forEach((src, index) => {
      out.push({
        src,
        artist: artistName,
        alt: `${artistName} tattoo work ${index + 1}`,
        link,
        linkLabel: 'View Artist Portfolio',
        category: 'tattoo',
      });
    });
  }
  return out;
}

async function fetchGranvilleArtists(): Promise<GranvilleArtistRow[] | null> {
  try {
    const url = buildGranvilleDirectUrl('/artists', mergeCmsJsonCacheBust());
    const res = await fetch(url, CMS_GALLERY_FETCH_INIT);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as GranvilleArtistRow[];
  } catch {
    return null;
  }
}

/**
 * On this CMS, `GET /wp/v2/artist/{id}` sometimes returns a truncated `gallery` (e.g. Kian: 1 vs 20),
 * while `GET /wp/v2/artist?include={id}` returns the full list — same quirk as the collection endpoint.
 */
async function fetchWpV2ArtistRowWithFullGallery(id: number): Promise<GranvilleArtistRow | null> {
  const fromInclude = await fetchWpV2ArtistsByIncludeIds([id]);
  if (fromInclude?.[0]) return fromInclude[0];
  try {
    const url = buildWpV2DirectUrl(`/artist/${id}`, mergeCmsJsonCacheBust());
    const res = await fetch(url, CMS_GALLERY_FETCH_INIT);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
    return data as GranvilleArtistRow;
  } catch {
    return null;
  }
}

async function fetchWpV2ArtistFirstBySlug(slug: string): Promise<GranvilleArtistRow | null> {
  try {
    const url = buildWpV2DirectUrl('/artist', mergeCmsJsonCacheBust({ slug, per_page: 5 }));
    const res = await fetch(url, CMS_GALLERY_FETCH_INIT);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data) || !data[0]) return null;
    return data[0] as GranvilleArtistRow;
  } catch {
    return null;
  }
}

/**
 * CPT `artist` — list without `include` often returns a truncated `gallery` per post (WordPress / field callback).
 * Prefer {@link fetchWpV2ArtistsByIncludeIds} using ids from `granville/v1/artists`.
 */
async function fetchWpV2ArtistsList(): Promise<GranvilleArtistRow[] | null> {
  try {
    const url = buildWpV2DirectUrl('/artist', mergeCmsJsonCacheBust({ per_page: 100 }));
    const res = await fetch(url, CMS_GALLERY_FETCH_INIT);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as GranvilleArtistRow[];
  } catch {
    return null;
  }
}

/** Full `gallery` arrays — `include=` matches the full payload on this CMS (unlike bare list or `/artist/{id}` for some posts). */
async function fetchWpV2ArtistsByIncludeIds(ids: number[]): Promise<GranvilleArtistRow[] | null> {
  if (!ids.length) return [];
  try {
    const url = buildWpV2DirectUrl('/artist', mergeCmsJsonCacheBust({
      include: ids.join(','),
      per_page: Math.max(ids.length, 20),
    }));
    const res = await fetch(url, CMS_GALLERY_FETCH_INIT);
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as GranvilleArtistRow[];
  } catch {
    return null;
  }
}

/**
 * Prefer `gallery` from `GET /wp/v2/artist` when it has URLs; otherwise keep `granville/v1/artists`
 * (email, schedule, order) and its `gallery` if any.
 */
async function fetchArtistRowsWithGallery(): Promise<GranvilleArtistRow[]> {
  unstable_noStore();
  const gvList = (await fetchGranvilleArtists()) ?? [];

  let wpList: GranvilleArtistRow[] = [];
  if (gvList.length > 0) {
    const ids = gvList.map((r) => r.id).filter((id): id is number => Number.isFinite(id));
    wpList = (await fetchWpV2ArtistsByIncludeIds(ids)) ?? [];
  } else {
    const hint = await fetchWpV2ArtistsList();
    if (hint?.length) {
      const ids = hint.map((r) => r.id).filter((id): id is number => Number.isFinite(id));
      wpList = (await fetchWpV2ArtistsByIncludeIds(ids)) ?? hint;
    }
  }

  if (gvList.length === 0) {
    return wpList;
  }

  const wpBySlug = new Map(wpList.map((r) => [r.slug, r]));
  const gvBySlug = new Map(gvList.map((r) => [r.slug, r]));
  const out: GranvilleArtistRow[] = [];

  for (const gvRow of gvList) {
    const wpRow = wpBySlug.get(gvRow.slug);
    const wpUrls = wpRow ? normalizeGalleryList(pickGalleryRaw(wpRow)) : [];
    const gallery = wpUrls.length > 0 && wpRow ? wpRow.gallery : gvRow.gallery;
    const merged: GranvilleArtistRow = { ...gvRow, gallery };
    if (wpRow) {
      if (wpRow.modified) merged.modified = wpRow.modified;
      if (wpRow.modified_gmt) merged.modified_gmt = wpRow.modified_gmt;
    }
    out.push(merged);
  }

  for (const wpRow of wpList) {
    if (!gvBySlug.has(wpRow.slug)) {
      out.push(wpRow);
    }
  }

  return out;
}

/**
 * Shop gallery: tattoo rows from CMS when any photo exists; otherwise local `.webp` discovery.
 * Piercing always uses local `public/images/piercing`.
 */
export async function fetchShopGalleryImages(): Promise<DiscoveredGalleryImage[]> {
  unstable_noStore();
  const local = discoverAllGalleryWebpImages();
  const piercing = local.filter((i) => i.category === 'piercing');

  const cmsTattoo = await fetchTattooGalleryImagesFromCms();
  const tattoo = cmsTattoo.length > 0 ? cmsTattoo : local.filter((i) => i.category === 'tattoo');

  return [...tattoo, ...piercing];
}

/**
 * Portfolio grid: CMS Photo Gallery when the artist has images; otherwise local `.webp` folder.
 */
export async function fetchArtistPortfolioForSlug(
  profileSlug: string,
  heroImageUrl: string,
): Promise<ArtistPortfolioItem[]> {
  unstable_noStore();
  const apiSlug = granvilleApiSlugForProfileSlug(profileSlug);
  if (!apiSlug) {
    return discoverArtistPortfolioWebp(profileSlug, heroImageUrl);
  }

  const gvRows = await fetchGranvilleArtists();
  const gvRow = gvRows?.find((r) => r.slug === apiSlug);
  let wpRow: GranvilleArtistRow | null = null;
  if (gvRow && Number.isFinite(gvRow.id)) {
    wpRow = await fetchWpV2ArtistRowWithFullGallery(gvRow.id);
  }
  if (!wpRow) {
    const bySlug = await fetchWpV2ArtistFirstBySlug(apiSlug);
    if (bySlug && Number.isFinite(bySlug.id)) {
      wpRow = (await fetchWpV2ArtistsByIncludeIds([bySlug.id]))?.[0] ?? bySlug;
    } else {
      wpRow = bySlug;
    }
  }

  const urls = wpRow ? shuffleArray(collectGallerySrcEntries(pickGalleryRaw(wpRow), wpRow)).map((e) => e.src) : [];

  if (urls.length === 0) {
    return discoverArtistPortfolioWebp(profileSlug, heroImageUrl);
  }

  return urls.map((image, index) => ({
    id: index + 1,
    title: 'Selected work',
    image,
    category: '',
    year: '',
  }));
}
