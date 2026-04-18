import type { Metadata } from 'next';
import { fetchBlogPosts } from '@/lib/blogApi';
import { buildGranvilleDirectUrl } from '@/lib/granvilleFetchUrl';
import BlogList from '@/modules/blog/BlogList';

/** Do not prerender at build — WordPress may be unreachable during CI/Vercel build. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Studio Blog | Granville Tattoo',
  description:
    'Catch up on Granville St. Tattoo news, artist highlights, piercing insights, and tattoo aftercare tips directly from our Vancouver studio.',
};

export default async function BlogPage() {
  if (process.env.NODE_ENV === 'development') {
    console.log('[blog] CMS list URL:', buildGranvilleDirectUrl('/blog', { per_page: 50 }));
  }

  // No Data Cache — list matches WordPress right after publish (see `blogApi.ts` default revalidate for other callers).
  const blogResponse = await fetchBlogPosts({ perPage: 50 }, { next: { revalidate: 0 } });
  const posts = blogResponse.items ?? [];

  return <BlogList posts={posts} initialCategory="all" />;
}
