'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Amazing work! The attention to detail and creativity exceeded my expectations. I get compliments on my tattoo every day.",
      name: "Sarah Johnson",
      design: "Realistic Portrait"
    },
    {
      text: "Professional, clean, and incredibly talented artists. The studio has a great atmosphere and made me feel comfortable throughout the process.",
      name: "Mike Chen",
      design: "Japanese Dragon"
    },
    {
      text: "Best tattoo experience I've ever had. The artist took time to understand my vision and created something even better than I imagined.",
      name: "Emma Rodriguez",
      design: "Geometric Mandala"
    },
    {
      text: "The team here is fantastic. From consultation to completion, everything was perfect. Highly recommend to anyone looking for quality work.",
      name: "David Kim",
      design: "Traditional Rose"
    },
    {
      text: "Five stars! The studio is clean, the artists are professional, and the work speaks for itself. Will definitely be back for more.",
      name: "Lisa Thompson",
      design: "Black & Grey Lion"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="testimonials-section">
      <h3 className="testimonials-title">What Our Clients Say</h3>
      <div className="testimonials-container">
        <div className="testimonials-slider">
          <div className="testimonials-track" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-slide">
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-design">{testimonial.design}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="testimonials-controls">
          <button 
            className="testimonial-btn prev" 
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div className="testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          <button 
            className="testimonial-btn next" 
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
