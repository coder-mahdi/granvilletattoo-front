'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import Container from '@/components/Container';
import { ConsentAnswers, submitConsentForm } from '@/lib/consentApi';

type ConsentFormValues = {
  clientName: string;
  artistName: string;
  age: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  additionalNotes: string;
  participantSignature: string;
  procedureDate: string;
  employeeSignature: string;
  idVerification: string;
  artistConfirmation: string;
};

type YesNoAnswer = 'yes' | 'no' | '';

const yesNoQuestions = [
  { key: 'ateRecently', label: 'Have you eaten in the last 3 hours?' },
  { key: 'alcoholRecently', label: 'Have you had any alcoholic beverages in the last 8 hours?' },
  { key: 'narcotics', label: 'Have you consumed any narcotics in the last 24 hours?' },
  { key: 'pregnant', label: 'Are you pregnant or nursing?' },
  { key: 'fainting', label: 'Are you prone to fainting or heavy bleeding?' },
  { key: 'allergies', label: 'Do you have any allergies (e.g., shellfish, alcohol, latex)?' },
  { key: 'medications', label: 'Are you taking any medications we should be aware of (e.g., psoriasis, keloid scarring)?' },
  { key: 'conditions', label: 'Do you have any medical conditions we should be aware of (e.g., epilepsy, hemophilia, diabetes)?' },
  { key: 'heartConditions', label: 'Do you have any heart conditions (e.g., mitral valve prolapse)?' },
  { key: 'transplants', label: 'Are you a recipient of bone marrow or organ transplants?' },
  { key: 'mrsa', label: 'Have you contracted MRSA or VRSA infection within the last year?' },
  { key: 'communicable', label: 'Do you have communicable diseases (e.g., hepatitis or HIV)?' },
  { key: 'ofAge', label: 'Are you 16 or over?' },
] as const;

type YesNoState = Record<(typeof yesNoQuestions)[number]['key'], YesNoAnswer>;

const initialFormValues: ConsentFormValues = {
  clientName: '',
  artistName: '',
  age: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  additionalNotes: '',
  participantSignature: '',
  procedureDate: '',
  employeeSignature: '',
  idVerification: '',
  artistConfirmation: '',
};

const initialYesNoState: YesNoState = yesNoQuestions.reduce((acc, question) => {
  acc[question.key] = '';
  return acc;
}, {} as YesNoState);

