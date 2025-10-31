
'use client';

import { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/animations/LoadingAnimation';
import HeroSection from '@/modules/home/HeroSection';
import AboutSection from '@/modules/home/AboutSection';
import ArtistSection from '@/modules/home/ArtistSection';
import GallerySection from '@/modules/home/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hasVisited = sessionStorage.getItem('granville_hasVisited');
    if (hasVisited) {
      setShowContent(true);
      setShowLoader(false);
      return;
    }

    let loaderTimeout: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setShowContent(true);
      sessionStorage.setItem('granville_hasVisited', 'true');
      loaderTimeout = setTimeout(() => setShowLoader(false), 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (loaderTimeout) clearTimeout(loaderTimeout);
    };
  }, []);

  return (
    <section className="home">
      {showLoader && <LoadingAnimation showContent={showContent} />}
      
      <div className={`main-content ${showContent ? 'show' : ''}`}>
        <HeroSection />
        <GallerySection />
        <ArtistSection />
        <TestimonialsSection />
        <AboutSection />
      </div>
    </section>
  );
}
