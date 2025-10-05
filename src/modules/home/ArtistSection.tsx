import Container from '@/components/Container';

export default function ArtistSection() {
  const artists = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      specialty: 'Realistic Tattoos',
      experience: '8 years',
      image: '/images/hero.png',
      description: 'Specialized in realistic portraits and nature-inspired designs'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      specialty: 'Traditional Japanese',
      experience: '6 years',
      image: '/images/pic1.png',
      description: 'Master of traditional Japanese tattoo art and cultural symbolism'
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      specialty: 'Black & Grey',
      experience: '10 years',
      image: '/images/hero.png',
      description: 'Expert in black and grey realism with incredible attention to detail'
    }
  ];

  return (
    <section className="artist-section">
      <Container>
        <div className="artist-header">
          <h2 className="artist-title">Our Artists</h2>
          <p className="artist-subtitle">
            Meet our talented team of professional tattoo artists, each bringing their unique style and expertise to create the perfect piece for you.
          </p>
        </div>
        
        <div className="artists-grid">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <div className="artist-image">
                <img src={artist.image} alt={artist.name} />
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
                <button className="artist-button">View Portfolio</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="artist-cta">
          <p className="cta-text">Ready to work with our artists?</p>
          <a href="#book" className="cta-button">Book Consultation</a>
        </div>
      </Container>
    </section>
  );
}
