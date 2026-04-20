import { NextResponse } from 'next/server';

/** CMS-driven routes — avoid CDN/browser holding stale HTML after CMS edits. */
export function middleware() {
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  return res;
}

export const config = {
  matcher: [
    '/blog',
    '/blog/',
    '/blog/:path*',
    '/gallery',
    '/gallery/',
    '/gallery/:path*',
    '/single-artist',
    '/single-artist/',
    '/single-artist/:path*',
  ],
};
