'use client';

import { useRef, useState } from 'react';
import { useHorizontalScrollHijack } from '@/hooks/useHorizontalScrollHijack';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Use custom hook for scroll hijacking logic
  useHorizontalScrollHijack({
    sectionRef,
    galleryRef,
    onProgressChange: setScrollProgress,
    enabled: true
  });

  const galleryImages = [
    { id: 1, src: '/images/pic1.png', alt: 'Tattoo 1' },
    { id: 2, src: '/images/hero.png', alt: 'Tattoo 2' },
    { id: 3, src: '/images/pic1.png', alt: 'Tattoo 3' },
    { id: 4, src: '/images/hero.png', alt: 'Tattoo 4' },
    { id: 5, src: '/images/pic1.png', alt: 'Tattoo 5' },
    { id: 6, src: '/images/hero.png', alt: 'Tattoo 6' },
    { id: 7, src: '/images/pic1.png', alt: 'Tattoo 7' },
    { id: 8, src: '/images/hero.png', alt: 'Tattoo 8' },
    { id: 9, src: '/images/pic1.png', alt: 'Tattoo 9' },
    { id: 10, src: '/images/hero.png', alt: 'Tattoo 10' },
    { id: 11, src: '/images/pic1.png', alt: 'Tattoo 11' },
    { id: 12, src: '/images/hero.png', alt: 'Tattoo 12' },
  ];

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
            <img src={image.src} alt={image.alt} draggable="false" />
          </div>
        ))}
      </div>
      <div className="gallery-scroll-indicator">
        <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }} />
      </div>
    </section>
  );
}
