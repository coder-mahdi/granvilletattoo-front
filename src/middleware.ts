import { NextResponse } from 'next/server';

/** Blog is CMS-driven — avoid CDN/browser holding HTML after posts are deleted or renamed. */
export function middleware() {
  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  return res;
}

export const config = {
  matcher: ['/blog', '/blog/', '/blog/:path*'],
};
