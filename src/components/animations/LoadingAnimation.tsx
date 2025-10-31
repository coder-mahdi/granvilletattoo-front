'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface LoadingAnimationProps {
  showContent: boolean;
}

export default function LoadingAnimation({ showContent }: LoadingAnimationProps) {
  const images = useMemo(
    () => [
      '/images/logo.webp',
      '/images/IMG_1.png',
      '/images/IMG_2.png',
      '/images/IMG_3.png',
      '/images/IMG_5.png',
    ],
    []
  );

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 250);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={`loading-overlay ${showContent ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-text">
          <span>Granville</span>
          <span>Tattoo Shop</span>
        </div>
        <div className="loading-divider"></div>
        <div className="loading-images">
          {images.map((src, index) => (
            <div
              key={src}
              className={`loading-image ${currentImage === index ? 'active' : ''}`}
              style={{ zIndex: images.length - index }}
            >
              <Image
                src={src}
                alt="Granville Tattoo preview"
                fill
                sizes="(max-width: 768px) 220px, 120px"
                priority
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
