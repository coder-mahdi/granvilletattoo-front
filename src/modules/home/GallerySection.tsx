'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useHorizontalScrollHijack } from '@/hooks/useHorizontalScrollHijack';

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

  const generalGalleryImages = [
    'general-1.png',
    'general-2.webp',
    'general-3.webp',
    '97992305-F07C-4910-B9A7-2BE771A9CB0B (1).webp',
    'BCBFE364-3E30-45A8-B6EF-725FCB9F0C49.webp',
    'Kian-2.webp',
    'Kian-3.webp',
    'Masi-tattoo-7.webp',
    'Masi-tattoo-11.webp',
    'Mina-4.webp',
    'Mina-8.webp',
    'Mina-9.webp',
  ];

  const galleryImages = generalGalleryImages.map((fileName, index) => {
    const altText = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      id: index + 1,
      src: `/images/general/${fileName}`,
      alt: altText,
    };
  });

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
        {galleryImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <Image
              src={image.src}
              alt={image.alt}
              width={360}
              height={360}
              draggable={false}
              className="gallery-img"
            />
          </div>
        ))}
      </div>
      <div className="gallery-scroll-indicator">
        <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />
      </div>
    </section>
  );
}
