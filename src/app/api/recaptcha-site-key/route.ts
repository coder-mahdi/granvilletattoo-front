import { NextResponse } from 'next/server';
import { buildGranvilleDirectUrl } from '@/lib/granvilleFetchUrl';

export const dynamic = 'force-dynamic';

/**
 * Public site key for the browser (never the secret).
 * 1) Uses `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` when set.
 * 2) Otherwise GETs CMS `GET /granville/v1/recaptcha-site-key` (same base as booking API).
 *
 * WordPress should register that route and return JSON, e.g. `{ "siteKey": "6L…" }`
 * or `{ "site_key": "6L…" }`.
 */
export async function GET() {
  const envKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  if (envKey) {
    return NextResponse.json({ siteKey: envKey, source: 'env' });
  }

  try {
    const url = buildGranvilleDirectUrl('/recaptcha-site-key');
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ siteKey: null, source: 'cms', cmsStatus: res.status });
    }

    const data = (await res.json().catch(() => null)) as Record<string, unknown> | null;
    const raw =
      (typeof data?.site_key === 'string' && data.site_key) ||
      (typeof data?.siteKey === 'string' && data.siteKey) ||
      (typeof data?.recaptcha_site_key === 'string' && data.recaptcha_site_key) ||
      '';
    const siteKey = String(raw).trim() || null;

    return NextResponse.json({ siteKey, source: 'cms' });
  } catch (e) {
    console.error('[api/recaptcha-site-key] CMS fetch failed:', e);
    return NextResponse.json({ siteKey: null, source: 'cms', error: 'fetch_failed' });
  }
}
