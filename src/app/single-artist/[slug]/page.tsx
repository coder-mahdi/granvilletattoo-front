'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Container from '@/components/Container';
// // import LoadingAnimation from '@/components/animations/LoadingAnimation';

// Mock data - will be replaced with API calls
const mockArtists = {
  'john-doe': {
    id: 1,
    name: 'John Doe',
    title: 'Senior Tattoo Artist',
    bio: 'With over 10 years of experience in the tattoo industry, John specializes in realistic portraits and black & grey work. His attention to detail and artistic vision has earned him recognition in international tattoo conventions.',
    specialties: ['Realistic Portraits', 'Black & Grey', 'Traditional', 'Geometric'],
    experience: '10+ Years',
    location: 'Vancouver, BC',
    social: {
      instagram: '@johndoe_tattoos',
      facebook: 'JohnDoeTattoos',
      website: 'johndoe.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Portrait Masterpiece',
        image: '/images/pic1.png',
        category: 'Portrait',
        year: '2023'
      },
      {
        id: 2,
        title: 'Geometric Design',
        image: '/images/hero.png',
        category: 'Geometric',
        year: '2023'
      },
      {
        id: 3,
        title: 'Traditional Rose',
        image: '/images/pic1.png',
        category: 'Traditional',
        year: '2022'
      },
      {
        id: 4,
        title: 'Black & Grey Lion',
        image: '/images/hero.png',
        category: 'Black & Grey',
        year: '2022'
      },
      {
        id: 5,
        title: 'Realistic Eagle',
        image: '/images/pic1.png',
        category: 'Realistic',
        year: '2023'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'Next week',
      bookingLink: '#book'
    }
  },
  'jane-smith': {
    id: 2,
    name: 'Jane Smith',
    title: 'Color Specialist',
    bio: 'Jane is known for her vibrant color work and creative designs. She has been featured in multiple tattoo magazines and has won several awards for her innovative approach to color tattooing.',
    specialties: ['Color Work', 'Watercolor', 'Neo-Traditional', 'Japanese'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    social: {
      instagram: '@janesmith_art',
      facebook: 'JaneSmithTattoos',
      website: 'janesmith.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Watercolor Butterfly',
        image: '/images/pic1.png',
        category: 'Watercolor',
        year: '2023'
      },
      {
        id: 2,
        title: 'Japanese Dragon',
        image: '/images/hero.png',
        category: 'Japanese',
        year: '2023'
      },
      {
        id: 3,
        title: 'Colorful Phoenix',
        image: '/images/pic1.png',
        category: 'Color Work',
        year: '2023'
      },
      {
        id: 4,
        title: 'Neo-Traditional Wolf',
        image: '/images/hero.png',
        category: 'Neo-Traditional',
        year: '2022'
      },
      {
        id: 5,
        title: 'Watercolor Flower',
        image: '/images/pic1.png',
        category: 'Watercolor',
        year: '2022'
      }
    ],
    availability: {
      status: 'Booked',
      nextAppointment: '2 weeks',
      bookingLink: '#waitlist'
    }
  },
  'alex-rodriguez': {
    id: 3,
    name: 'Alex Rodriguez',
    title: 'Black & Grey Specialist',
    bio: 'Alex specializes in black and grey realism with incredible attention to detail. His work has been featured in international tattoo conventions and he has over 6 years of experience.',
    specialties: ['Black & Grey', 'Realism', 'Portraits', 'Geometric'],
    experience: '6+ Years',
    location: 'Vancouver, BC',
    social: {
      instagram: '@alexrodriguez_tattoos',
      facebook: 'AlexRodriguezTattoos',
      website: 'alexrodriguez.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Realistic Portrait',
        image: '/images/hero.png',
        category: 'Portrait',
        year: '2023'
      },
      {
        id: 2,
        title: 'Geometric Mandala',
        image: '/images/pic1.png',
        category: 'Geometric',
        year: '2023'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'This week',
      bookingLink: '#book'
    }
  },
  'elena-martinez': {
    id: 4,
    name: 'Elena Martinez',
    title: 'Fine Line Artist',
    bio: 'Elena specializes in delicate fine line work and intricate geometric patterns. Her minimalist approach and precision have made her one of the most sought-after artists in Vancouver.',
    specialties: ['Fine Line', 'Geometric', 'Minimalist', 'Blackwork'],
    experience: '5+ Years',
    location: 'Vancouver, BC',
    social: {
      instagram: '@elenamartinez_art',
      facebook: 'ElenaMartinezTattoos',
      website: 'elenamartinez.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Fine Line Mandala',
        image: '/images/pic1.png',
        category: 'Fine Line',
        year: '2023'
      },
      {
        id: 2,
        title: 'Geometric Pattern',
        image: '/images/hero.png',
        category: 'Geometric',
        year: '2023'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'Next month',
      bookingLink: '#book'
    }
  }
};

