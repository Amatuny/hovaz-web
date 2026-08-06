// src/components/ui/BlogCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { BlogPost } from '@/types/sanity'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug.current}`}
        className="card-wine group block md:grid md:grid-cols-2 overflow-hidden"
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
          {post.featuredImage?.asset?._ref ? (
            <Image
              src={urlFor(post.featuredImage).width(800).height(600).url()}
              alt={post.featuredImage.alt ?? post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: 'var(--color-brand-blush)' }}
            />
          )}
        </div>

        {/* Content */}
        <div
          className="p-8 flex flex-col justify-center"
          style={{ backgroundColor: 'var(--color-brand-cream)' }}
        >
          <div className="flex items-center gap-3 mb-4">
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
          </div>
          <h2 className="heading-card mb-4" style={{ fontSize: '1.5rem' }}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p
              className="text-body mb-6 line-clamp-3"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="btn-ghost text-xs">Read more →</span>
            {post.readingTime && <span className="text-caption">{post.readingTime} min read</span>}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug.current}`} className="card-wine group block overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {post.featuredImage?.asset?._ref ? (
          <Image
            src={urlFor(post.featuredImage).width(600).height(400).url()}
            alt={post.featuredImage.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--color-brand-blush)' }} />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
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
        </div>
        <h3 className="heading-card mb-3" style={{ fontSize: '1.1rem' }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-body mb-4 line-clamp-2"
            style={{ fontSize: '0.875rem', color: 'var(--color-brand-stone)' }}
          >
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="btn-ghost text-xs">Read →</span>
          {post.readingTime && <span className="text-caption">{post.readingTime} min read</span>}
        </div>
      </div>
    </Link>
  )
}
