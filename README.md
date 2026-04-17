# Granville Tattoo — Front (Next.js)

## Blog & booking API

Blog posts, booking, and gift-card requests talk to the **WordPress custom REST** namespace `granville/v1` on the studio CMS.

- **CMS URL:** `NEXT_PUBLIC_BOOKING_API_BASE` (optional).  
  If unset, the app calls `https://cms.granvilletattoo.ca/index.php` with `rest_route=/granville/v1/...` (the `/wp-json/...` pretty URL returns 500 on that host).
- **Blog list:** `GET …/granville/v1/blog` (via `buildGranvilleDirectUrl` in `src/lib/granvilleFetchUrl.ts`)
- **Single post:** `GET …/granville/v1/blog/{slug}`

Browser forms use the same-origin proxy `/api/granville/*` (see `src/app/api/granville/[...path]/route.ts`).

## Environment variables

Copy `.env.example` to `.env.local` for local dev. On **Vercel**, add the same keys under Project → Settings → Environment Variables.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BOOKING_API_BASE` | Optional. Pretty root like `https://…/wp-json/granville/v1`, or `https://…/index.php` for `rest_route` style. Omit → default `index.php` on cms.granvilletattoo.ca. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA for booking & gift card forms. |
| `NEXT_PUBLIC_BASE_PATH` | Only if the app is mounted under a subpath (rare on a root domain). |

## Deploy on Vercel

1. Connect this repo to Vercel; framework **Next.js** is auto-detected.
2. Set env vars (at least `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` if forms are used).
3. Ensure the WordPress site allows requests from your Vercel domain (CORS / firewall) if the API is locked down.
4. Blog routes use **ISR** (`revalidate = 300` seconds): new or edited posts appear after the next revalidation window without a full redeploy.

Local dev: `npm run dev` → [http://localhost:3000](http://localhost:3000).
