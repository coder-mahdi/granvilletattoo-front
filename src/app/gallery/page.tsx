'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Container from '@/components/Container';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type GalleryImage = {
  src: string;
  alt: string;
  artist: string;
  link: string;
  linkLabel: string;
  category: 'tattoo' | 'piercing';
};

const createTattooImages = (sources: string[], artist: string, slug: string): GalleryImage[] =>
  sources.map((src, index) => ({
    src,
    artist,
    alt: `${artist} tattoo artwork ${index + 1}`,
    link: `/single-artist/${slug}#portfolio`,
    linkLabel: 'View Artist Portfolio',
    category: 'tattoo',
  }));

const tattooImages: GalleryImage[] = [
  ...createTattooImages([
    '/images/Kian/Kian-1.png',
    '/images/Kian/Kian-2.webp',
    '/images/Kian/Kian-3.webp',
    '/images/Kian/Kian-5.webp',
    '/images/Kian/Kian-6.webp',
    '/images/Kian/kian_gallery-1.jpg',
    '/images/Kian/kian_gallery-2.jpg',
    '/images/general/general-1.png',
    '/images/general/general-3.webp',
  ], 'Kian', 'kian-mokhtari'),
  ...createTattooImages([
    '/images/Masi/Masi-tattoo.webp',
    '/images/Masi/Masi-tattoo-7.webp',
    '/images/Masi/Masi-tattoo-8.webp',
    '/images/Masi/Masi-tattoo-9.webp',
    '/images/Masi/Masi-tattoo-10.webp',
    '/images/Masi/Masi-tattoo-10.png',
    '/images/Masi/Masi-tattoo-11.webp',
    '/images/Masi/Masi-tattoo-11.png',
    '/images/Masi/Masi-tattoo-13.webp',
    '/images/Masi/Masi-tattoo-14.webp',
    '/images/Masi/Masi-tattoo-14.png',
    '/images/Masi/Masi-tattoo-15.webp',
    '/images/Masi/Masi-tattoo-16.webp',
    '/images/Masi/Masi-tattoo-18.webp',
  ], 'Masi', 'masi-aghdam'),
  ...createTattooImages([
    '/images/Mina/Mina-2.webp',
    '/images/Mina/Mina-3.webp',
    '/images/Mina/Mina-4.webp',
    '/images/Mina/Mina-5.webp',
    '/images/Mina/Mina-6.webp',
    '/images/Mina/Mina-7.webp',
    '/images/Mina/Mina-8.webp',
    '/images/Mina/Mina-9.webp',
    '/images/Mina/Mina-10.webp',
    '/images/Mina/Mina-11.webp',
  ], 'Mina', 'mina-khanian'),
  ...createTattooImages([
    '/images/sami/IMG_2615.webp',
    '/images/sami/IMG_2654.webp',
    '/images/sami/IMG_3041.webp',
    '/images/sami/IMG_3636.JPG',
    '/images/sami/IMG_3687.JPG',
    '/images/sami/IMG_4056.JPG',
    '/images/sami/IMG_4765.JPG',
    '/images/sami/20250803_162655 (1).webp',
    '/images/general/97992305-F07C-4910-B9A7-2BE771A9CB0B (1).webp',
    '/images/general/BCBFE364-3E30-45A8-B6EF-725FCB9F0C49.webp',
  ], 'Sami', 'sami-amiri'),
];

const piercingImages: GalleryImage[] = [
  '/images/piercing/piercing.webp',
  '/images/piercing/piercing-1.webp',
  '/images/piercing/piercing-2.webp',
  '/images/piercing/piercing-3.webp',
  '/images/piercing/piercing-4.webp',
  '/images/piercing/piercing-5.webp',
  '/images/piercing/piercing-6.webp',
  '/images/piercing/piercing-7.webp',
  '/images/piercing/piercing-8.webp',
].map((src, index) => ({
  src,
  artist: 'Piercing Team',
  alt: `Piercing work ${index + 1}`,
  link: '/booking?service=piercing',
  linkLabel: 'Book Piercing',
  category: 'piercing',
}));

const ALL_IMAGES: GalleryImage[] = [...tattooImages, ...piercingImages];

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

function GalleryPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') ?? null;
  const activeCategory: 'tattoo' | 'piercing' = categoryParam === 'piercing' ? 'piercing' : 'tattoo';

  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const filtered = ALL_IMAGES.filter((image) => image.category === activeCategory);
    setImages(shuffle(filtered));
  }, [activeCategory]);

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

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="gallery-page" />}>
      <GalleryPageContent />
    </Suspense>
  );
}
