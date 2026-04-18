/**
 * Studio is in Vancouver. Pinning the IANA zone keeps server (e.g. Vercel UTC) and browser
 * date strings identical during hydration — otherwise `Intl` without `timeZone` uses local
 * machine TZ on the client vs server TZ on the server → React error #418 (text mismatch).
 */
const STUDIO_TIMEZONE = 'America/Vancouver';

export function formatStudioDateShort(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: STUDIO_TIMEZONE,
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export function formatStudioDateLong(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: STUDIO_TIMEZONE,
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
