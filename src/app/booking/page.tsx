'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import Container from '@/components/Container';
import FAQSection from '@/components/FAQSection';
import ReCAPTCHA, { ReCAPTCHARef } from '@/components/ReCAPTCHA';
import { AvailabilityArtist, AvailabilityResponse, fetchAvailability, submitBooking } from '@/lib/bookingApi';

const ARTIST_SLUG_MAP: Record<string, string> = {
  'kian mokhtari': 'kian-mokhtari',
  'masi aghdam': 'masi-aghdam',
  'mina khani': 'mina-khanian',
  'mina khanian': 'mina-khanian',
  'sami amiri': 'sami-amiri',
};

type ServiceType = 'tattoo' | 'piercing' | '';

export default function BookingPage() {
  const initialFormState = {
    service: '' as ServiceType,
    fullName: '',
    email: '',
    phone: '',
    designUpload: null as File | null,
    additionalExplanation: '',
    time: '',
    date: '',
    birthDate: '',
    readTerms: false
  };

  const [formData, setFormData] = useState(initialFormState);

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableArtists, setAvailableArtists] = useState<AvailabilityArtist[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHARef>(null);
  const [successDetails, setSuccessDetails] = useState<{
    message: string;
    artistName?: string;
    artistEmail?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  } | null>(null);

  const services = useMemo(() => ([
    { label: 'Tattoo', value: 'tattoo' },
    { label: 'Piercing', value: 'piercing' }
  ]), []);

  // State to force re-calculation of time slots when current time changes
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute to refresh available time slots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const startMinutes = 12 * 60; // 12:00 PM
    const endMinutes = 23 * 60 + 30; // 11:30 PM

    // Get current time in Vancouver timezone (America/Vancouver)
    // Use currentTime state to trigger recalculation when time changes
    const now = currentTime;
    
    // Try to get Vancouver time, fallback to local time if timezone is not supported
    let vancouverHour: number;
    let vancouverMinute: number;
    
    try {
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Vancouver',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      // Get current time in Vancouver timezone
      const timeParts = timeFormatter.formatToParts(now);
      vancouverHour = parseInt(timeParts.find(p => p.type === 'hour')?.value || '0', 10);
      vancouverMinute = parseInt(timeParts.find(p => p.type === 'minute')?.value || '0', 10);
    } catch (error) {
      // Fallback: use local time if Vancouver timezone is not available
      console.warn('Vancouver timezone not available, using local time:', error);
      vancouverHour = now.getHours();
      vancouverMinute = now.getMinutes();
    }
    
    const selectedDate = formData.date;
    
    // Get today's date in local timezone for comparison (input date is in local timezone)
    // Use local time, not UTC
    const nowLocal = new Date();
    const todayLocal = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
    
    // Calculate minimum time (current time + 1 hour) if booking for today
    // Compare using local date (since input date is in local timezone)
    let minTimeMinutes: number | null = null;
    const isToday = selectedDate && selectedDate === todayLocal;
    
    if (isToday) {
      const currentMinutes = vancouverHour * 60 + vancouverMinute;
      // Add 1 hour (60 minutes) and round up to next 30-minute slot
      minTimeMinutes = currentMinutes + 60;
      // Round up to next 30-minute interval
      minTimeMinutes = Math.ceil(minTimeMinutes / 30) * 30;
      // Ensure minimum is at least 12:00 PM (720 minutes)
      if (minTimeMinutes < startMinutes) {
        minTimeMinutes = startMinutes;
      }
      // If minimum time is after end time, no slots available
      if (minTimeMinutes > endMinutes) {
        return [];
      }
    }

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
      // Skip times that are too early if booking for today
      if (minTimeMinutes !== null && minutes < minTimeMinutes) {
        continue;
      }
      
      const hours24 = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;
      const isPM = hours24 >= 12;
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
      const minuteLabel = minutesPart === 0 ? '00' : '30';
      slots.push(`${hours12}:${minuteLabel} ${isPM ? 'PM' : 'AM'}`);
    }

    return slots;
  }, [formData.date, currentTime]);

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
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'service' && value === 'piercing' ? { designUpload: null } : {}),
      }));
    }

    if (name === 'service' && value !== 'tattoo') {
      setAvailableArtists(prev => (prev.length ? [] : prev));
      setSelectedArtistId(prev => (prev !== null ? null : prev));
      setAvailabilityError(null);
      setIsCheckingAvailability(false);
      setErrors(prev => {
        if (!prev.selectedArtist) return prev;
        const nextErrors = { ...prev };
        delete nextErrors.selectedArtist;
        return nextErrors;
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, designUpload: file }));
    if (apiError) setApiError(null);
    if (successMessage) setSuccessMessage(null);
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
    if (formData.service === 'tattoo') {
      if (availabilityError) {
        newErrors.selectedArtist = availabilityError;
      } else if (!selectedArtistId) {
        newErrors.selectedArtist = 'Please select an artist';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (formData.service !== 'tattoo') {
      setAvailableArtists(prev => (prev.length ? [] : prev));
      setSelectedArtistId(prev => (prev !== null ? null : prev));
      setAvailabilityError(null);
      setIsCheckingAvailability(false);
      return;
    }

    if (!formData.date || !formData.time) {
      setAvailableArtists(prev => (prev.length ? [] : prev));
      setSelectedArtistId(prev => (prev !== null ? null : prev));
      setAvailabilityError(null);
      setIsCheckingAvailability(false);
      return;
    }

    let isActive = true;
    const loadAvailability = async () => {
      // For piercing, don't check availability - Masi will be assigned automatically
      if (formData.service === 'piercing') {
        setAvailableArtists([]);
        setSelectedArtistId(null);
        setIsCheckingAvailability(false);
        return;
      }

      // For tattoo, check availability
      setIsCheckingAvailability(true);
      setAvailabilityError(null);

      try {
        const time24h = convertTo24Hour(formData.time);
        const availability = await fetchAvailability(formData.date, time24h);
        if (!isActive) return;

        if (!availability.available_artists.length) {
          setAvailableArtists([]);
          setSelectedArtistId(null);
          setAvailabilityError('No artists are available for the selected date and time. Please choose another slot.');
          return;
        }

        setAvailableArtists(availability.available_artists);
        // Don't set suggested artist - no "Suggested" badge for tattoo bookings
        setSelectedArtistId(prev => {
          if (prev && availability.available_artists.some(artist => artist.id === prev)) {
            return prev;
          }
          // Auto-select first available artist, but don't mark as suggested
          return availability.available_artists[0]?.id ?? null;
        });
        setErrors(prev => {
          if (!prev.selectedArtist) return prev;
          const nextErrors = { ...prev };
          delete nextErrors.selectedArtist;
          return nextErrors;
        });
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Unable to check availability right now.';
        setAvailableArtists([]);
        setSelectedArtistId(null);
        setAvailabilityError(message);
      } finally {
        if (isActive) {
          setIsCheckingAvailability(false);
        }
      }
    };

    loadAvailability();

    return () => {
      isActive = false;
    };
  }, [formData.service, formData.date, formData.time]);

  const handleArtistSelect = (artistId: number) => {
    setSelectedArtistId(artistId);
    setErrors(prev => ({ ...prev, selectedArtist: '' }));
    if (apiError) setApiError(null);
  };

  const getArtistSlug = (name: string) => {
    const normalized = name.toLowerCase().trim();
    if (ARTIST_SLUG_MAP[normalized]) {
      return ARTIST_SLUG_MAP[normalized];
    }

    return normalized
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const formatDisplayDate = (date: string | undefined) => {
    if (!date) return null;
    // Parse date string (YYYY-MM-DD) and format it using Vancouver timezone
    // Use noon time (12:00) to avoid timezone shift issues when parsing dates
    // This ensures the date is interpreted correctly in Vancouver timezone
    const parts = date.split('-');
    if (parts.length !== 3) {
      // Fallback to original parsing if format is unexpected
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return date;
      try {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Vancouver',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(parsed);
      } catch {
        return parsed.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    }
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);
    // Create date at noon in local time to avoid timezone shift issues
    // Then format it using Vancouver timezone
    const parsed = new Date(year, month, day, 12, 0, 0);
    if (Number.isNaN(parsed.getTime())) return date;
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Vancouver',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(parsed);
    } catch {
      // Fallback if Vancouver timezone is not available
      return parsed.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleNewBooking = () => {
    setSuccessDetails(null);
    setSuccessMessage(null);
    setApiError(null);
    setErrors({});
    setFormData({ ...initialFormState });
    setAvailableArtists([]);
    setSelectedArtistId(null);
    setAvailabilityError(null);
    setRecaptchaError(null);
    setIsCheckingAvailability(false);
  };

  const handleRecaptchaVerify = () => {
    setRecaptchaError(null);
  };

  const handleRecaptchaError = () => {
    setRecaptchaError('reCAPTCHA verification failed. Please try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Execute reCAPTCHA v3 and get token
    setRecaptchaError(null);
    let token: string | null = null;

    if (recaptchaRef.current) {
      try {
        token = await recaptchaRef.current.execute();
      } catch (error) {
        console.error('reCAPTCHA execution error:', error);
        setRecaptchaError('reCAPTCHA verification failed. Please try again.');
        return;
      }
    }

    // Validate reCAPTCHA token
    if (!token) {
      setRecaptchaError(
        'Security check did not complete. Try refreshing the page or briefly disabling ad blockers for this site. If it keeps happening, the live domain may need to be added to the reCAPTCHA key in Google Admin.',
      );
      return;
    }

    setIsSubmitting(true);
    setApiError(null);
    setSuccessMessage(null);
    
    try {
      const time24h = convertTo24Hour(formData.time);
      let preferredArtist: AvailabilityArtist | undefined;
      let availability: AvailabilityResponse | null = null;

      // For piercing, skip availability check - Masi will be assigned automatically
      if (formData.service === 'piercing') {
        // No need to check availability for piercing - backend will assign to Masi
      } else {
        // For tattoo, check availability and validate artist selection
        availability = await fetchAvailability(formData.date, time24h);

        if (!availability.available_artists.length) {
          setAvailableArtists([]);
          setSelectedArtistId(null);
          setApiError('No artists are available for the selected date and time. Please choose another slot.');
          setIsSubmitting(false);
          return;
        }

        setAvailableArtists(availability.available_artists);

        if (!selectedArtistId) {
          setErrors(prev => ({ ...prev, selectedArtist: 'Please select an artist' }));
          setIsSubmitting(false);
          return;
        }

        preferredArtist = availability.available_artists.find((artist: AvailabilityArtist) => artist.id === selectedArtistId);

        if (!preferredArtist) {
          setApiError('The selected artist is no longer available. Please choose another artist.');
          setSelectedArtistId(availability.available_artists[0]?.id ?? null);
          setIsSubmitting(false);
          return;
        }
      }

      const appointmentDate = formData.date;
      const appointmentTime = formData.time;

      const combinedNotes = [
        formData.additionalExplanation.trim() || null,
        preferredArtist ? `Preferred artist: ${preferredArtist.name}${preferredArtist.email ? ` (${preferredArtist.email})` : ''}` : null,
      ]
        .filter(Boolean)
        .join('\n\n');

      const bookingResponse = await submitBooking({
        service: formData.service.toLowerCase(),
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        design: formData.designUpload ? formData.designUpload.name : undefined,
        designFile: formData.designUpload ?? undefined,
        notes: combinedNotes || undefined,
        date: formData.date,
        time: time24h,
        birthdate: formData.birthDate,
        artist_id: preferredArtist?.id,
        preferred_artist_name: preferredArtist?.name,
        preferred_artist_email: preferredArtist?.email,
        recaptcha_token: token || undefined,
      });

      const assignedName = bookingResponse.assigned_artist?.name ?? preferredArtist?.name;
      const assignedEmail = bookingResponse.assigned_artist?.email ?? preferredArtist?.email;
      const successText =
        assignedName
          ? `Booking request submitted successfully! Assigned artist: ${assignedName}.`
          : 'Booking request submitted successfully! We will contact you soon.';

      setSuccessMessage(successText);
      setSuccessDetails({
        message: successText,
        artistName: assignedName ?? undefined,
        artistEmail: assignedEmail ?? undefined,
        appointmentDate,
        appointmentTime,
      });

      setErrors({});
      setFormData({ ...initialFormState });
      setAvailableArtists([]);
      setSelectedArtistId(null);
      setAvailabilityError(null);
      setRecaptchaError(null);
      setIsCheckingAvailability(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTo24Hour = (time: string) => {
    if (!time) return '';
    const [timePart, modifier] = time.split(' ');
    const [rawHours, minutes] = timePart.split(':');
    let hours = parseInt(rawHours, 10);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
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
        {successDetails ? (
          <div className="booking-success">
            {successMessage && (
              <div className="form-alert success-alert">
                {successMessage}
              </div>
            )}
            <div className="success-details">
              {successDetails.appointmentDate && (
                <p>
                  <strong>Appointment:</strong>{' '}
                  {formatDisplayDate(successDetails.appointmentDate)}
                  {successDetails.appointmentTime ? ` at ${successDetails.appointmentTime}` : ''}
                </p>
              )}
              {successDetails.artistName && (
                <p>
                  <strong>Your artist:</strong>{' '}
                  {successDetails.artistName}
                  {successDetails.artistEmail && (
                    <>
                      {' · '}
                      <a href={`mailto:${successDetails.artistEmail}`} className="success-contact-link">
                        {successDetails.artistEmail}
                      </a>
                    </>
                  )}
                </p>
              )}
              <p>
                If you need to cancel or make changes, please contact your artist at least one hour before your appointment.
                Their contact information has been emailed to you.
              </p>
            </div>
            <div className="success-actions">
              <button type="button" className="new-booking-button" onClick={handleNewBooking}>
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="booking-form">
            {apiError && (
              <div className="form-alert error-alert">
                {apiError}
              </div>
            )}
            {successMessage && (
              <div className="form-alert success-alert">
                {successMessage}
              </div>
            )}
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
                <option key={service.value} value={service.value}>{service.label}</option>
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
              inputMode="numeric"
              pattern="[0-9+\-\s\(\)]+"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers, +, -, spaces, and parentheses
                if (/^[0-9+\-\s\(\)]*$/.test(value)) {
                  handleInputChange(e);
                }
              }}
              onKeyDown={(e) => {
                // Prevent typing letters and other characters
                const key = e.key;
                // Allow: numbers, +, -, space, (, ), backspace, delete, tab, arrow keys
                if (!/^[0-9+\-\s\(\)]$/.test(key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
                  e.preventDefault();
                }
              }}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Design upload — tattoo only (not used for piercing) */}
          {formData.service === 'tattoo' && (
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
          )}

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
                min={(() => {
                  const now = new Date();
                  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                })()}
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

          {/* Artist Selection */}
          {formData.service === 'tattoo' && (
            <div className="form-group artist-availability">
              <label className="form-label">Choose Your Artist *</label>
              {isCheckingAvailability && (
                <p className="availability-status">Checking available artists...</p>
              )}
              {!isCheckingAvailability && availabilityError && (
                <div className="form-alert error-alert">
                  {availabilityError}
                </div>
              )}
              {!isCheckingAvailability && !availabilityError && !availableArtists.length && (
                <p className="availability-status">Select a date and time to view available artists.</p>
              )}
              {!isCheckingAvailability && !availabilityError && availableArtists.length > 0 && formData.service === 'tattoo' && (
                <div className="artist-options">
                  {availableArtists.map(artist => {
                    const slug = getArtistSlug(artist.name);
                    const isSelected = selectedArtistId === artist.id;

                    return (
                      <label
                        key={artist.id}
                        className={`artist-option ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="selectedArtist"
                          value={artist.id}
                          checked={isSelected}
                          onChange={() => handleArtistSelect(artist.id)}
                        />
                        <div className="artist-option-details">
                          <span className="artist-option-name">
                            {artist.name}
                          </span>
                          {artist.email && (
                            <span className="artist-option-meta">{artist.email}</span>
                          )}
                        </div>
                        <Link
                          href={slug ? `/single-artist/${slug}` : '/single-artist'}
                          className="artist-option-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Profile
                        </Link>
                      </label>
                    );
                  })}
                </div>
              )}
              {formData.service !== 'tattoo' && formData.service !== '' && formData.date && formData.time && (
                <div className="form-info">
                  <p>Your piercing appointment will be assigned to Masi Aghdam.</p>
                </div>
              )}
              {errors.selectedArtist && <span className="error-message">{errors.selectedArtist}</span>}
            </div>
          )}

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

          {/* reCAPTCHA v3 - invisible, executes on submit */}
          <ReCAPTCHA
            ref={recaptchaRef}
            onVerify={handleRecaptchaVerify}
            onError={handleRecaptchaError}
            action="booking_submit"
          />
          {recaptchaError && (
          <div className="form-group">
              <span className="error-message">{recaptchaError}</span>
            </div>
          )}

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
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Submitting...' : 'Book Appointment'}</span>
            </button>
          </div>
        </form>
        )}

        <FAQSection />
      </Container>
    </div>
  );
}
