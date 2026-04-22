import { NextRequest, NextResponse } from 'next/server';
import { buildGranvilleDirectUrl } from '@/lib/granvilleFetchUrl';

export const dynamic = 'force-dynamic';

/** Only proxy known Granville routes (avoid open relay to arbitrary CMS paths). */
const ALLOWED_FIRST_SEGMENT = new Set([
  'availability',
  'booking',
  'piercing-work',
  'gift-card',
  'consent',
  'blog',
  'recaptcha-site-key',
  'artists',
]);

function assertSafePath(segments: string[]): string | null {
  if (!segments.length) return null;
  for (const s of segments) {
    if (s === '..' || s.includes('\\') || s.includes('//')) return null;
  }
  if (!ALLOWED_FIRST_SEGMENT.has(segments[0])) return null;
  return segments.join('/');
}

async function proxy(request: NextRequest, segments: string[]) {
  const safe = assertSafePath(segments);
  if (!safe) {
    return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
  }

  const path = `/${safe}`;
  const queryParams: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  const target = buildGranvilleDirectUrl(path, queryParams);

  try {
    if (request.method === 'GET' || request.method === 'HEAD') {
      const res = await fetch(target, {
        method: request.method,
        headers: {
          Accept: request.headers.get('accept') || 'application/json',
        },
        cache: 'no-store',
      });
      const body = await res.arrayBuffer();
      return new NextResponse(body, {
        status: res.status,
        headers: {
          'content-type': res.headers.get('content-type') || 'application/json',
        },
      });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const res = await fetch(target, {
        method: request.method,
        body: formData,
        cache: 'no-store',
      });
      const body = await res.arrayBuffer();
      return new NextResponse(body, {
        status: res.status,
        headers: {
          'content-type': res.headers.get('content-type') || 'application/json',
        },
      });
    }

    const bodyText = await request.text();
    const res = await fetch(target, {
      method: request.method,
      headers: {
        Accept: request.headers.get('accept') || 'application/json',
        'Content-Type': contentType || 'application/json',
      },
      body: bodyText,
      cache: 'no-store',
    });
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (err) {
    console.error('[api/granville] upstream fetch failed:', err);
    return NextResponse.json(
      { message: 'Unable to reach booking service. Please try again later.' },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxy(request, path);
}
