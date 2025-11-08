'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';

interface ArtistCard {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
  slug: string;
}

const ARTIST_CARDS: ArtistCard[] = [
  {
    id: 1,
    name: 'Kian Mokhtari',
    specialty: 'Realistic Portraits',
    experience: '10+ years',
    image: '/images/Kian/kian_hero.jpg',
    description: 'Brings cinematic realism to every piece with precise shading and detail.',
    slug: 'kian-mokhtari',
  },
  {
    id: 2,
    name: 'Masi Aghdam',
    specialty: 'Fine Line & Script',
    experience: '8 years',
    image: '/images/Masi/Masi-1.jpg',
    description: 'Crafts elegant fine-line lettering, color scripts, and micro-realism accents with delicate precision.',
    slug: 'masi-aghdam',
  },
  {
    id: 3,
    name: 'Mina Khani',
    specialty: 'Fine Line & Color',
    experience: '8 years',
    image: '/images/Mina/Mina-1.webp',
    description: 'Layers minimalist line work with watercolor blends for pieces that feel alive and in motion.',
    slug: 'mina-khani',
  },
  {
    id: 4,
    name: 'Sami Amiri',
    specialty: 'Fine Line, Color & Realism',
    experience: '8 years',
    image: '/images/Sami/IMG_2615.webp',
    description: 'Blends precise fine line work with bold color gradients and realism-driven storytelling.',
    slug: 'sami-amiri',
  },
];

function shuffleArtists(source: ArtistCard[]): ArtistCard[] {
  const copy = [...source];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function ArtistSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayArtists, setDisplayArtists] = useState<ArtistCard[]>(ARTIST_CARDS);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setDisplayArtists(shuffleArtists(ARTIST_CARDS));
  }, []);

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
          <h2 id="our-artists" className="artist-title">Our Artists</h2>
          <p className="artist-subtitle">
            Meet our talented team of professional tattoo artists, each bringing their unique style and expertise to create the perfect piece for you.
          </p>
        </div>
        
        <div className="artists-container">
          <div className="artists-grid">
            {displayArtists.map((artist, index) => {
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