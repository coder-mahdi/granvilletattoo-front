import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHorizontalScrollHijackOptions {
  sectionRef: RefObject<HTMLElement | null>;
  galleryRef: RefObject<HTMLDivElement | null>;
  onProgressChange: (progress: number) => void;
  enabled?: boolean;
}

export function useHorizontalScrollHijack({
  sectionRef,
  galleryRef,
  onProgressChange,
  enabled = true
}: UseHorizontalScrollHijackOptions) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery) return;

    // Calculate max horizontal scroll
    const getMaxScroll = () => gallery.scrollWidth - gallery.clientWidth;

    // Create ScrollTrigger for horizontal scroll hijacking
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${getMaxScroll()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxScroll = getMaxScroll();
        
        gsap.to(gallery, {
          scrollLeft: progress * maxScroll,
          duration: 0.1,
          ease: 'none',
          overwrite: true,
        });
        
        onProgressChange(progress);
      },
    });

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [enabled, sectionRef, galleryRef, onProgressChange]);
}
