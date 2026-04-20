import { ARTIST_PROFILES } from '@/app/single-artist/artistProfiles';
import { buildGranvilleDirectUrl, buildWpV2DirectUrl } from './granvilleFetchUrl';
import type { DiscoveredGalleryImage } from './discoverGalleryWebp';
import { discoverAllGalleryWebpImages } from './discoverGalleryWebp';
import { discoverArtistPortfolioWebp, type ArtistPortfolioItem } from './discoverArtistPortfolioWebp';

const ARTISTS_REVALIDATE_SECONDS = 300;

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
  const iterable = coerceGalleryIterable(raw);
  const urls: string[] = [];
  for (const item of iterable) {
    const u = extractUrlFromGalleryEntry(item);
    if (u) urls.push(u);
  }
  return urls;
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
  const rows = await fetchArtistRowsWithGallery();
  if (!rows.length) return [];

  const out: DiscoveredGalleryImage[] = [];
  for (const row of rows) {
    const urls = shuffleArray(normalizeGalleryList(pickGalleryRaw(row)));
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
    const url = buildGranvilleDirectUrl('/artists');
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: ARTISTS_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return data as GranvilleArtistRow[];
  } catch {
    return null;
  }
}

/** CPT `artist` — `gallery` is populated via `register_rest_field` (often ahead of `granville/v1/artists`). */
async function fetchWpV2Artists(): Promise<GranvilleArtistRow[] | null> {
  try {
    const url = buildWpV2DirectUrl('/artist', { per_page: 100 });
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: ARTISTS_REVALIDATE_SECONDS },
    });
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
  const [wp, gv] = await Promise.all([fetchWpV2Artists(), fetchGranvilleArtists()]);
  const wpList = wp ?? [];
  const gvList = gv ?? [];

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
    out.push({ ...gvRow, gallery });
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
  const apiSlug = granvilleApiSlugForProfileSlug(profileSlug);
  if (!apiSlug) {
    return discoverArtistPortfolioWebp(profileSlug, heroImageUrl);
  }

  const rows = await fetchArtistRowsWithGallery();
  if (!rows.length) {
    return discoverArtistPortfolioWebp(profileSlug, heroImageUrl);
  }

  const row = rows.find((r) => r.slug === apiSlug);
  const urls = row ? shuffleArray(normalizeGalleryList(pickGalleryRaw(row))) : [];

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
