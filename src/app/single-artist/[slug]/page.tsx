import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';

const mockArtists = {
  'kian-mokhtari': {
    id: 1,
    name: 'Kian Mokhtari',
    title: 'Realism & Portrait Specialist',
    bio: 'Kian crafts high-impact realism pieces with a cinematic touch, blending fine art training and tattoo craft. He loves transforming your references into hyper-detailed, story-driven tattoos.',
    specialties: ['Realistic Portraits', 'Black & Grey', 'Fine Line', 'Color Realism'],
    experience: '10+ Years',
    location: 'Vancouver, BC',
    heroImage: '/images/Kian/kian_hero.jpg',
    social: {
      instagram: 'tattoo_kian',
      facebook: 'KianMokhtariTattoo',
      website: 'redtattoo.ca'
    },
    portfolio: [
      {
        id: 1,
        title: 'Monochrome Character Study',
        image: '/images/Kian/kian_gallery-1.jpg',
        category: 'Portrait',
        year: '2024'
      },
      {
        id: 2,
        title: 'Cinematic Narrative Sleeve',
        image: '/images/Kian/kian_gallery-2.jpg',
        category: 'Black & Grey',
        year: '2023'
      },
      {
        id: 3,
        title: 'Textured Realism Composition',
        image: '/images/general/general-1.png',
        category: 'Black & Grey',
        year: '2024'
      },
      {
        id: 4,
        title: 'Mythic Guardian Detail',
        image: '/images/general/general-2.webp',
        category: 'Realism',
        year: '2024'
      },
      {
        id: 5,
        title: 'High-Contrast Character Profile',
        image: '/images/general/general-3.webp',
        category: 'Portrait',
        year: '2024'
      },
      {
        id: 6,
        title: 'Cinematic Knight Portrait',
        image: '/images/general/Kian-2.webp',
        category: 'Black & Grey',
        year: '2024'
      },
      {
        id: 7,
        title: 'Story-Driven Sleeve Segment',
        image: '/images/general/Kian-3.webp',
        category: 'Realism',
        year: '2024'
      },
    
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'Next week',
      bookingLink: '#book'
    }
  },
  'masi-aghdam': {
    id: 2,
    name: 'Masi Aghdam',
    title: 'Fine Line & Script Specialist',
    bio: 'Masi focuses on refined fine-line compositions, bespoke lettering, and meaningful micro-realism pieces. Her work blends elegance with clean execution for long-lasting detail.',
    specialties: ['Fine Line', 'Script', 'Micro Realism', 'Color', 'Black & Grey'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    heroImage: '/images/Masi/Masi-1.jpg',
    social: {
      instagram: 'masiworldtattoo',
      facebook: 'MasiAghdamTattoo',
      website: 'vansunstudio.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Delicate Fine Line Rose',
        image: '/images/Masi/Masi-tattoo.webp',
        category: 'Fine Line',
        year: '2025'
      },
      {
        id: 2,
        title: 'Micro Realism Portrait Detail',
        image: '/images/Masi/Masi-tattoo-7.webp',
        category: 'Micro Realism',
        year: '2025'
      },
      {
        id: 3,
        title: 'Elegant Script Accent',
        image: '/images/Masi/Masi-tattoo-8.webp',
        category: 'Script',
        year: '2024'
      },
      {
        id: 4,
        title: 'Color Bloom Panel',
        image: '/images/Masi/Masi-tattoo-9.webp',
        category: 'Color',
        year: '2024'
      },
      {
        id: 5,
        title: 'Gradient Script Flow',
        image: '/images/Masi/Masi-tattoo-10.png',
        category: 'Color Script',
        year: '2023'
      },
      {
        id: 6,
        title: 'Sculpted Script Panel',
        image: '/images/Masi/Masi-tattoo-11.png',
        category: 'Script',
        year: '2023'
      },
      {
        id: 7,
        title: 'Abstract Fine Line Bloom',
        image: '/images/Masi/Masi-tattoo-13.webp',
        category: 'Fine Line',
        year: '2022'
      },
      {
        id: 8,
        title: 'Color Washed Florals',
        image: '/images/Masi/Masi-tattoo-14.webp',
        category: 'Color',
        year: '2022'
      },
      {
        id: 9,
        title: 'Minimal Botanical Wrap',
        image: '/images/Masi/Masi-tattoo-15.webp',
        category: 'Fine Line',
        year: '2022'
      },
      {
        id: 10,
        title: 'Chromatic Linear Flow',
        image: '/images/Masi/Masi-tattoo-16.webp',
        category: 'Color',
        year: '2021'
      },
      {
        id: 11,
        title: 'Pastel Script Accent',
        image: '/images/Masi/Masi-tattoo-18.webp',
        category: 'Color Script',
        year: '2021'
      },
      {
        id: 12,
        title: 'Watercolor Bloom',
        image: '/images/Masi/Masi-Tattoo-6.webp',
        category: 'Watercolor',
        year: '2020'
      },
      {
        id: 13,
        title: 'Soft Gradient Floral',
        image: '/images/Masi/21.webp',
        category: 'Color',
        year: '2020'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'This week',
      bookingLink: '#book'
    }
  },
  'mina-khanian': {
    id: 3,
    name: 'Mina Khanian',
    title: 'Watercolor & Illustrative Artist',
    bio: 'Mina Khanian combines fluid watercolor gradients with precision line work, layering minimalist structure over emotive color to keep every piece vibrant and full of motion.',
    specialties: ['Fine Line', 'Minimalist', 'Color', 'Black & Grey', 'Watercolor'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    heroImage: '/images/Mina/Mina-1.webp',
    social: {
      instagram: 'minatattoominimal',
      facebook: 'MinaKhanianTattoo',
      website: 'redtattoo.ca'
    },
    portfolio: [
      {
        id: 1,
        title: 'Pastel Bloom Flow',
        image: '/images/Mina/Mina-2.webp',
        category: 'Color',
        year: '2024'
      },
      {
        id: 2,
        title: 'Minimal Botanical Accent',
        image: '/images/Mina/Mina-3.webp',
        category: 'Fine Line',
        year: '2024'
      },
      {
        id: 3,
        title: 'Chromatic Feather Detail',
        image: '/images/Mina/Mina-4.webp',
        category: 'Color Realism',
        year: '2023'
      },
      {
        id: 4,
        title: 'Monochrome Floral Wrap',
        image: '/images/Mina/Mina-5.webp',
        category: 'Black & Grey',
        year: '2023'
      },
      {
        id: 5,
        title: 'Geometric Line Harmony',
        image: '/images/Mina/Mina-6.webp',
        category: 'Minimalist',
        year: '2022'
      },
      {
        id: 6,
        title: 'Watercolor Flow Sleeve',
        image: '/images/Mina/Mina-7.webp',
        category: 'Watercolor',
        year: '2022'
      },
      {
        id: 7,
        title: 'Minimal Flower Cluster',
        image: '/images/Mina/Mina-8.webp',
        category: 'Fine Line',
        year: '2021'
      },
      {
        id: 8,
        title: 'Color Burst Bouquet',
        image: '/images/Mina/Mina-9.webp',
        category: 'Color',
        year: '2021'
      },
      {
        id: 9,
        title: 'Chromatic Feather',
        image: '/images/Mina/Mina-10.webp',
        category: 'Color',
        year: '2021'
      },
      {
        id: 10,
        title: 'Pastel Floral Cascade',
        image: '/images/Mina/Mina-11.webp',
        category: 'Watercolor',
        year: '2020'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'This month',
      bookingLink: '#book'
    }
  },
  'mina-khani': {
    id: 3,
    name: 'Mina Khanian',
    title: 'Watercolor & Illustrative Artist',
    bio: 'Mina Khanian combines fluid watercolor gradients with precision line work, layering minimalist structure over emotive color to keep every piece vibrant and full of motion.',
    specialties: ['Fine Line', 'Minimalist', 'Color', 'Black & Grey', 'Watercolor'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    heroImage: '/images/Mina/Mina-1.webp',
    social: {
      instagram: 'minatattoominimal',
      facebook: 'MinaKhanianTattoo',
      website: 'redtattoo.ca'
    },
    portfolio: [
      {
        id: 1,
        title: 'Pastel Bloom Flow',
        image: '/images/Mina/Mina-2.webp',
        category: 'Color',
        year: '2024'
      },
      {
        id: 2,
        title: 'Minimal Botanical Accent',
        image: '/images/Mina/Mina-3.webp',
        category: 'Fine Line',
        year: '2024'
      },
      {
        id: 3,
        title: 'Chromatic Feather Detail',
        image: '/images/Mina/Mina-4.webp',
        category: 'Color Realism',
        year: '2023'
      },
      {
        id: 4,
        title: 'Monochrome Floral Wrap',
        image: '/images/Mina/Mina-5.webp',
        category: 'Black & Grey',
        year: '2023'
      },
      {
        id: 5,
        title: 'Geometric Line Harmony',
        image: '/images/Mina/Mina-6.webp',
        category: 'Minimalist',
        year: '2022'
      },
      {
        id: 6,
        title: 'Watercolor Flow Sleeve',
        image: '/images/Mina/Mina-7.webp',
        category: 'Watercolor',
        year: '2022'
      },
      {
        id: 7,
        title: 'Minimal Flower Cluster',
        image: '/images/Mina/Mina-8.webp',
        category: 'Fine Line',
        year: '2021'
      },
      {
        id: 8,
        title: 'Color Burst Bouquet',
        image: '/images/Mina/Mina-9.webp',
        category: 'Color',
        year: '2021'
      },
      {
        id: 9,
        title: 'Chromatic Feather',
        image: '/images/Mina/Mina-10.webp',
        category: 'Color',
        year: '2021'
      },
      {
        id: 10,
        title: 'Pastel Floral Cascade',
        image: '/images/Mina/Mina-11.webp',
        category: 'Watercolor',
        year: '2020'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'This month',
      bookingLink: '#book'
    }
  },
  'sami-amiri': {
    id: 4,
    name: 'Sami Amiri',
    title: 'Fine Line, Color & Realism Artist',
    bio: 'Sami specializes in refined fine line work, bold color gradients, and realistic storytelling. Her minimalist approach channels depth without sacrificing emotion.',
    specialties: ['Fine Line', 'Minimalist', 'Blackwork', 'Color', 'Realism'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    heroImage: '/images/sami/IMG_2615.webp',
    social: {
      instagram: '@sami_amiri_art',
      facebook: 'SamiAmiriTattoos',
      website: 'samiamiri.com'
    },
    portfolio: [
      {
        id: 1,
        title: 'Fine Line Mandala Accent',
        image: '/images/sami/IMG_2654.webp',
        category: 'Fine Line',
        year: '2024'
      },
      {
        id: 2,
        title: 'Geometric Pattern Flow',
        image: '/images/sami/IMG_3041.webp',
        category: 'Geometric',
        year: '2023'
      },
      {
        id: 3,
        title: 'Color Gradient Script',
        image: '/images/sami/20250803_162655 (1).webp',
        category: 'Color',
        year: '2024'
      },
      {
        id: 4,
        title: 'Realistic Floral Panel',
        image: '/images/sami/IMG_3636.JPG',
        category: 'Realism',
        year: '2022'
      },
      {
        id: 6,
        title: 'Bold Blackwork Contrast',
        image: '/images/sami/IMG_4056.JPG',
        category: 'Blackwork',
        year: '2023'
      },
      {
        id: 7,
        title: 'Fine Script Accent',
        image: '/images/sami/IMG_4765.JPG',
        category: 'Fine Line',
        year: '2023'
      },
      {
        id: 8,
        title: 'Textured Mythical Study',
        image: '/images/sami/97992305-F07C-4910-B9A7-2BE771A9CB0B (1).webp',
        category: 'Realism',
        year: '2021'
      },
      {
        id: 9,
        title: 'Detailed Texture Panel',
        image: '/images/sami/BCBFE364-3E30-45A8-B6EF-725FCB9F0C49.webp',
        category: 'Realism',
        year: '2021'
      }
    ],
    availability: {
      status: 'Available',
      nextAppointment: 'Next month',
      bookingLink: '#book'
    }
  }
} as const;

type ArtistKey = keyof typeof mockArtists;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return Object.keys(mockArtists).map((slug) => ({ slug }));
}

interface ArtistPageProps {
  params?: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const resolvedParams = params ? await params : undefined;
  const slug = resolvedParams?.slug ?? 'kian-mokhtari';
  const artist = mockArtists[slug as ArtistKey];

  if (!artist) {
    notFound();
  }

  return (
    <div className="single-artist-page">
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
                  src={artist.heroImage ?? '/images/hero.png'}
                  alt={artist.name}
                  width={600}
                  height={600}
                  className="artist-photo"
                  priority
                />
                <div className="artist-image-overlay" />
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
              <a href={`https://facebook.com/${artist.social.facebook}`} className="contact-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
              <a href={`https://${artist.social.website}`} className="contact-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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