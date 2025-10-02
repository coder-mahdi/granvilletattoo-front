import Container from '@/components/Container';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <Container className="hero-container">
        <h1 className="hero-title">Granville Tattoo</h1>
        <h2 className="hero-subtitle">Tattoo Shop</h2>
        <p className="hero-description">
          Experience the legacy of traditional tattooing in Vancouver's most historic tattoo shop. 
          Our skilled artists bring decades of experience to create timeless pieces of art on your skin.
        </p>
        <div className="hero-buttons">
          <a href="#book" className="btn btn-primary">Book Now</a>
          <a href="#gallery" className="btn">View Gallery</a>
        </div>
      </Container>
    </section>
  );
}
