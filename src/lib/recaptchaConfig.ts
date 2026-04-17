/**
 * Site key from env (inlined at build). When set, forms **require** a token before submit.
 *
 * When empty, the app can still load a key from the CMS via `GET /api/recaptcha-site-key`
 * (see `src/app/api/recaptcha-site-key/route.ts`) — then reCAPTCHA runs if WordPress exposes it.
 */
export const RECAPTCHA_SITE_KEY =
  typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? '')
    : '';

/** If true, submit must receive a token from `execute()` or we show an error. */
export const IS_RECAPTCHA_STRICT = RECAPTCHA_SITE_KEY.length > 0;

/** @deprecated Prefer `IS_RECAPTCHA_STRICT` — same value, kept for existing imports. */
export const IS_RECAPTCHA_ENABLED = IS_RECAPTCHA_STRICT;
