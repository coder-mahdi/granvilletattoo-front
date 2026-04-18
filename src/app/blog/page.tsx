import type { Metadata } from 'next';
import { fetchBlogPosts, type BlogListItem } from '@/lib/blogApi';
import { buildGranvilleDirectUrl } from '@/lib/granvilleFetchUrl';
import { formatStudioDateShort } from '@/lib/formatStudioDate';
import BlogList from '@/modules/blog/BlogList';

/** Do not prerender at build — WordPress may be unreachable during CI/Vercel build. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Studio Blog | Granville Tattoo',
  description:
    'Catch up on Granville St. Tattoo news, artist highlights, piercing insights, and tattoo aftercare tips directly from our Vancouver studio.',
};

export default async function BlogPage() {
  const listUrl = buildGranvilleDirectUrl('/blog', { per_page: 50 });
  let blogResponse;
  try {
    blogResponse = await fetchBlogPosts({ perPage: 50 }, { next: { revalidate: 0 } });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[blog] fetch failed:', listUrl, err);
    }
    throw err;
  }

  const items = blogResponse.items ?? [];
  const posts: BlogListItem[] = items.map((post) => ({
    ...post,
    publishedAtLabel: formatStudioDateShort(post.publishedAt),
  }));

  if (process.env.NODE_ENV === 'development') {
    console.log('[blog]', posts.length, 'posts ←', listUrl);
  }

  return <BlogList posts={posts} initialCategory="all" />;
}
