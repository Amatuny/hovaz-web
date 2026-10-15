// src/components/ui/NewsCard.tsx
// Photo card for a news item — category · year, title and a one-line excerpt over a
// dark gradient. On hover the photo zooms in under a soft white wash and a
// "Learn More" link slides in — that link is the only clickable part of the card.
// Used in the "More Stories" strip on /news and the homepage Journal.
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { newsCategoryLabel, newsHref, newsYear } from '@/lib/news'
import type { NewsItem } from '@/types/sanity'

export function NewsCard({ item }: { item: NewsItem }) {
  const href = newsHref(item)
  const label = [newsCategoryLabel(item), newsYear(item)].filter(Boolean).join(' · ')

  const content = (
    <>
      {item.featuredImage?.asset?._ref && (
        <Image
          src={urlFor(item.featuredImage).width(800).height(560).url()}
          alt={item.featuredImage.alt ?? item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-focus-within:scale-110"
          sizes="400px"
          draggable={false}
        />
      )}
      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-700 group-hover:opacity-35 group-focus-within:opacity-35" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.64) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 flex flex-col text-white"
        style={{ padding: fig(36), gap: fig(16), width: fig(320) }}
      >
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: fig(10),
            lineHeight: fig(13),
            letterSpacing: fig(2.5),
          }}
        >
          {label}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 500,
            fontSize: fig(18),
            lineHeight: fig(26.1),
            letterSpacing: fig(0.5),
            color: 'white',
          }}
        >
          {item.title}
        </h3>
        {item.excerpt && (
          <p
            className="truncate"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 300,
              fontSize: fig(13),
              lineHeight: fig(24.05),
            }}
          >
            {item.excerpt}
          </p>
        )}
        {/* Collapsed to zero height (cancelling the column gap) until hover. */}
        <div
          className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100"
          style={{ marginTop: `calc(-1 * ${fig(16)})` }}
        >
          <div className="overflow-hidden">
            <Link
              href={href}
              aria-label={`Learn more: ${item.title}`}
              className="inline-flex items-center border-b-2 border-white transition-colors duration-300 hover:border-[#bdbdbd] hover:text-[#bdbdbd]"
              style={{
                marginTop: fig(16),
                paddingInline: fig(8),
                paddingBottom: fig(4),
                gap: fig(8),
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: fig(16),
                letterSpacing: fig(1.5),
              }}
            >
              Learn More <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )

  const className = 'group relative shrink-0 snap-start overflow-hidden'
  const style: React.CSSProperties = {
    width: fig(400),
    height: fig(280),
    borderRadius: fig(24),
    backgroundColor: '#b5adad',
  }

  return (
    <article className={className} style={style}>
      {content}
    </article>
  )
}
