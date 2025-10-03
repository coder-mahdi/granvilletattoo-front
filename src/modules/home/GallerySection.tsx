'use client';

import { useEffect, useRef } from 'react';
import Container from '@/components/Container';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      
      if (isInView) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const galleryImages = [
    { id: 1, src: '/images/pic1.png', alt: 'Tattoo 1' },
    { id: 2, src: '/images/hero.png', alt: 'Tattoo 2' },
    { id: 3, src: '/images/pic1.png', alt: 'Tattoo 3' },
    { id: 4, src: '/images/hero.png', alt: 'Tattoo 4' },
    { id: 5, src: '/images/pic1.png', alt: 'Tattoo 5' },
    { id: 6, src: '/images/hero.png', alt: 'Tattoo 6' },
    { id: 7, src: '/images/pic1.png', alt: 'Tattoo 7' },
    { id: 8, src: '/images/hero.png', alt: 'Tattoo 8' },
  ];

  return (
    <section ref={sectionRef} className="gallery-section">
      <Container>
        <h2 className="gallery-title">Our Work</h2>
        <div className="gallery-horizontal">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
