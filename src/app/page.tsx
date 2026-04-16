import HeroSection from '@/modules/home/HeroSection';
import AboutSection from '@/modules/home/AboutSection';
import ArtistSection from '@/modules/home/ArtistSection';
import GallerySection from '@/modules/home/GallerySection';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  return (
    <section className="home">
      <div className="main-content">
        <HeroSection />
        <GallerySection />
        <ArtistSection />
        <TestimonialsSection />
        <AboutSection />
      </div>
    </section>
  );
}
