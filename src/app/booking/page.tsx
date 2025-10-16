'use client';

import { useState } from 'react';
import Container from '@/components/Container';
import FAQSection from '@/components/FAQSection';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    service: '',
    fullName: '',
    email: '',
    phone: '',
    designUpload: null as File | null,
    additionalExplanation: '',
    time: '',
    date: '',
    birthDate: '',
    readTerms: false,
    consentForm: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    'Tattoo',
    'Piercing'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, designUpload: file }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.time) newErrors.time = 'Please select a time';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
    else {
      const age = calculateAge(formData.birthDate);
      if (age < 16) newErrors.birthDate = 'You must be at least 16 years old to book an appointment';
    }
    if (!formData.readTerms) newErrors.readTerms = 'You must read and accept the terms and conditions';
    if (!formData.consentForm) newErrors.consentForm = 'You must consent to the form';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Booking request submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        service: '',
        fullName: '',
        email: '',
        phone: '',
        designUpload: null,
        additionalExplanation: '',
        time: '',
        date: '',
        birthDate: '',
        readTerms: false,
        consentForm: false
      });
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <Container>
          <div className="booking-header">
            <h1 className="booking-title">Book Your Appointment</h1>
            <p className="booking-subtitle">
              Fill out the form below to schedule your tattoo or piercing appointment
            </p>
          </div>
        </Container>
      </div>
      
      <Container>
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Service Selection */}
          <div className="form-group">
            <label htmlFor="service" className="form-label">
              Service Type *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className={`form-select ${errors.service ? 'error' : ''}`}
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
            {errors.service && <span className="error-message">{errors.service}</span>}
          </div>

          {/* Personal Information */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Design Upload */}
          <div className="form-group">
            <label htmlFor="designUpload" className="form-label">
              Design Upload (Optional)
            </label>
            <input
              type="file"
              id="designUpload"
              name="designUpload"
              onChange={handleFileChange}
              accept="image/*"
              className="form-file"
            />
            <p className="form-help">Upload your design reference (JPG, PNG, PDF)</p>
          </div>

          {/* Additional Explanation */}
          <div className="form-group">
            <label htmlFor="additionalExplanation" className="form-label">
              Additional Explanation (Optional)
            </label>
            <textarea
              id="additionalExplanation"
              name="additionalExplanation"
              value={formData.additionalExplanation}
              onChange={handleInputChange}
              className="form-textarea"
              rows={4}
              placeholder="Tell us more about your desired tattoo or piercing..."
            />
          </div>

          {/* Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Preferred Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`form-input ${errors.date ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Preferred Time *
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`form-select ${errors.time ? 'error' : ''}`}
              >
                <option value="">Select a time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          {/* Birth Date */}
          <div className="form-group">
            <label htmlFor="birthDate" className="form-label">
              Date of Birth *
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={`form-input ${errors.birthDate ? 'error' : ''}`}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          {/* reCAPTCHA */}
          <div className="form-group">
            <div className="recaptcha-container">
              <div className="recaptcha-placeholder">
                <p>reCAPTCHA verification will be implemented here</p>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="form-checkboxes">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="readTerms"
                name="readTerms"
                checked={formData.readTerms}
                onChange={handleInputChange}
                className={`form-checkbox ${errors.readTerms ? 'error' : ''}`}
              />
              <label htmlFor="readTerms" className="checkbox-label">
                I have read and agree to the <a href="/terms" target="_blank" className="terms-link">Terms and Conditions</a> *
              </label>
              {errors.readTerms && <span className="error-message">{errors.readTerms}</span>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="consentForm"
                name="consentForm"
                checked={formData.consentForm}
                onChange={handleInputChange}
                className={`form-checkbox ${errors.consentForm ? 'error' : ''}`}
              />
              <label htmlFor="consentForm" className="checkbox-label">
                I consent to the <a href="/consent-form" target="_blank" className="terms-link">Consent Form</a> *
              </label>
              {errors.consentForm && <span className="error-message">{errors.consentForm}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Book Appointment'}
            </button>
          </div>
        </form>

        <FAQSection />
      </Container>
    </div>
  );
}
