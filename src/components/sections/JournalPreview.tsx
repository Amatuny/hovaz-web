// src/components/sections/JournalPreview.tsx
// Homepage "The Journal" strip — latest news cards linking to /news/[slug].
import Link from 'next/link'
import type { NewsItem } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'
import { NewsCard } from '@/components/ui/NewsCard'

interface JournalPreviewProps {
  news: NewsItem[]
}

export function JournalPreview({ news }: JournalPreviewProps) {
  if (!news?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p
          className="mb-4 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          The Journal
        </p>
        <h2
          className="mb-4 capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.6vw, 36px)',
            color: '#1a1d17',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
          }}
        >
          A Taste Of What&apos;s New
        </h2>
        <p
          className="mb-10 max-w-[860px]"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '26px',
            color: '#4f4542',
          }}
        >
          New releases, harvest updates, and the small things worth knowing between visits — written
          by the people actually making the wine.
        </p>

        <DragScroll className="flex gap-4 pb-2 snap-x snap-mandatory">
          {news.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </DragScroll>

        <div className="mt-8">
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 border-b-2 border-[#1a1d17] px-2 pb-1 transition-colors hover:border-[var(--color-brand-gold)]"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '1px',
              color: '#1a1d17',
            }}
          >
            <span className="transition-colors group-hover:text-[var(--color-brand-gold)]">
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
