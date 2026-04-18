/**
 * Site key from env (inlined at build). When set, forms **require** a token before submit.
 *
 * When empty, the app can still load a key from the CMS via `GET /api/recaptcha-site-key`
 * (see `src/app/api/recaptcha-site-key/route.ts`) — then reCAPTCHA runs if WordPress exposes it.
 *
 * **Enterprise:** set `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE=1` so we load `enterprise.js` and use
 * `grecaptcha.enterprise` (Google’s docs). Standard v3 uses `api.js` + `grecaptcha` only.
 */
export const RECAPTCHA_SITE_KEY =
  typeof process !== 'undefined'
    ? (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? '')
    : '';

const truthy = (v: string | undefined) => /^(1|true|yes)$/i.test(v?.trim() ?? '');

/** reCAPTCHA Enterprise (enterprise.js) vs standard v3 (api.js). */
export const RECAPTCHA_USE_ENTERPRISE =
  typeof process !== 'undefined' && truthy(process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE);

/** If true, submit must receive a token from `execute()` or we show an error. */
export const IS_RECAPTCHA_STRICT = RECAPTCHA_SITE_KEY.length > 0;

/** @deprecated Prefer `IS_RECAPTCHA_STRICT` — same value, kept for existing imports. */
export const IS_RECAPTCHA_ENABLED = IS_RECAPTCHA_STRICT;
