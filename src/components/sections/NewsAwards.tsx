// src/components/sections/NewsAwards.tsx
// The /news page body (Figma "news" frame, node 722:13019).
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { formatNewsMonth, newsCategoryLabel, newsHref } from '@/lib/news'
import { AwardsRecognition } from '@/components/sections/AwardsRecognition'
import { MoreStoriesCarousel } from '@/components/sections/MoreStoriesCarousel'
import type { NewsItem } from '@/types/sanity'

const FEATURED_COUNT = 3

function Ornament({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <div className="flex items-center justify-center overflow-hidden" style={{ height: fig(100) }}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ width: fig(width), height: fig(height) }}
      />
    </div>
  )
}

function FeaturedStory({ item, priority }: { item: NewsItem; priority: boolean }) {
  const href = newsHref(item)
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
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
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
          </a>
        )}
      </div>
    </article>
  )
}

export function NewsAwards({ news }: { news: NewsItem[] }) {
  const awards = news.filter((item) => item.category === 'award')
  const stories = news.filter((item) => item.category !== 'award')

  // Up to 3 large cards: stories marked Featured first, then the newest.
  const featured = [
    ...stories.filter((item) => item.featured),
    ...stories.filter((item) => !item.featured),
  ].slice(0, FEATURED_COUNT)
  // Everything else — awards included — goes in the "More Stories" strip.
  const featuredIds = new Set(featured.map((item) => item._id))
  const moreStories = news.filter((item) => !featuredIds.has(item._id))

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col pt-12 pb-12" style={{ gap: fig(82) }}>
        <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: fig(12),
              letterSpacing: fig(3),
              color: 'rgba(93,110,82,0.92)',
            }}
          >
            Journal
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(44),
              letterSpacing: fig(0.5),
              color: '#1a1d17',
            }}
          >
            News &amp; Awards
          </h1>
        </div>

        {news.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: fig(16),
              color: 'var(--color-brand-stone)',
            }}
          >
            News coming soon.
          </p>
        )}

        {awards.length > 0 && <AwardsRecognition awards={awards} />}

        {featured.length > 0 && (
          <div
            className="mx-auto flex w-full flex-col"
            style={{ maxWidth: fig(1200), gap: fig(64) }}
          >
            {featured.map((item, index) => (
              <FeaturedStory key={item._id} item={item} priority={index === 0} />
            ))}
          </div>
        )}

        {news.length > 0 && <Ornament src="/wines/vine-divider.svg" width={677.469} height={78} />}

        {moreStories.length > 0 && <MoreStoriesCarousel items={moreStories} />}

        <Ornament src="/wines/collection-symbol.svg" width={666.622} height={83.3614} />
      </div>
    </div>
  )
}
