// src/components/ui/NewsStoryCard.tsx
// Large horizontal story card — photo left, category pill, date, title, excerpt and
// "Learn More" right. Used for the featured stories on /news and the "Up Next" card
// on /news/[slug].
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { formatNewsMonth, newsCategoryLabel, newsHref } from '@/lib/news'
import type { NewsItem } from '@/types/sanity'

export function NewsStoryCard({ item, priority = false }: { item: NewsItem; priority?: boolean }) {
  const month = formatNewsMonth(item.date)

  return (
    <article
      className="flex flex-wrap overflow-hidden bg-white"
      style={{ borderRadius: fig(24), boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
    >
      <div className="relative min-h-[320px] flex-[630_0_0]" style={{ minHeight: fig(420) }}>
        {item.featuredImage?.asset?._ref ? (
          <Image
            src={urlFor(item.featuredImage).width(1050).height(840).url()}
            alt={item.featuredImage.alt ?? item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 530px"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: '#b5adad' }} />
        )}
      </div>
      <div
        className="flex min-w-[min(432px,100%)] flex-[682_0_0] flex-col items-start justify-center"
        style={{ padding: fig(56), gap: fig(16) }}
      >
        <span
          className="rounded-full uppercase"
          style={{
            paddingInline: fig(14),
            paddingBlock: fig(6),
            backgroundColor: 'var(--color-brand-olive)',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: fig(10),
            letterSpacing: fig(1.2),
            color: '#fdfcf8',
          }}
        >
          {newsCategoryLabel(item)}
        </span>
        {month && (
          <time
            dateTime={item.date}
            style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#a8a290' }}
          >
            {month}
          </time>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(32),
            lineHeight: fig(40),
            color: '#1a1d17',
          }}
        >
          {item.title}
        </h2>
        {item.excerpt && (
          <p
            style={{
              maxWidth: fig(570),
              fontFamily: 'var(--font-hanken)',
              fontSize: fig(16),
              lineHeight: fig(25.6),
              color: '#4f4542',
            }}
          >
            {item.excerpt}
          </p>
        )}
        <Link
          href={newsHref(item)}
          className="inline-flex items-center justify-center capitalize transition-colors hover:bg-[var(--color-brand-olive)] hover:text-[#fdfcf8]"
          style={{
            border: '1.5px solid var(--color-brand-olive)',
            borderRadius: fig(60),
            paddingInline: fig(64),
            paddingBlock: fig(12),
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: fig(16),
            lineHeight: fig(24),
            letterSpacing: fig(2),
            color: 'var(--color-brand-olive)',
          }}
        >
          Learn More →
        </Link>
      </div>
    </article>
  )
}
