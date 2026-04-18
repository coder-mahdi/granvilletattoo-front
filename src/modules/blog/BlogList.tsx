'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import type { BlogListItem, BlogTerm } from '@/lib/blogApi';

type BlogListProps = {
  posts: BlogListItem[];
  initialCategory?: string;
};

type FilterOption = {
  label: string;
  value: string;
};

const DEFAULT_IMAGE = '/images/general/general-1.webp';

export default function BlogList({ posts, initialCategory = 'all' }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const filterOptions: FilterOption[] = useMemo(() => {
    const categoryMap = new Map<string, BlogTerm>();

    posts.forEach((post) => {
      (post.categories ?? []).forEach((category) => {
        if (!categoryMap.has(category.slug)) {
          categoryMap.set(category.slug, category);
        }
      });
    });

    const options: FilterOption[] = Array.from(categoryMap.values()).map((category) => ({
      label: category.name,
      value: category.slug,
    }));

    options.sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

    return [{ label: 'All Posts', value: 'all' }, ...options];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }

    return posts.filter((post) =>
      (post.categories ?? []).some((category) => category.slug === selectedCategory),
    );
  }, [posts, selectedCategory]);

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <Container>
          <div className="blog-hero__content">
            <span className="blog-hero__eyebrow">Studio Insights & Stories</span>
            <h1 className="blog-hero__title">Granville Tattoo Journal</h1>
            <p className="blog-hero__subtitle">
              Walk in, always welcome
            </p>
          </div>
        </Container>
      </section>

      <section className="blog-filters">
        <Container>
          <div className="blog-filters__inner">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`blog-filter__button ${selectedCategory === option.value ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section className="blog-grid-section">
        <Container>
          {filteredPosts.length === 0 ? (
            <div className="blog-empty">
              <h2>No posts found for this category yet.</h2>
              <p>Check back soon—we are working on fresh stories and updates.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredPosts.map((post) => {
                const hero = post.heroImage?.url ?? DEFAULT_IMAGE;
                return (
                  <article className="blog-card" key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="blog-card__image">
                      <Image
                        src={hero}
                        alt={post.heroImage?.alt || `${post.title} hero image`}
                        width={640}
                        height={400}
                        priority={false}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                      />
                    </Link>
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        <span className="blog-card__date">{post.publishedAtLabel}</span>
                        <div className="blog-card__categories">
                          {(post.categories ?? []).map((category) => (
                            <span key={category.id} className="blog-card__category">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="blog-card__title">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`} className="blog-card__cta">
                        Read Full Post
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
