import type { Metadata } from 'next';
import { fetchBlogPosts } from '@/lib/blogApi';
import BlogList from '@/modules/blog/BlogList';

export const metadata: Metadata = {
  title: 'Studio Blog | Granville Tattoo',
  description:
    'Catch up on Granville St. Tattoo news, artist highlights, piercing insights, and tattoo aftercare tips directly from our Vancouver studio.',
};

export default async function BlogPage() {
  const fetchOptions =
    process.env.NODE_ENV === 'development' ? ({ cache: 'no-store' } as const) : undefined;
  const blogResponse = await fetchBlogPosts({ perPage: 50 }, fetchOptions);
  const posts = blogResponse.items ?? [];

  return <BlogList posts={posts} initialCategory="all" />;
}
