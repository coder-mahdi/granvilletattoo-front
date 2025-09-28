
'use client';

import { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/animations/LoadingAnimation';
import HeroSection from '@/modules/home/HeroSection';
import AboutSection from '@/modules/home/AboutSection';
import GallerySection from '@/modules/home/GallerySection';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="home">
      <LoadingAnimation showContent={showContent} />
      
      <div className={`main-content ${showContent ? 'show' : ''}`}>
        <HeroSection />
        <AboutSection />
        <GallerySection />
      </div>
    </section>
  );
}
