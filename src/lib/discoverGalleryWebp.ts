import { listWebpFilesInImagesSubdir, publicWebpImageUrl } from './publicImagesWebp';

export type DiscoveredGalleryImage = {
  src: string;
  alt: string;
  artist: string;
  link: string;
  linkLabel: string;
  category: 'tattoo' | 'piercing';
};

/** Folder name under `public/images` → display name + single-artist slug */
const TATTOO_ARTIST_FOLDERS: Record<string, { artist: string; slug: string }> = {
  Kian: { artist: 'Kian', slug: 'kian-mokhtari' },
  Masi: { artist: 'Masi', slug: 'masi-aghdam' },
  Mina: { artist: 'Mina', slug: 'mina-khanian' },
  sami: { artist: 'Sami', slug: 'sami-amiri' },
};

function tattooRows(folder: string, meta: { artist: string; slug: string }): DiscoveredGalleryImage[] {
  const files = listWebpFilesInImagesSubdir(folder);
  return files.map((file, index) => ({
    src: publicWebpImageUrl(folder, file),
    artist: meta.artist,
    alt: `${meta.artist} tattoo artwork ${index + 1}`,
    link: `/single-artist/${meta.slug}#portfolio`,
    linkLabel: 'View Artist Portfolio',
    category: 'tattoo' as const,
  }));
}

/**
 * All `.webp` files under each artist folder + `piercing/`, discovered on the server.
 * Add new `.webp` files under those folders — no code list updates needed.
 */
export function discoverAllGalleryWebpImages(): DiscoveredGalleryImage[] {
  const tattoo: DiscoveredGalleryImage[] = [];
  for (const [folder, meta] of Object.entries(TATTOO_ARTIST_FOLDERS)) {
    tattoo.push(...tattooRows(folder, meta));
  }

  const piercingFiles = listWebpFilesInImagesSubdir('piercing');
  const piercing: DiscoveredGalleryImage[] = piercingFiles.map((file, index) => ({
    src: publicWebpImageUrl('piercing', file),
    artist: 'Piercing Team',
    alt: `Piercing work ${index + 1}`,
    link: '/booking?service=piercing',
    linkLabel: 'Book Piercing',
    category: 'piercing',
  }));

  return [...tattoo, ...piercing];
}
