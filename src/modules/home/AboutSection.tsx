import Image from 'next/image';
import Container from '@/components/Container';

export default function AboutSection() {
  const features = [
    {
      image: '/images/hero.png',
      title: 'Professional Artists',
      description: 'Our team of skilled artists brings years of experience and passion to every piece.'
    },
    {
      image: '/images/pic1.png',
      title: 'Award Winning',
      description: 'Recognized as Vancouver&apos;s premier tattoo studio with numerous industry awards.'
    },
    {
      image: '/images/hero.png',
      title: 'Safe & Clean',
      description: 'We maintain the highest standards of hygiene and safety in all our procedures.'
    }
  ];

  return (
    <section className="about-section">
      <Container>
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">About Granville Tattoo</h2>
            <p className="about-description">
              For over two decades, Granville Tattoo has been Vancouver&apos;s most trusted destination for exceptional tattoo art and piercing services. Our studio combines traditional craftsmanship with modern techniques to create stunning, personalized body art that tells your unique story.
            </p>
            <p className="about-description">
              Located in the heart of Vancouver, we&apos;ve built our reputation on quality, creativity, and an unwavering commitment to customer satisfaction. Every artist in our studio is professionally trained, licensed, and passionate about their craft.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">20+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          
          <div className="about-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-image">
                  <Image src={feature.image} alt={feature.title} width={360} height={360} className="feature-img" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
