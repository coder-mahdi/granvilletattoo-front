'use client';

import { useState, useRef } from 'react';
import Container from '@/components/Container';
import ReCAPTCHA, { ReCAPTCHARef } from '@/components/ReCAPTCHA';
import { submitGiftCard } from '@/lib/giftCardApi';

type GiftCardType = 'silver' | 'gold';

interface GiftCardOption {
  id: GiftCardType;
  name: string;
  value: number;
  price: number;
  description: string;
}

const GIFT_CARD_OPTIONS: GiftCardOption[] = [
  {
    id: 'silver',
    name: 'Silver',
    value: 150,
    price: 100,
    description: '$150 Gift Card (Pay $100)'
  },
  {
    id: 'gold',
    name: 'Gold',
    value: 250,
    price: 180,
    description: '$250 Gift Card (Special Price: $180)'
  }
];

export default function GiftCardPage() {
  const [selectedCard, setSelectedCard] = useState<GiftCardType | null>(null);
  const [senderData, setSenderData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [recipientData, setRecipientData] = useState({
    name: '',
    phone: '',
    email: '',
    details: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHARef>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const calculateGiftCardValue = (): number => {
    const option = GIFT_CARD_OPTIONS.find(opt => opt.id === selectedCard);
    return option ? option.value : 0;
  };

  const calculatePrice = (): number => {
    const option = GIFT_CARD_OPTIONS.find(opt => opt.id === selectedCard);
    return option ? option.price : 0;
  };

  const handleCardSelect = (cardId: GiftCardType) => {
    setSelectedCard(cardId);
    setErrors({});
  };

  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSenderData(prev => ({ ...prev, [name]: value }));
    if (errors[`sender_${name}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`sender_${name}`];
        return newErrors;
      });
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipientData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRecaptchaVerify = () => {
    setRecaptchaError(null);
  };

  const handleRecaptchaError = () => {
    setRecaptchaError('reCAPTCHA verification failed. Please try again.');
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedCard) {
      newErrors.selectedCard = 'Please select a gift card option';
    }

    // Validate sender data
    if (!senderData.name.trim()) {
      newErrors.sender_name = 'Sender name is required';
    }

    if (!senderData.email.trim()) {
      newErrors.sender_email = 'Sender email is required';
    } else if (!validateEmail(senderData.email)) {
      newErrors.sender_email = 'Please enter a valid email';
    }

    if (!senderData.phone.trim()) {
      newErrors.sender_phone = 'Sender phone number is required';
    } else if (!validatePhone(senderData.phone)) {
      newErrors.sender_phone = 'Please enter a valid phone number';
    }

    // Validate recipient data
    if (!recipientData.name.trim()) {
      newErrors.name = 'Recipient name is required';
    }

    if (!recipientData.email.trim()) {
      newErrors.email = 'Recipient email is required';
    } else if (!validateEmail(recipientData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!recipientData.phone.trim()) {
      newErrors.phone = 'Recipient phone number is required';
    } else if (!validatePhone(recipientData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      setRecaptchaError('Please complete the reCAPTCHA verification.');
      return;
    }

    // Submit gift card data to backend
    try {
      console.log('Submitting gift card with payload:', {
        giftCardType: selectedCard!,
        giftCardValue: calculateGiftCardValue(),
        price: calculatePrice(),
        sender: senderData,
        recipient: recipientData,
        recaptcha_token: token ? 'present' : 'missing'
      });
      
      const response = await submitGiftCard({
        giftCardType: selectedCard!,
        giftCardValue: calculateGiftCardValue(),
        price: calculatePrice(),
        sender: senderData,
        recipient: recipientData,
        recaptcha_token: token
      });

      console.log('Gift card created:', response);
      
      // Show success message first
      setShowSuccessMessage(true);
      
      // After 2 seconds, show payment button
      setTimeout(() => {
        setShowPaymentButton(true);
      }, 2000);
    } catch (error) {
      console.error('Error creating gift card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create gift card. Please try again.';
      setErrors({ apiError: errorMessage });
      setShowSuccessMessage(false);
      setShowPaymentButton(false);
    }
  };

  const giftCardValue = calculateGiftCardValue();
  const price = calculatePrice();
  // Discount = Gift Card Value - Price Paid
  const discount = selectedCard && price > 0 && giftCardValue > 0
    ? Math.round((giftCardValue - price) * 100) / 100 // Round to 2 decimal places
    : 0;

  return (
    <div className="gift-card-page">
      <div className={`gift-card-hero ${showSuccessMessage ? 'hero-active' : ''}`}>
        <Container>
          <div className="gift-card-header">
            <h1 className="gift-card-title">Gift Card</h1>
            <p className="gift-card-subtitle">
              Give the gift of tattoos and piercings. Perfect for any occasion!
            </p>
            <div className="promo-banner">
              <div className="promo-icon">🎄</div>
              <div className="promo-content">
                <h3 className="promo-title">Special Christmas & Boxing Day Offer!</h3>
                <p className="promo-text">For every $100 you pay, get $150 gift card value!</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Success Message - Outside form to always show */}
        {showSuccessMessage && (
          <div className="success-message-container">
            <div className="success-message-box">
              <div className="success-message-content">
                <span>Your gift card request has been successfully registered!</span>
                <span>After payment through the link below, your gift card will be sent to <strong>{recipientData.name}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button - Outside form to always show */}
        {showPaymentButton && (
          <div className="payment-button-wrapper">
            <div className="payment-button-container" style={{ position: 'relative', zIndex: 10000 }}>
              {selectedCard === 'silver' && (
                <div 
                  className="square-payment-button"
                  style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '259px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '-2px 10px 5px rgba(0, 0, 0, 0)',
                    borderRadius: '10px',
                    fontFamily: 'SQ Market, SQ Market, Helvetica, Arial, sans-serif',
                    margin: '0 auto'
                  }}
                >
                  <div style={{ padding: '20px' }}>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://square.link/u/QE6WYwJl?src=embed" 
                      style={{
                        display: 'inline-block',
                        fontSize: '18px',
                        lineHeight: '48px',
                        height: '48px',
                        color: '#ffffff',
                        minWidth: '212px',
                        backgroundColor: '#006aff',
                        textAlign: 'center',
                        boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      Buy now
                    </a>
                  </div>
                </div>
              )}
              {selectedCard === 'gold' && (
                <div 
                  className="square-payment-button"
                  style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '259px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '-2px 10px 5px rgba(0, 0, 0, 0)',
                    borderRadius: '10px',
                    fontFamily: 'SQ Market, SQ Market, Helvetica, Arial, sans-serif',
                    margin: '0 auto'
                  }}
                >
                  <div style={{ padding: '20px' }}>
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer"
                      href="https://square.link/u/Oqr4LApj?src=embed" 
                      style={{
                        display: 'inline-block',
                        fontSize: '18px',
                        lineHeight: '48px',
                        height: '48px',
                        color: '#ffffff',
                        minWidth: '212px',
                        backgroundColor: '#006aff',
                        textAlign: 'center',
                        boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      Buy now
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`gift-card-form ${showSuccessMessage ? 'form-hidden' : ''}`}>
          {/* Gift Card Selection */}
          <div className="form-section">
            <h2 className="section-title">Choose Your Gift Card</h2>
            <p className="section-description">
              Select a gift card option
            </p>

            <div className="gift-card-options">
              {GIFT_CARD_OPTIONS.map(option => (
                <div
                  key={option.id}
                  className={`gift-card-option ${option.id === selectedCard ? 'selected' : ''} ${option.id}`}
                  onClick={() => handleCardSelect(option.id)}
                >
                  <div className="card-badge">{option.name}</div>
                  <div className="card-value">${option.value}</div>
                  <div className="card-price">${option.price}</div>
                  {option.id === 'silver' && (
                    <div className="card-discount">Save $50</div>
                  )}
                  {option.id === 'gold' && (
                    <div className="card-discount">Save $70</div>
                  )}
                </div>
              ))}
            </div>

            {errors.selectedCard && (
              <span className="error-message">{errors.selectedCard}</span>
            )}

            {selectedCard && (
              <div className="gift-card-summary">
                <div className="summary-row">
                  <span>Gift Card Value:</span>
                  <span className="summary-value">${giftCardValue}</span>
                </div>
                <div className="summary-row">
                  <span>Price:</span>
                  <span className="summary-price">${price}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>You Save:</span>
                    <span className="summary-discount">${discount}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Benefits Section */}
          <div className="benefits-section">
            <h3 className="benefits-title">Gift Card Benefits</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">✓</span>
                Valid for both tattoos and piercings
              </li>
              {selectedCard === 'gold' && (
                <li>
                  <span className="benefit-icon">✓</span>
                  If used for a tattoo, get a free piercing service (jewelry not included)
                </li>
              )}
              <li>
                <span className="benefit-icon">✓</span>
                Valid from the date of purchase
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                Perfect gift for any occasion
              </li>
            </ul>
          </div>

          {/* Sender Information */}
          <div className="form-section">
            <h2 className="section-title">Sender Information</h2>
            <p className="section-description">
              Enter your details (payment and sender information must be the same)
            </p>
            <div className="info-note">
              <span className="note-icon">ℹ️</span>
              <span className="note-text">Note: Payment information must match sender information</span>
            </div>

            <div className="form-group">
              <label htmlFor="sender_name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="sender_name"
                name="name"
                value={senderData.name}
                onChange={handleSenderChange}
                className={`form-input ${errors.sender_name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.sender_name && <span className="error-message">{errors.sender_name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sender_email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="sender_email"
                  name="email"
                  value={senderData.email}
                  onChange={handleSenderChange}
                  className={`form-input ${errors.sender_email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.sender_email && <span className="error-message">{errors.sender_email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sender_phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="sender_phone"
                  name="phone"
                  value={senderData.phone}
                  onChange={handleSenderChange}
                  className={`form-input ${errors.sender_phone ? 'error' : ''}`}
                  placeholder="Enter your phone"
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (!/^[0-9+\-\s\(\)]$/.test(key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.sender_phone && <span className="error-message">{errors.sender_phone}</span>}
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="form-section">
            <h2 className="section-title">Recipient Information</h2>
            <p className="section-description">
              Enter the details of the person who will receive this gift card
            </p>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={recipientData.name}
                onChange={handleRecipientChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter recipient's full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={recipientData.email}
                  onChange={handleRecipientChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter recipient's email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={recipientData.phone}
                  onChange={handleRecipientChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter recipient's phone"
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (!/^[0-9+\-\s\(\)]$/.test(key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="details" className="form-label">
                Additional Details (Optional)
              </label>
              <textarea
                id="details"
                name="details"
                value={recipientData.details}
                onChange={handleRecipientChange}
                className="form-textarea"
                rows={4}
                placeholder="If you want to send a special message to the recipient, write it here"
              />
            </div>
          </div>

          {/* reCAPTCHA v3 - invisible, executes on submit */}
          <ReCAPTCHA
            ref={recaptchaRef}
            onVerify={handleRecaptchaVerify}
            onError={handleRecaptchaError}
            action="gift_card_submit"
          />
          {recaptchaError && (
            <div className="form-group">
              <span className="error-message">{recaptchaError}</span>
            </div>
          )}

          {errors.apiError && (
            <div className="form-alert error-alert">
              <span>{errors.apiError}</span>
            </div>
          )}

          {/* Submit Button */}
          {!showSuccessMessage && (
            <div className="form-submit">
              <button
                type="submit"
                className="submit-button"
                disabled={!selectedCard}
              >
                <span>Proceed to Payment</span>
                {selectedCard && (
                  <span className="button-price">${price}</span>
                )}
              </button>
            </div>
          )}
        </form>
      </Container>
    </div>
  );
}

