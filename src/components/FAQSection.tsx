import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQSection() {
  const faqs: FAQItem[] = [
    {
      question: 'What should I bring to my appointment?',
      answer: 'Please bring a valid ID, any design references, and arrive 15 minutes early so we can review your ideas together.'
    },
    {
      question: 'Can I reschedule my appointment?',
      answer: 'You can reschedule by calling us up to 1 hour before your appointment. After that window we may not be able to accommodate changes.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Cancellations must be made at least 1 hour in advance. Late cancellations or no-shows may forfeit future bookings.'
    },
    {
      question: 'What forms of payment do you accept?',
      answer: 'We accept cash, credit cards, and debit cards. Personal checks are not accepted.'
    },
    {
      question: 'How long does a typical tattoo session take?',
      answer: 'Session length depends entirely on the size and detail of your design. Send us your idea and we’ll help plan the timing with your artist.'
    },
    {
      question: 'Is there an age requirement?',
      answer: 'You must be at least 16 years old. We do not perform tattoos on anyone under 16, with or without parental consent.'
    },
    {
      question: 'How should I care for my tattoo afterwards?',
      answer: 'Keep the bandage on for a few hours, then wash gently with fragrance-free soap. Pat dry, apply a thin layer of unscented moisturizer, and avoid sun, pools, and heavy workouts for about two weeks.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className={`faq-item${isOpen ? ' open' : ''}`}>
              <button type="button" className="faq-toggle" onClick={() => handleToggle(index)}>
                <span className="faq-question">{faq.question}</span>
                <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div className="faq-answer" aria-hidden={!isOpen}>
                <p>{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
