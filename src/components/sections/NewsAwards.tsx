// src/components/sections/NewsAwards.tsx
// The /news page body (Figma "news" frame, node 722:13019).
import { fig } from '@/lib/figmaScale'
import { AwardsRecognition } from '@/components/sections/AwardsRecognition'
import { MoreStoriesCarousel } from '@/components/sections/MoreStoriesCarousel'
import { NewsStoryCard } from '@/components/ui/NewsStoryCard'
import { Ornament } from '@/components/ui/Ornament'
import type { NewsItem } from '@/types/sanity'

const FEATURED_COUNT = 3

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
              <NewsStoryCard key={item._id} item={item} priority={index === 0} />
            ))}
          </div>
        )}

        {news.length > 0 && <Ornament variant="vine" />}

        {moreStories.length > 0 && <MoreStoriesCarousel items={moreStories} />}

        <Ornament variant="symbol" />
      </div>
    </div>
  )
}