export default function ConsentFormForm() {
  const [formValues, setFormValues] = useState<ConsentFormValues>(initialFormValues);
  const [answers, setAnswers] = useState<YesNoState>(initialYesNoState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const unansweredQuestions = useMemo(
    () => yesNoQuestions.filter(question => answers[question.key] === '').map(question => question.label),
    [answers]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (submitted) setSubmitted(false);
    setSubmitError(null);
  };

  const handleAnswerChange = (questionKey: keyof YesNoState, value: YesNoAnswer) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
    if (submitted) setSubmitted(false);
    setSubmitError(null);
  };

  const resetForm = (options?: { keepSuccess?: boolean }) => {
    setFormValues(initialFormValues);
    setAnswers(initialYesNoState);
    setSubmitted(false);
    setSubmitError(null);
    if (!options?.keepSuccess) {
      setSubmitSuccess(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSubmitError(null);

    if (unansweredQuestions.length > 0) {
      setSubmitError('Please answer all health and consent questions before submitting.');
      return;
    }

    if (!formValues.email) {
      setSubmitError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);

    const payloadAnswers: ConsentAnswers = yesNoQuestions.reduce((acc, question) => {
      const value = answers[question.key];
      if (value === 'yes' || value === 'no') {
        acc[question.key] = value;
      }
      return acc;
    }, {} as ConsentAnswers);

    try {
      const response = await submitConsentForm({
        client_name: formValues.clientName,
        artist_name: formValues.artistName,
        age: Number(formValues.age),
        date_of_birth: formValues.dateOfBirth,
        phone: formValues.phone,
        email: formValues.email,
        address: formValues.address,
        city: formValues.city,
        additional_notes: formValues.additionalNotes || undefined,
        participant_signature: formValues.participantSignature,
        procedure_date: formValues.procedureDate,
        employee_signature: formValues.employeeSignature,
        id_verification: formValues.idVerification,
        artist_confirmation: formValues.artistConfirmation || undefined,
        answers: payloadAnswers,
      });

      setSubmitSuccess('Thank you! Your consent form has been recorded and will be reviewed by our team.');
      setSubmitError(null);
      setSubmitted(false);
      resetForm({ keepSuccess: true });
      console.info('Consent form submitted', response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit consent form. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consent-page">
      <div className="consent-hero">
        <Container>
          <h1 className="consent-title">Granville St. Tattoo Waiver, Release, and Consent to Tattoo</h1>
          <p className="consent-subtitle">
            Please review the agreement carefully and complete the form in full before your appointment.
            You will receive a copy via email once our team confirms the details.
          </p>
        </Container>
      </div>

      <div className="consent-body">
        <Container>
          <div className="consent-content">
            <section className="consent-panel">
              <h2>Agreement Summary</h2>
              <p>
                Granville St. Tattoo — Granville Street, Vancouver BC, V6Z 1M1, Canada — License No.11191386TQ
              </p>
              <p>
                By completing this waiver you acknowledge that you have been fully informed of the procedure,
                understand the risks involved, and consent to receiving a tattoo from a Granville St. Tattoo artist.
              </p>
              <p>
                You accept responsibility for following aftercare instructions and agree that any touch-ups required due to
                negligence will be at your own expense. You also release Granville St. Tattoo and its staff from liability
                related to this tattoo, including potential variations in colour, design, or long-term appearance.
              </p>
              <p>
                You declare that you are of legal age, competent to sign this agreement, and assume all risk of damage or
                injury arising from receiving the tattoo. You consent to photographs for studio documentation or promotional use
                and agree to reimburse the artist and studio for legal fees stemming from any action you might bring.
              </p>
            </section>

            <form className="consent-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Client &amp; Artist Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="clientName">Client Name *</label>
                    <input
                      id="clientName"
                      name="clientName"
                      type="text"
                      required
                      value={formValues.clientName}
                      onChange={handleInputChange}
                      placeholder="Full legal name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="artistName">Artist Name *</label>
                    <input
                      id="artistName"
                      name="artistName"
                      type="text"
                      required
                      value={formValues.artistName}
                      onChange={handleInputChange}
                      placeholder="Artist performing the tattoo"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="16"
                      required
                      value={formValues.age}
                      onChange={handleInputChange}
                      placeholder="Must be 16 or older"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formValues.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Telephone *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formValues.phone}
                      onChange={handleInputChange}
                      placeholder="Primary contact number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formValues.email}
                      onChange={handleInputChange}
                      placeholder="Email for confirmation"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formValues.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formValues.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="additionalNotes">Notes for the artist</label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formValues.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Provide any details the artist should know."
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Health &amp; Consent Questions — Yes or No</h3>
                <div className="question-list">
                  {yesNoQuestions.map(question => (
                    <div key={question.key} className="question-item">
                      <span className="question-label">{question.label}</span>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name={question.key}
                            value="yes"
                            checked={answers[question.key] === 'yes'}
                            onChange={() => handleAnswerChange(question.key, 'yes')}
                            required
                          />
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={question.key}
                            value="no"
                            checked={answers[question.key] === 'no'}
                            onChange={() => handleAnswerChange(question.key, 'no')}
                          />
                          No
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Declaration</h3>
                <p>
                  I have read this agreement, have received a full explanation, and fully understand it. I have answered all
                  questions honestly, and all information given is accurate.
                </p>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="participantSignature">Participant’s Signature *</label>
                    <input
                      id="participantSignature"
                      name="participantSignature"
                      type="text"
                      required
                      value={formValues.participantSignature}
                      onChange={handleInputChange}
                      placeholder="Full legal signature"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="procedureDate">Date of Procedure *</label>
                    <input
                      id="procedureDate"
                      name="procedureDate"
                      type="date"
                      required
                      value={formValues.procedureDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="signature-grid">
                  <div className="form-group">
                    <label htmlFor="employeeSignature">Employee Signature *</label>
                    <input
                      id="employeeSignature"
                      name="employeeSignature"
                      type="text"
                      required
                      value={formValues.employeeSignature}
                      onChange={handleInputChange}
                      placeholder="For studio use"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="idVerification">ID Check *</label>
                    <input
                      id="idVerification"
                      name="idVerification"
                      type="text"
                      required
                      value={formValues.idVerification}
                      onChange={handleInputChange}
                      placeholder="Type of ID verified"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="artistConfirmation">Artist Confirmation</label>
                    <textarea
                      id="artistConfirmation"
                      name="artistConfirmation"
                      value={formValues.artistConfirmation}
                      onChange={handleInputChange}
                      placeholder="Internal notes for studio use"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-consent" disabled={isSubmitting}>
                  Submit Consent
                </button>
                <button
                  type="button"
                  className="submit-consent"
                  onClick={() => resetForm()}
                  disabled={isSubmitting}
                >
                  Reset Form
                </button>
                <p className="note">
                  A representative will review your responses and confirm the details with you. By submitting this form you
                  acknowledge the statements above and consent to receiving a tattoo at Granville St. Tattoo.
                </p>
                {submitError && <p className="note error">{submitError}</p>}
                {submitted && unansweredQuestions.length > 0 && (
                  <p className="note">
                    Please ensure every yes/no question is answered before final submission.
                  </p>
                )}
                {submitSuccess && <p className="note success">{submitSuccess}</p>}
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}

