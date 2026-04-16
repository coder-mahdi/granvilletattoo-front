/** WordPress `granville/v1` REST base (blog, booking, gift card). Override on Vercel via env. */
export const API_BASE = process.env.NEXT_PUBLIC_BOOKING_API_BASE?.replace(/\/$/, '')
  || 'https://granvilletattoo.ca/cms/wp-json/granville/v1';

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
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }
  return url.toString();
}

export async function fetchAvailability(date: string, time: string): Promise<AvailabilityResponse> {
  const response = await fetch(buildUrl('/availability', { date, time }), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await safeParseJson(response);
    throw new Error(errorBody?.message || 'Unable to check availability');
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

  const response = await fetch(buildUrl('/booking'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await safeParseJson(response);
    throw new Error(errorBody?.message || 'Unable to create booking');
  }

  return response.json();
}

async function safeParseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

