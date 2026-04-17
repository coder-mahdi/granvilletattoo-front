import GalleryPageClient from './GalleryPageClient';
import { discoverAllGalleryWebpImages } from '@/lib/discoverGalleryWebp';

/** Re-scan `public/images/**` on each request so new `.webp` files show in dev without rebuild. */
export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  const allImages = discoverAllGalleryWebpImages();
  return <GalleryPageClient allImages={allImages} />;
}
