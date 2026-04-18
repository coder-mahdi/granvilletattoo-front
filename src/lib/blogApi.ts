import { buildGranvilleDirectUrl } from './granvilleFetchUrl';

/**
 * Granville REST (server-side fetch):
 * - List: `GET` with `rest_route=/granville/v1/blog` (+ `per_page`, `page`, `category`, `tag` when set).
 * - Single: `rest_route=/granville/v1/blog/{slug}`.
 * Base URL comes from `BOOKING_API_BASE_URL` / `NEXT_PUBLIC_BOOKING_API_BASE`, else default
 * `https://cms.granvilletattoo.ca/index.php` (see `granvilleFetchUrl.ts`).
 */
/** Seconds — blog list & posts revalidate on Vercel (ISR) unless overridden per fetch. */
const BLOG_REVALIDATE_SECONDS = 300;

export type BlogImage = {
  id: number;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
} | null;

export type BlogGalleryItem = {
  image: BlogImage;
  caption: string;
};

export type BlogTerm = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroImage: BlogImage;
  gallery: BlogGalleryItem[];
  categories: BlogTerm[];
  tags: BlogTerm[];
  publishedAt: string;
};

/** Server adds `publishedAtLabel` so the client list never runs `Intl` (avoids hydration #418). */
export type BlogListItem = BlogPost & { publishedAtLabel: string };

export type BlogListResponse = {
  items: BlogPost[];
  found_posts: number;
  pages: number;
  page: number;
};

type BlogListParams = {
  category?: string;
  tag?: string;
  perPage?: number;
  page?: number;
};

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  return buildGranvilleDirectUrl(path, params);
}

type NextFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

type FetchOptions = Omit<RequestInit, 'headers' | 'cache' | 'next'> & {
  headers?: HeadersInit;
  next?: NextFetchOptions;
};

function createHeaders(custom?: HeadersInit): Headers {
  const headers = new Headers({ Accept: 'application/json' });
  if (custom) {
    const extra = new Headers(custom);
    extra.forEach((value, key) => headers.set(key, value));
  }
  return headers;
}

export async function fetchBlogPosts(
  params: BlogListParams = {},
  fetchOptions: FetchOptions = {},
): Promise<BlogListResponse> {
  const { category, tag, perPage, page } = params;
  const url = buildUrl('/blog', {
    category,
    tag,
    per_page: perPage,
    page,
  });

  const { headers: customHeaders, next: nextOptions, ...restOptions } = fetchOptions;
  const headers = createHeaders(customHeaders);
  const next = { revalidate: BLOG_REVALIDATE_SECONDS, ...nextOptions };
  const bypassDataCache = next.revalidate === 0;

  if (bypassDataCache) {
    headers.set('Cache-Control', 'no-cache');
    headers.set('Pragma', 'no-cache');
  }
  const requestUrl = bypassDataCache ? `${url}&_=${Date.now()}` : url;

  const response = await fetch(requestUrl, {
    headers,
    ...restOptions,
    method: 'GET',
    ...(bypassDataCache ? { cache: 'no-store' as const } : {}),
    next,
  });

  if (!response.ok) {
    throw new Error('Unable to fetch blog posts');
  }

  return response.json();
}

export async function fetchBlogPostBySlug(
  slug: string,
  fetchOptions: FetchOptions = {},
): Promise<BlogPost> {
  const url = buildUrl(`/blog/${slug}`, {});

  const { headers: customHeaders, next: nextOptions, ...restOptions } = fetchOptions;
  const headers = createHeaders(customHeaders);
  const next = { revalidate: BLOG_REVALIDATE_SECONDS, ...nextOptions };
  const bypassDataCache = next.revalidate === 0;

  if (bypassDataCache) {
    headers.set('Cache-Control', 'no-cache');
    headers.set('Pragma', 'no-cache');
  }
  const requestUrl = bypassDataCache ? `${url}&_=${Date.now()}` : url;

  const response = await fetch(requestUrl, {
    headers,
    ...restOptions,
    method: 'GET',
    ...(bypassDataCache ? { cache: 'no-store' as const } : {}),
    next,
  });

  if (response.status === 404) {
    throw new Error('not_found');
  }

  if (!response.ok) {
    throw new Error('Unable to fetch blog post');
  }

  return response.json();
}
