import Container from '@/components/Container';

export default function AboutSection() {
  const features = [
    {
      icon: '🎨',
      title: 'Professional Artists',
      description: 'Our team of skilled artists brings years of experience and passion to every piece.'
    },
    {
      icon: '🏆',
      title: 'Award Winning',
      description: 'Recognized as Vancouver\'s premier tattoo studio with numerous industry awards.'
    },
    {
      icon: '🔒',
      title: 'Safe & Clean',
      description: 'We maintain the highest standards of hygiene and safety in all our procedures.'
    },
    {
      icon: '⭐',
      title: '5-Star Service',
      description: 'Thousands of satisfied customers with consistently excellent reviews.'
    }
  ];

  return (
    <section className="about-section">
      <Container>
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">About Granville Tattoo</h2>
            <p className="about-description">
              For over two decades, Granville Tattoo has been Vancouver's most trusted destination for exceptional tattoo art and piercing services. Our studio combines traditional craftsmanship with modern techniques to create stunning, personalized body art that tells your unique story.
            </p>
            <p className="about-description">
              Located in the heart of Vancouver, we've built our reputation on quality, creativity, and an unwavering commitment to customer satisfaction. Every artist in our studio is professionally trained, licensed, and passionate about their craft.
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
                <div className="feature-icon">{feature.icon}</div>
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
