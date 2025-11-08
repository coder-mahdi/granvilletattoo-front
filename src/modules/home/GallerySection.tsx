'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useHorizontalScrollHijack } from '@/hooks/useHorizontalScrollHijack';

type OurWorkImage = {
  src: string;
  artist: string;
  alt: string;
};

const BASE_GALLERY_IMAGES: OurWorkImage[] = [
  { src: '/images/general/general-1.png', artist: 'Kian', alt: 'Kian tattoo artwork' },
  { src: '/images/general/general-3.webp', artist: 'Kian', alt: 'Kian tattoo artwork' },
  { src: '/images/general/97992305-F07C-4910-B9A7-2BE771A9CB0B (1).webp', artist: 'Sami', alt: 'Sami tattoo artwork' },
  { src: '/images/general/BCBFE364-3E30-45A8-B6EF-725FCB9F0C49.webp', artist: 'Sami', alt: 'Sami tattoo artwork' },
  { src: '/images/general/Kian-2.webp', artist: 'Kian', alt: 'Kian tattoo artwork' },
  { src: '/images/general/Kian-3.webp', artist: 'Kian', alt: 'Kian tattoo artwork' },
  { src: '/images/general/Masi-tattoo-7.webp', artist: 'Masi', alt: 'Masi tattoo artwork' },
  { src: '/images/general/Masi-tattoo-11.webp', artist: 'Masi', alt: 'Masi tattoo artwork' },
  { src: '/images/general/Mina-4.webp', artist: 'Mina', alt: 'Mina tattoo artwork' },
  { src: '/images/general/Mina-8.webp', artist: 'Mina', alt: 'Mina tattoo artwork' },
  { src: '/images/general/Mina-9.webp', artist: 'Mina', alt: 'Mina tattoo artwork' },
  { src: '/images/piercing/piercing.webp', artist: 'Piercing', alt: 'Piercing studio work' },
  { src: '/images/piercing/piercing-5.webp', artist: 'Piercing', alt: 'Piercing studio work' },
  { src: '/images/piercing/piercing-2.webp', artist: 'Piercing', alt: 'Piercing studio work' },
];

const shuffleImages = (images: OurWorkImage[]) => {
  const shuffled = [...images];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use custom hook for scroll hijacking logic
  useHorizontalScrollHijack({
    sectionRef,
    galleryRef,
    onProgressChange: setScrollProgress,
    enabled: true
  });

  const [galleryImages, setGalleryImages] = useState<OurWorkImage[]>(BASE_GALLERY_IMAGES);

  useEffect(() => {
    setGalleryImages(shuffleImages(BASE_GALLERY_IMAGES));
  }, []);

  return (
    <section ref={sectionRef} className="gallery-section">
      <h2 className="gallery-title">Our Work</h2>
      <p className="gallery-description">
        Our portfolio showcases diverse tattoo styles, from fine line artistry to photorealistic masterpieces
      </p>
      <div 
        className="gallery-horizontal" 
        ref={galleryRef}
        style={{ scrollBehavior: 'auto' }}
      >
        {galleryImages.map((image, index) => (
          <div key={`${image.src}-${index}`} className="gallery-item">
            <div className="gallery-image-wrapper">
              <Image
                src={image.src}
                alt={image.alt}
                width={360}
                height={360}
                draggable={false}
                className="gallery-img"
              />
              <div className="gallery-overlay">
                <span className="gallery-overlay-text">{image.artist}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="gallery-scroll-indicator">
        <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />
      </div>
    </section>
  );
}
