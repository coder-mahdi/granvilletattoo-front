import type { Metadata } from 'next';
import { fetchBlogPosts } from '@/lib/blogApi';
import BlogList from '@/modules/blog/BlogList';

/** ISR: refresh blog index from WordPress every 5 minutes on Vercel. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Studio Blog | Granville Tattoo',
  description:
    'Catch up on Granville St. Tattoo news, artist highlights, piercing insights, and tattoo aftercare tips directly from our Vancouver studio.',
};

export default async function BlogPage() {
  const blogResponse = await fetchBlogPosts({ perPage: 50 }, {});
  const posts = blogResponse.items ?? [];

  return <BlogList posts={posts} initialCategory="all" />;
}
