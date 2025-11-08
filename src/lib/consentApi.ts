import { API_BASE } from './bookingApi';

export type ConsentAnswers = Record<string, 'yes' | 'no'>;

export type ConsentFormPayload = {
  client_name: string;
  artist_name: string;
  age: number;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  additional_notes?: string;
  participant_signature: string;
  procedure_date: string;
  answers: ConsentAnswers;
  recaptcha_token?: string;
};

export type ConsentFormResponse = {
  ok: boolean;
  consent_id: number;
  submitted_at: string;
};

function buildUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function safeParseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function submitConsentForm(payload: ConsentFormPayload): Promise<ConsentFormResponse> {
  const response = await fetch(buildUrl('/consent'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await safeParseJson(response);
    throw new Error(errorBody?.message || 'Unable to submit consent form');
  }

  return response.json();
}

