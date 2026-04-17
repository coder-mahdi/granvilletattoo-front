import fs from 'fs';
import path from 'path';

/** List `.webp` files (case-insensitive) directly under `public/images/{subdir}/`. */
export function listWebpFilesInImagesSubdir(subdir: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', subdir);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return [];
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.webp'))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export function publicWebpImageUrl(folder: string, file: string): string {
  return `/images/${folder}/${encodeURIComponent(file)}`;
}
