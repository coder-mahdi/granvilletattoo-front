import Container from '@/components/Container';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <Container className="hero-container">
        <h1 className="hero-title">Granville Tattoo</h1>
        <p className="hero-description">
          Where tattoos and piercings meet art Vancouver's premier studio for bold designs, expert artists, and an unforgettable experience
        </p>
        <div className="hero-buttons">
          <a href="#book" className="btn btn-primary">Book Now</a>
        </div>
        
        <div className="hero-side-nav">
          <a href="/artist" className="nav-link">Artists</a>
          <a href="/gallery" className="nav-link">Gallery</a>
          <a href="/services" className="nav-link">Services</a>
        </div>
      </Container>
    </section>
  );
}
