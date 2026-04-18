import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import { fetchBlogPostBySlug } from '@/lib/blogApi';
import { formatStudioDateLong } from '@/lib/formatStudioDate';

const DEFAULT_IMAGE = '/images/general/general-1.webp';

/** Every request hits the server + CMS (no stale SSG shell, new slugs work without redeploy). */
export const dynamic = 'force-dynamic';

export const dynamicParams = true;

/** No `generateStaticParams` — avoids shipping stale HTML for old slugs after posts are removed from CMS. */

type BlogPageParams = { slug: string };

export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
): Promise<Metadata> {
  const { slug } = params as BlogPageParams;
  try {
    const post = await fetchBlogPostBySlug(slug, { next: { revalidate: 0 } });
    return {
      title: `${post.title} | Granville Tattoo Blog`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: 'Blog Post | Granville Tattoo',
    };
  }
}

export default async function BlogPostPage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  const { slug } = params as BlogPageParams;
  let post;
  try {
    post = await fetchBlogPostBySlug(slug, { next: { revalidate: 0 } });
  } catch {
    return notFound();
  }

  const heroUrl = post.heroImage?.url ?? DEFAULT_IMAGE;
  const heroAlt = post.heroImage?.alt || `${post.title} hero image`;

  return (
    <div className="blog-single">
      <section className="blog-single__hero">
        <div className="blog-single__hero-image">
          <Image
            src={heroUrl}
            alt={heroAlt}
            fill
            priority
            className="blog-single__hero-img"
            sizes="100vw"
          />
          <div className="blog-single__overlay" />
        </div>
        <Container>
          <div className="blog-single__hero-content">
            <div className="blog-single__chips">
              <span className="blog-chip blog-chip--date">
                {formatStudioDateLong(post.publishedAt)}
              </span>
              {(post.categories ?? []).map((category) => (
                <span key={category.id} className="blog-chip">
                  {category.name}
                </span>
              ))}
            </div>
            <h1 className="blog-single__title">{post.title}</h1>
            {post.excerpt && <p className="blog-single__excerpt">{post.excerpt}</p>}
          </div>
        </Container>
      </section>

      <section className="blog-single__content">
        <Container>
          <article className="blog-single__article" dangerouslySetInnerHTML={{ __html: post.content }} />

          {(post.gallery ?? []).length > 0 && (
            <div className="blog-gallery">
              <h2 className="blog-gallery__title">Gallery</h2>
              <div className="blog-gallery__grid">
                {(post.gallery ?? []).map((item, index) => {
                  const image = item.image;
                  if (!image?.url) {
                    return null;
                  }
                  return (
                    <figure className="blog-gallery__item" key={`${image.url}-${index}`}>
                      <Image
                        src={image.url}
                        alt={image.alt || `Gallery image ${index + 1} for ${post.title}`}
                        width={600}
                        height={400}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                      {item.caption && <figcaption>{item.caption}</figcaption>}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}

          {(post.tags ?? []).length > 0 && (
            <div className="blog-single__tags">
              <span className="blog-single__tags-label">Tags:</span>
              <div className="blog-single__tags-list">
                {(post.tags ?? []).map((tag) => (
                  <span key={tag.id} className="blog-chip blog-chip--tag">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="blog-single__back">
            <Link href="/blog" className="blog-single__back-link">
              ← Back to all posts
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
