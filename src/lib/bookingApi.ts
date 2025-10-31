export const API_BASE = process.env.NEXT_PUBLIC_BOOKING_API_BASE?.replace(/\/$/, '')
  || 'https://mahdiroozbahani.com/granvilltattoo/cms/wp-json/granville/v1';

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
  notes?: string;
  date: string;
  time: string;
  birthdate?: string;
  artist_id?: number;
  preferred_artist_name?: string;
  preferred_artist_email?: string;
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
  const response = await fetch(buildUrl('/booking'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
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

