'use client';

import { useEffect, useRef, useState } from 'react';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery) return;

    const onWheel = (e: WheelEvent) => {
      // Check if user is in the entire gallery section (title + images)
      const rect = section.getBoundingClientRect();
      const isInSection = rect.top <= 0 && rect.bottom > 0;

      if (isInSection) {
        const maxScrollLeft = gallery.scrollWidth - gallery.offsetWidth;
        const isAtStart = gallery.scrollLeft <= 10;
        const isAtEnd = gallery.scrollLeft >= maxScrollLeft - 10;
        
        // Check if scrolling down and at end of horizontal scroll
        if (e.deltaY > 0 && isAtEnd) {
          // Allow vertical scroll to continue down
          document.body.style.overflow = 'auto';
          return;
        }
        
        // Check if scrolling up and at start of horizontal scroll
        if (e.deltaY < 0 && isAtStart) {
          // Allow vertical scroll to continue up
          document.body.style.overflow = 'auto';
          return;
        }
        
        // Prevent vertical scroll and apply horizontal scroll only to images
        e.preventDefault();
        gallery.scrollLeft += e.deltaY;
        
        // Update scroll progress
        const scrollProgress = gallery.scrollLeft / maxScrollLeft;
        setScrollProgress(Math.min(Math.max(scrollProgress, 0), 1));
        
        // Keep overflow hidden during horizontal scrolling
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const isInSection = rect.top <= 0 && rect.bottom > 0;
      setIsInView(isInSection);
      
      // Reset scroll when section is not in view
      if (!isInSection) {
        if (rect.top > 0) {
          // Section is below viewport, reset to start
          gallery.scrollLeft = 0;
          setScrollProgress(0);
        } else if (rect.bottom < 0) {
          // Section is above viewport, reset to end
          gallery.scrollLeft = gallery.scrollWidth - gallery.offsetWidth;
          setScrollProgress(1);
        }
      }
    };

    // Initial check
    handleScroll();

    // Event listeners
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', onWheel);
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
      <div className="gallery-horizontal" ref={galleryRef}>
        {galleryImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      {isInView && (
        <div className="gallery-scroll-indicator">
          <div className="scroll-progress" style={{ width: `${scrollProgress * 100}%` }}></div>
        </div>
      )}
    </section>
  );
}
