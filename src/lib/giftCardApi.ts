import { buildGranvilleFetchUrl } from './granvilleFetchUrl';

export type GiftCardRequestPayload = {
  giftCardType: 'silver' | 'gold';
  giftCardValue: number;
  price: number;
  sender: {
    name: string;
    email: string;
    phone: string;
  };
  recipient: {
    name: string;
    email: string;
    phone: string;
    details?: string;
  };
  recaptcha_token?: string;
};

export type GiftCardResponse = {
  ok: boolean;
  gift_card_id: number;
  gift_card_code: string;
  status: string;
  message: string;
};

function buildUrl(path: string): string {
  return buildGranvilleFetchUrl(path);
}

async function safeParseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function submitGiftCard(payload: GiftCardRequestPayload): Promise<GiftCardResponse> {
  // Development mode: only use mock if API is truly unavailable
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                        (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
  
  // Helper function to generate mock response (only used as fallback)
  const getMockResponse = (): GiftCardResponse => {
    const mockCode = `GC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    console.warn('Development mode: API endpoint not available, using mock response');
    return {
      ok: true,
      gift_card_id: Math.floor(Math.random() * 10000),
      gift_card_code: mockCode,
      status: 'giftcard_pending',
      message: 'Gift card created successfully (Development Mode - Mock Response).',
    };
  };
  
  try {
    const url = buildUrl('/gift-card');
    console.log('Submitting gift card to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // If successful, return real response (data will be saved in WordPress)
    if (response.ok) {
      const result = await response.json();
      console.log('Gift card created successfully:', result);
      return result;
    }

    // Handle errors
    const errorBody = await safeParseJson(response);
    
    // In development mode, if endpoint not found (404), return mock as fallback
    const isRouteNotFound = response.status === 404 || 
        errorBody?.message?.includes('No route was found') ||
        errorBody?.code === 'rest_no_route' ||
        errorBody?.data?.status === 404;
    
    if (isDevelopment && isRouteNotFound) {
      console.warn('Development mode: Endpoint not found, using mock response as fallback');
      console.warn('Error details:', errorBody);
      return getMockResponse();
    }
    
    // For other errors, throw normally (so user sees the actual error)
    const errorMessage = errorBody?.message || errorBody?.error || `Server error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
    
  } catch (error) {
    // In development mode, only use mock for network errors (CORS, connection refused, etc.)
    if (isDevelopment && error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Development mode: Network error (API may not be accessible), using mock response');
      return getMockResponse();
    }
    
    // Handle network errors in production
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection and try again.');
    }
    
    // Re-throw other errors (validation errors, etc. should be shown to user)
    throw error;
  }
}

