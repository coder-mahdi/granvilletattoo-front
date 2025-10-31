'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';

export default function ArtistSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const artists = [
    {
      id: 1,
      name: 'John Doe',
      specialty: 'Realistic Portraits',
      experience: '10+ years',
      image: '/images/hero.png',
      description: 'Specialized in realistic portraits and black & grey work',
      slug: 'john-doe'
    },
    {
      id: 2,
      name: 'Jane Smith',
      specialty: 'Traditional Japanese',
      experience: '8 years',
      image: '/images/pic1.png',
      description: 'Master of traditional Japanese tattoo art and cultural symbolism',
      slug: 'jane-smith'
    },
    {
      id: 3,
      name: 'Alex Rodriguez',
      specialty: 'Black & Grey',
      experience: '6 years',
      image: '/images/hero.png',
      description: 'Expert in black and grey realism with incredible attention to detail',
      slug: 'alex-rodriguez'
    },
    {
      id: 4,
      name: 'Elena Martinez',
      specialty: 'Fine Line & Geometric',
      experience: '5 years',
      image: '/images/pic1.png',
      description: 'Specializing in delicate fine line work and intricate geometric patterns',
      slug: 'elena-martinez'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Start animation when section enters viewport
      const startPoint = windowHeight;
      const endPoint = windowHeight - sectionHeight;
      
      let progress = 0;
      if (sectionTop < startPoint && sectionTop > endPoint) {
        progress = Math.min(1, Math.max(0, (startPoint - sectionTop) / (startPoint - endPoint)));
      } else if (sectionTop <= endPoint) {
        progress = 1;
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="artist-section">
      <Container>
        <div className="artist-header">
          <h2 className="artist-title">Our Artists</h2>
          <p className="artist-subtitle">
            Meet our talented team of professional tattoo artists, each bringing their unique style and expertise to create the perfect piece for you.
          </p>
        </div>
        
        <div className="artists-container">
          <div className="artists-grid">
            {artists.map((artist, index) => {
              const isLeftSide = index % 2 === 0;
              // Same progress for both left and right cards in each row
              const rowIndex = Math.floor(index / 2);
              const cardProgress = Math.max(0, Math.min(1, (scrollProgress - rowIndex * 0.2) / 0.4));
              
              const translateX = isLeftSide 
                ? -300 + (300 * cardProgress)  // Increased from 100 to 300
                : 300 - (300 * cardProgress);   // Increased from 100 to 300
              const opacity = cardProgress;
              
              return (
                <div 
                  key={artist.id} 
                  className="artist-card"
                  style={{ 
                    transform: `translateX(${translateX}px)`,
                    opacity: opacity,
                    transition: 'none'
                  }}
                >
                  <div className="artist-image">
                    <Image src={artist.image} alt={artist.name} width={480} height={480} className="artist-card-img" />
                    <div className="artist-overlay">
                      <div className="artist-info">
                        <h3 className="artist-name">{artist.name}</h3>
                        <p className="artist-specialty">{artist.specialty}</p>
                        <p className="artist-experience">{artist.experience} experience</p>
                      </div>
                    </div>
                  </div>
                  <div className="artist-details">
                    <p className="artist-description">{artist.description}</p>
                    <Link href={`/single-artist/${artist.slug}`} className="artist-button">View Portfolio</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}