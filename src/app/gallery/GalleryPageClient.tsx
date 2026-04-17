'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Container from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { DiscoveredGalleryImage } from '@/lib/discoverGalleryWebp';

const CATEGORY_CONTENT = {
  tattoo: {
    title: 'Tattoo Gallery',
    subtitle:
      'Explore a rotating curation of tattoo work from our artists. Click through to view each artist\'s full portfolio and book your next session.',
  },
  piercing: {
    title: 'Piercing Gallery',
    subtitle:
      'Discover our piercers\' craftsmanship and jewelry styling. Browse recent work and tap in to plan your next piercing experience.',
  },
} as const;

const shuffle = <T,>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function GalleryPageContent({ allImages }: { allImages: DiscoveredGalleryImage[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') ?? null;
  const activeCategory: 'tattoo' | 'piercing' = categoryParam === 'piercing' ? 'piercing' : 'tattoo';

  const [images, setImages] = useState<DiscoveredGalleryImage[]>([]);

  useEffect(() => {
    const filtered = allImages.filter((image) => image.category === activeCategory);
    setImages(shuffle(filtered));
  }, [activeCategory, allImages]);

  const heroContent = useMemo(() => CATEGORY_CONTENT[activeCategory], [activeCategory]);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <Container>
          <div className="gallery-hero-content">
            <h1 className="gallery-hero-title">{heroContent.title}</h1>
            <p className="gallery-hero-subtitle">{heroContent.subtitle}</p>
          </div>
        </Container>
      </section>

      <section className="gallery-grid-section">
        <Container>
          <div className="gallery-grid">
            {images.map((image) => (
              <div key={`${image.artist}-${image.src}`} className="gallery-card">
                <div className="gallery-card-image">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 380px"
                    className="gallery-card-img"
                  />
                  <div className="gallery-card-overlay">
                    <div className="gallery-card-info">
                      {image.category === 'tattoo' && (
                        <span className="gallery-card-artist">Artist: {image.artist}</span>
                      )}
                      <Link href={image.link} className="gallery-card-button">
                        {image.linkLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export default function GalleryPageClient({ allImages }: { allImages: DiscoveredGalleryImage[] }) {
  return (
    <Suspense fallback={<div className="gallery-page" />}>
      <GalleryPageContent allImages={allImages} />
    </Suspense>
  );
}
