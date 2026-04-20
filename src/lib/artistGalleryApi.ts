import { ARTIST_PROFILES } from '@/app/single-artist/artistProfiles';
import { buildGranvilleDirectUrl } from './granvilleFetchUrl';
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
  return null;
}

function normalizeGalleryList(raw: unknown): string[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return [];
  const urls: string[] = [];
  for (const item of raw) {
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
  const rows = await fetchGranvilleArtists();
  if (!rows) return [];

  const out: DiscoveredGalleryImage[] = [];
  for (const row of rows) {
    const urls = shuffleArray(normalizeGalleryList(row.gallery));
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

  const rows = await fetchGranvilleArtists();
  if (!rows) {
    return discoverArtistPortfolioWebp(profileSlug, heroImageUrl);
  }

  const row = rows.find((r) => r.slug === apiSlug);
  const urls = row ? shuffleArray(normalizeGalleryList(row.gallery)) : [];

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
