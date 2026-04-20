import GalleryPageClient from './GalleryPageClient';
import { fetchShopGalleryImages } from '@/lib/artistGalleryApi';

/** CMS artist galleries + local piercing; tattoo falls back to `public/images` when CMS galleries are empty. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function GalleryPage() {
  const allImages = await fetchShopGalleryImages();
  return <GalleryPageClient allImages={allImages} />;
}
