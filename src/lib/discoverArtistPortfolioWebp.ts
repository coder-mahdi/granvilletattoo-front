import { ARTIST_PROFILES } from '@/app/single-artist/artistProfiles';
import { listWebpFilesInImagesSubdir, publicWebpImageUrl } from './publicImagesWebp';

export type ArtistPortfolioItem = {
  id: number;
  title: string;
  image: string;
  category: string;
  year: string;
};

function parseHeroFolderAndFile(heroImageUrl: string): { folder: string; file: string } | null {
  const m = heroImageUrl.trim().match(/^\/images\/([^/]+)\/(.+)$/);
  if (!m) return null;
  return { folder: m[1], file: decodeURIComponent(m[2]) };
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Portfolio grid: `.webp` files in `public/images/{profile.imageFolder}/`, excluding the
 * same file used as `heroImage`. Order is shuffled on each call (use `force-dynamic` on the page).
 * Titles are generic (no filenames).
 */
export function discoverArtistPortfolioWebp(slug: string, heroImageUrl: string): ArtistPortfolioItem[] {
  const profile = ARTIST_PROFILES[slug];
  if (!profile) return [];

  const folder = profile.imageFolder;
  const heroParts = parseHeroFolderAndFile(heroImageUrl);

  let files = listWebpFilesInImagesSubdir(folder);
  if (heroParts && heroParts.folder === folder) {
    files = files.filter((f) => f !== heroParts.file);
  }

  const shuffled = shuffleArray(files);

  return shuffled.map((file, index) => ({
    id: index + 1,
    title: 'Selected work',
    image: publicWebpImageUrl(folder, file),
    category: '',
    year: '',
  }));
}