type Artist = (typeof mockArtists)[keyof typeof mockArtists];

export default function ArtistPage() {
  const params = useParams();
  // const [showContent, setShowContent] = useState(false);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchArtist = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const slug = params?.slug as string;
        const artistData = mockArtists[slug as keyof typeof mockArtists];
        
        if (artistData) {
          setArtist(artistData);
        } else {
          // Handle 404 - artist not found
          setArtist(null);
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [params?.slug]);

  if (loading) {
    // return <LoadingAnimation showContent={false} />;
    return <div>Loading...</div>;
  }

  if (!artist) {
    return (
      <div className="single-artist-not-found">
        <Container>
          <div className="not-found-content">
            <h1>Artist Not Found</h1>
            <p>The artist you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="back-home-btn">Back to Home</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="single-artist-page">
      {/* <LoadingAnimation showContent={showContent} /> */}
      
      <div className="main-content show">
        {/* Hero Section */}
        <section className="single-artist-hero">
          <Container>
            <div className="artist-hero-content">
              <div className="artist-info">
                <h1 className="artist-name">{artist.name}</h1>
                <h2 className="artist-title">{artist.title}</h2>
                <p className="artist-bio">{artist.bio}</p>
                
                <div className="artist-details">
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{artist.experience}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{artist.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status ${artist.availability.status.toLowerCase()}`}>
                      {artist.availability.status}
                    </span>
                  </div>
                </div>

                <div className="artist-actions">
                  <Link href="/booking" className="book-btn">
                    {artist.availability.status === 'Available' ? 'Book Now' : 'Join Waitlist'}
                  </Link>
                </div>
              </div>
              
              <div className="artist-image">
                <Image
                  src="/images/hero.png"
                  alt={artist.name}
                  width={600}
                  height={600}
                  className="artist-photo"
                  priority
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Specialties Section */}
        <section className="single-artist-specialties">
          <Container>
            <h3>Specialties</h3>
            <div className="specialties-grid">
              {artist.specialties.map((specialty, index) => (
                <div key={index} className="specialty-item">
                  {specialty}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="single-artist-portfolio">
          <Container>
            <h3>Portfolio</h3>
            <div className="portfolio-grid">
              {artist.portfolio.map((work) => (
                <div key={work.id} className="portfolio-item">
                  <div className="portfolio-image">
                    <Image
                      src={work.image}
                      alt={work.title}
                      width={480}
                      height={480}
                      className="portfolio-img"
                    />
                    <div className="portfolio-overlay">
                      <h4>{work.title}</h4>
                      <p>{work.category} • {work.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="single-artist-contact">
          <Container>
            <h3>Connect with {artist.name}</h3>
            <div className="contact-links">
              <a href={`https://instagram.com/${artist.social.instagram}`} className="contact-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              <a href={`https://facebook.com/${artist.social.facebook}`} className="contact-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a href={`https://${artist.social.website}`} className="contact-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Website
              </a>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
