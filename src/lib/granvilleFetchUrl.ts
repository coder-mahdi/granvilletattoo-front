/**
 * WordPress Granville REST — URL builder.
 *
 * On cms.granvilletattoo.ca, pretty permalinks `/wp-json/...` return 500 while
 * `index.php?rest_route=/granville/v1/...` works. Default therefore uses the
 * query form unless you set a non-.php `NEXT_PUBLIC_BOOKING_API_BASE` (pretty root).
 */

const DEFAULT_PHP_REST_ENTRY = 'https://cms.granvilletattoo.ca/index.php';

export function resolveConfiguredGranvilleRoot(): string | null {
  const raw =
    process.env.BOOKING_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_BOOKING_API_BASE?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

function isPhpRestEntry(base: string): boolean {
  return /\.php$/i.test(base);
}

function appendParams(
  url: URL,
  params?: Record<string, string | number | undefined>,
): void {
  if (!params) return;
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
}

function clientBasePathPrefix(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
  if (!raw || raw === '/') return '';
  return `/${raw.replace(/^\/+|\/+$/g, '')}`;
}

/**
 * Absolute URL to the CMS (server-side fetches: blog ISR, API route proxy).
 * - Env base ending in `.php` → that entry + `rest_route=/granville/v1{path}`
 * - Env base set otherwise → treat as pretty prefix + path (e.g. …/wp-json/granville/v1)
 * - No env → default PHP entry + `rest_route`
 */
export function buildGranvilleDirectUrl(
  path: string,
  params?: Record<string, string | number | undefined>,
): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const configured = resolveConfiguredGranvilleRoot();

  if (configured && !isPhpRestEntry(configured)) {
    const url = new URL(`${configured}${p}`);
    appendParams(url, params);
    return url.toString();
  }

  const entry =
    configured && isPhpRestEntry(configured) ? configured : DEFAULT_PHP_REST_ENTRY;
  const url = new URL(entry);
  url.searchParams.set('rest_route', `/granville/v1${p}`);
  appendParams(url, params);
  return url.toString();
}

/**
 * Browser → same-origin `/api/granville/...` (CORS-safe). Server → `buildGranvilleDirectUrl`.
 * Path must start with `/` (e.g. `/availability`, `/blog`).
 */
export function buildGranvilleFetchUrl(
  path: string,
  params?: Record<string, string | undefined>,
): string {
  const p = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    let pathname = `${clientBasePathPrefix()}/api/granville${p}`;
    if (!pathname.endsWith('/')) pathname += '/';
    const url = new URL(pathname, window.location.origin);
    appendParams(url, params);
    return url.toString();
  }

  return buildGranvilleDirectUrl(p, params);
}
