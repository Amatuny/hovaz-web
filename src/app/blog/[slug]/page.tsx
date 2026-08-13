// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPostBySlug, getAllBlogSlugs } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { PortableText } from '@/components/sanity/PortableText'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — HOVAZ Journal`,
      description: post.excerpt ?? '',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author ?? 'HOVAZ Team'],
      images: post.featuredImage?.asset?._ref
        ? [urlFor(post.featuredImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export const revalidate = 3600

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <>
      {/* Hero */}
      <div className="pt-24" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        {/* Featured image */}
        {post.featuredImage?.asset?._ref && (
          <div className="relative w-full overflow-hidden" style={{ height: '60vh' }}>
            <Image
              src={urlFor(post.featuredImage).width(1920).height(1080).url()}
              alt={post.featuredImage.alt ?? post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="hero-overlay opacity-40" />
          </div>
        )}

        {/* Post header */}
        <div className="container-content max-w-prose mx-auto py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/blog"
              className="text-caption transition-colors"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              Journal
            </Link>
            <span style={{ color: 'var(--color-brand-stone)' }}>/</span>
            <span className="text-caption" style={{ color: 'var(--color-brand-burgundy)' }}>
              {post.title}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.categories?.[0] && (
              <span className="text-label" style={{ color: 'var(--color-brand-gold)' }}>
                {post.categories[0].replace(/_/g, ' ')}
              </span>
            )}
            {date && (
              <span className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
                {date}
              </span>
            )}
            {post.readingTime && (
              <span className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
                {post.readingTime} min read
              </span>
            )}
          </div>

          <h1 className="heading-display mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="font-serif text-xl"
              style={{
                color: 'var(--color-brand-stone)',
                lineHeight: '1.6',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          {post.author && (
            <div className="flex items-center gap-3 mt-8 pt-8 divider-cream">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
              >
                <span className="font-serif text-white text-sm">{post.author.charAt(0)}</span>
              </div>
              <div>
                <p className="text-label">Written by</p>
                <p
                  className="font-serif text-base"
                  style={{ color: 'var(--color-brand-charcoal)' }}
                >
                  {post.author}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post body */}
      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {post.body && post.body.length > 0 ? (
            <PortableText value={post.body} />
          ) : (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              Content coming soon.
            </p>
          )}
        </div>
      </div>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            author: {
              '@type': 'Person',
              name: post.author ?? 'HOVAZ Team',
            },
            datePublished: post.publishedAt,
            publisher: {
              '@type': 'Organization',
              name: 'HOVAZ Wine Rooms',
              url: 'https://hovazwines.com',
            },
            image: post.featuredImage?.asset?._ref
              ? urlFor(post.featuredImage).width(1200).height(630).url()
              : undefined,
          }),
        }}
      />

      {/* Bottom CTA */}
      <div className="section-padding-sm" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
                Enjoyed this?
              </p>
              <h3 className="heading-card">Experience HOVAZ in person</h3>
            </div>
            <div className="flex gap-4">
              <Link href="/events" className="btn-primary">
                Book an Experience
              </Link>
              <Link href="/blog" className="btn-secondary">
                More Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
      <PageTracker
        eventName="blog_post_read"
        parameters={{
          post_title: post.title,
          category: post.categories?.[0],
        }}
      />
    </>
  )
}
