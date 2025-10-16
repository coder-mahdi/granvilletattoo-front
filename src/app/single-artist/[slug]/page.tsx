'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/Container';
import LoadingAnimation from '@/components/animations/LoadingAnimation';

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
      }
    ],
    availability: {
      status: 'Booked',
      nextAppointment: '2 weeks',
      bookingLink: '#waitlist'
    }
  }
};

export default function ArtistPage() {
  const params = useParams();
  const [showContent, setShowContent] = useState(false);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

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

    return () => clearTimeout(timer);
  }, [params?.slug]);

  if (loading) {
    return <LoadingAnimation showContent={false} />;
  }

  if (!artist) {
    return (
      <div className="single-artist-not-found">
        <Container>
          <div className="not-found-content">
            <h1>Artist Not Found</h1>
            <p>The artist you're looking for doesn't exist.</p>
            <a href="/" className="back-home-btn">Back to Home</a>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="single-artist-page">
      <LoadingAnimation showContent={showContent} />
      
      <div className={`main-content ${showContent ? 'show' : ''}`}>
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
                  <a href={artist.availability.bookingLink} className="book-btn">
                    {artist.availability.status === 'Available' ? 'Book Now' : 'Join Waitlist'}
                  </a>
                  <a href="#portfolio" className="portfolio-btn">View Portfolio</a>
                </div>
              </div>
              
              <div className="artist-image">
                <img src="/images/hero.png" alt={artist.name} />
              </div>
            </div>
          </Container>
        </section>

        {/* Specialties Section */}
        <section className="single-artist-specialties">
          <Container>
            <h3>Specialties</h3>
            <div className="specialties-grid">
              {artist.specialties.map((specialty: string, index: number) => (
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
              {artist.portfolio.map((work: any) => (
                <div key={work.id} className="portfolio-item">
                  <div className="portfolio-image">
                    <img src={work.image} alt={work.title} />
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
                📷 Instagram
              </a>
              <a href={`https://facebook.com/${artist.social.facebook}`} className="contact-link">
                📘 Facebook
              </a>
              <a href={`https://${artist.social.website}`} className="contact-link">
                🌐 Website
              </a>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}
