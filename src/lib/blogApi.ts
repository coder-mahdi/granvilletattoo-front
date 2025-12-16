import { API_BASE } from './bookingApi';

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
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

type NextFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

type FetchOptions = Omit<RequestInit, 'headers' | 'cache' | 'next'> & {
  headers?: HeadersInit;
  cache?: RequestCache;
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
  // Add timestamp to bypass cache during build
  const buildTime = process.env.BUILD_TIME || Date.now().toString();
  const url = buildUrl('/blog', {
    category,
    tag,
    per_page: perPage,
    page,
    _t: buildTime, // Cache buster - unique URL on each build
  });

  const { headers: customHeaders, cache, ...restOptions } = fetchOptions;
  const headers = createHeaders(customHeaders);

  const response = await fetch(url, {
    cache: 'force-cache', // Use force-cache for static export, timestamp in URL ensures fresh data
    headers,
    ...restOptions,
    method: 'GET',
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
  // Add timestamp to bypass cache during build
  const buildTime = process.env.BUILD_TIME || Date.now().toString();
  const url = buildUrl(`/blog/${slug}`, {
    _t: buildTime, // Cache buster - unique URL on each build
  });

  const { headers: customHeaders, cache, ...restOptions } = fetchOptions;
  const headers = createHeaders(customHeaders);

  const response = await fetch(url, {
    cache: 'force-cache', // Use force-cache for static export, timestamp in URL ensures fresh data
    headers,
    ...restOptions,
    method: 'GET',
  });

  if (response.status === 404) {
    throw new Error('not_found');
  }

  if (!response.ok) {
    throw new Error('Unable to fetch blog post');
  }

  return response.json();
}
