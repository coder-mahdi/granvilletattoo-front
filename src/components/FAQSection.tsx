export default function FAQSection() {
  const faqs = [
    {
      question: "What should I bring to my appointment?",
      answer: "Please bring a valid ID, any design references, and arrive 10 minutes early."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule up to 24 hours before your appointment by calling us."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations must be made at least 24 hours in advance to avoid any fees."
    },
    {
      question: "Do you require a deposit?",
      answer: "Yes, we require a 50% deposit to secure your appointment, which will be applied to your final cost."
    },
    {
      question: "What forms of payment do you accept?",
      answer: "We accept cash, credit cards, and debit cards. We do not accept personal checks."
    },
    {
      question: "How long does a typical tattoo session take?",
      answer: "Session length varies depending on size and complexity, but most tattoos take 2-6 hours."
    },
    {
      question: "Is there an age requirement?",
      answer: "You must be at least 16 years old with parental consent, or 18+ without parental consent."
    },
    {
      question: "Can I eat before my appointment?",
      answer: "Yes, please eat a good meal before your appointment to help with the healing process."
    }
  ];

  return (
    <div className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
