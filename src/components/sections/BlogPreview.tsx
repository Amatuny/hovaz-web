// src/components/sections/BlogPreview.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { BlogPost } from '@/types/sanity'

interface BlogPreviewProps {
  posts: BlogPost[]
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
          The Journal
        </p>
        <h2 className="heading-section mb-3">A Taste Of What&apos;s New</h2>
        <p className="mb-10 max-w-xl text-base" style={{ color: 'var(--color-brand-stone)' }}>
          New releases, harvest updates, and the small things worth knowing between visits — written
          by the people actually making the wine.
        </p>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map((post) => {
            const year = post.publishedAt ? new Date(post.publishedAt).getFullYear() : null
            const category = post.categories?.[0]?.replace(/_/g, ' ')

            return (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group relative block shrink-0 snap-start overflow-hidden rounded-2xl"
                style={{
                  width: '320px',
                  height: '320px',
                  backgroundColor: 'var(--color-brand-dark)',
                }}
              >
                {/* Image */}
                {post.featuredImage?.asset?._ref ? (
                  <Image
                    src={urlFor(post.featuredImage).width(640).height(640).url()}
                    alt={post.featuredImage.alt ?? post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="320px"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                  />
                )}

                {/* Gradient overlay for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(26,10,13,0.88) 0%, rgba(26,10,13,0.15) 45%, rgba(26,10,13,0.3) 100%)',
                  }}
                />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  {(category || year) && (
                    <p
                      className="text-label mb-2 text-white/70"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}
                    >
                      {[category, year].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <h3 className="mb-1.5 font-serif text-white" style={{ fontSize: '1.15rem' }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-white/75 line-clamp-1" style={{ lineHeight: 1.6 }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-sans text-base"
            style={{ color: 'var(--color-brand-charcoal)' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Read The Journal
            </span>
            <span
              aria-hidden="true"
              className="transition-colors group-hover:text-[var(--color-brand-gold)]"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
