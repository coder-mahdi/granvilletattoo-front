import { buildGranvilleFetchUrl } from './granvilleFetchUrl';

export type AvailabilityArtist = {
  id: number;
  name: string;
  email: string;
};

export type AvailabilityResponse = {
  ok: boolean;
  date: string;
  time: string;
  available_artists: AvailabilityArtist[];
  suggested_artist: AvailabilityArtist | null;
};

export type BookingRequestPayload = {
  service: string;
  name: string;
  email: string;
  phone: string;
  design?: string;
  designFile?: File | null;
  notes?: string;
  date: string;
  time: string;
  birthdate?: string;
  artist_id?: number;
  preferred_artist_name?: string;
  preferred_artist_email?: string;
  recaptcha_token?: string;
};

export type BookingResponse = {
  ok: boolean;
  booking_id: number;
  status: string;
  assigned_artist: AvailabilityArtist;
};

function buildUrl(path: string, params?: Record<string, string>): string {
  return buildGranvilleFetchUrl(path, params);
}

async function fetchWithNetworkError(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new Error(
        'Unable to reach the booking service. Please check your connection and try again.',
      );
    }
    throw e;
  }
}

export async function fetchAvailability(date: string, time: string): Promise<AvailabilityResponse> {
  const response = await fetchWithNetworkError(buildUrl('/availability', { date, time }), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Unable to check availability'));
  }

  return response.json();
}

export async function submitBooking(payload: BookingRequestPayload): Promise<BookingResponse> {
  const formData = new FormData();

  formData.append('service', payload.service);
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  formData.append('phone', payload.phone);
  formData.append('date', payload.date);
  formData.append('time', payload.time);

  if (payload.design) {
    formData.append('design', payload.design);
  }

  if (payload.designFile) {
    formData.append('design_file', payload.designFile);
  }

  if (payload.notes) {
    formData.append('notes', payload.notes);
  }

  if (payload.birthdate) {
    formData.append('birthdate', payload.birthdate);
  }

  if (payload.artist_id !== undefined && payload.artist_id !== null) {
    formData.append('artist_id', String(payload.artist_id));
  }

  if (payload.preferred_artist_name) {
    formData.append('preferred_artist_name', payload.preferred_artist_name);
  }

  if (payload.preferred_artist_email) {
    formData.append('preferred_artist_email', payload.preferred_artist_email);
  }

  if (payload.recaptcha_token) {
    formData.append('recaptcha_token', payload.recaptcha_token);
  }

  const response = await fetchWithNetworkError(buildUrl('/booking'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Unable to create booking'));
  }

  return response.json();
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { message?: string; code?: string };
    if (body?.message) return String(body.message);
    if (body?.code) return String(body.code);
  } catch {
    /* not JSON */
  }
  if (response.status >= 500 && text.includes('<!DOCTYPE')) {
    return `${fallback} (HTTP ${response.status} from CMS).`;
  }
  if (!response.ok) {
    return `${fallback} (HTTP ${response.status}).`;
  }
  return fallback;
}

