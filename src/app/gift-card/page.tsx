'use client';

import { useState } from 'react';
import Container from '@/components/Container';

type GiftCardType = 'silver-100' | 'silver-150' | 'gold' | 'custom';

interface GiftCardOption {
  id: GiftCardType;
  name: string;
  value: number;
  price: number;
  description: string;
}

const GIFT_CARD_OPTIONS: GiftCardOption[] = [
  {
    id: 'silver-100',
    name: 'Silver',
    value: 100,
    price: 100,
    description: '$100 Gift Card'
  },
  {
    id: 'silver-150',
    name: 'Silver',
    value: 150,
    price: 150,
    description: '$150 Gift Card'
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
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientData, setRecipientData] = useState({
    name: '',
    phone: '',
    email: '',
    details: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const calculateGiftCardValue = (): number => {
    if (selectedCard === 'custom') {
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) return 0;
      // Christmas/Boxing Day discount: For every $100, get $150 gift card
      const hundreds = Math.floor(amount / 100);
      const remainder = amount % 100;
      return (hundreds * 150) + remainder;
    }
    
    const option = GIFT_CARD_OPTIONS.find(opt => opt.id === selectedCard);
    return option ? option.value : 0;
  };

  const calculatePrice = (): number => {
    if (selectedCard === 'custom') {
      const amount = parseFloat(customAmount);
      return isNaN(amount) || amount <= 0 ? 0 : amount;
    }
    
    const option = GIFT_CARD_OPTIONS.find(opt => opt.id === selectedCard);
    return option ? option.price : 0;
  };

  const handleCardSelect = (cardId: GiftCardType) => {
    setSelectedCard(cardId);
    if (cardId !== 'custom') {
      setCustomAmount('');
    }
    setErrors({});
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedCard('custom');
      setErrors(prev => ({ ...prev, customAmount: '' }));
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipientData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedCard) {
      newErrors.selectedCard = 'Please select a gift card option';
    }

    if (selectedCard === 'custom') {
      const amount = parseFloat(customAmount);
      if (!customAmount.trim()) {
        newErrors.customAmount = 'Please enter a custom amount';
      } else if (isNaN(amount) || amount <= 0) {
        newErrors.customAmount = 'Please enter a valid amount greater than 0';
      } else if (amount < 10) {
        newErrors.customAmount = 'Minimum amount is $10';
      }
    }

    if (!recipientData.name.trim()) {
      newErrors.name = 'Recipient name is required';
    }

    if (!recipientData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(recipientData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!recipientData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(recipientData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // TODO: Integrate with payment API
    const paymentData = {
      giftCardType: selectedCard,
      giftCardValue: calculateGiftCardValue(),
      price: calculatePrice(),
      recipient: recipientData
    };

    console.log('Payment data:', paymentData);
    // Placeholder for payment link
    alert('Payment integration will be added here. Gift card value: $' + calculateGiftCardValue() + ', Price: $' + calculatePrice());
  };

  const giftCardValue = calculateGiftCardValue();
  const price = calculatePrice();
  const discount = selectedCard === 'custom' && price >= 100 
    ? Math.floor(price / 100) * 50 
    : selectedCard === 'gold' 
    ? 70 
    : 0;

  return (
    <div className="gift-card-page">
      <div className="gift-card-hero">
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
        <form onSubmit={handleSubmit} className="gift-card-form">
          {/* Gift Card Selection */}
          <div className="form-section">
            <h2 className="section-title">Choose Your Gift Card</h2>
            <p className="section-description">
              Select a pre-designed gift card or enter a custom amount
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
                  {option.id === 'gold' && (
                    <div className="card-discount">Save $70</div>
                  )}
                </div>
              ))}
              
              <div
                className={`gift-card-option custom ${selectedCard === 'custom' ? 'selected' : ''}`}
                onClick={() => handleCardSelect('custom')}
              >
                <div className="card-badge">Custom</div>
                <div className="custom-input-wrapper">
                  <span className="currency">$</span>
                  <input
                    type="text"
                    className="custom-amount-input"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {customAmount && !errors.customAmount && (
                  <div className="card-preview">
                    Pay: ${parseFloat(customAmount) || 0} → Get: ${giftCardValue}
                  </div>
                )}
              </div>
            </div>

            {errors.selectedCard && (
              <span className="error-message">{errors.selectedCard}</span>
            )}
            {errors.customAmount && (
              <span className="error-message">{errors.customAmount}</span>
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
              <li>
                <span className="benefit-icon">✓</span>
                If used for a tattoo, get a free piercing service (jewelry not included)
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                Never expires
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                Perfect gift for any occasion
              </li>
            </ul>
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
                placeholder="Any additional information about the recipient..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit">
            <button
              type="submit"
              className="submit-button"
              disabled={!selectedCard || (selectedCard === 'custom' && !customAmount)}
            >
              <span>Proceed to Payment</span>
              {selectedCard && (
                <span className="button-price">${price}</span>
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}

