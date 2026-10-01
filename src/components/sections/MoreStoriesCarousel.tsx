// src/components/sections/MoreStoriesCarousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { DragScroll } from '@/components/ui/DragScroll'
import { newsCategoryLabel, newsHref, newsYear } from '@/lib/news'
import type { NewsItem } from '@/types/sanity'

function StoryCard({ item }: { item: NewsItem }) {
  const href = newsHref(item)
  const label = [newsCategoryLabel(item), newsYear(item)].filter(Boolean).join(' · ')

  const content = (
    <>
      {item.featuredImage?.asset?._ref && (
        <Image
          src={urlFor(item.featuredImage).width(800).height(560).url()}
          alt={item.featuredImage.alt ?? item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="400px"
          draggable={false}
        />
      )}
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
      </div>
    </>
  )

  const className = 'group relative block shrink-0 snap-start overflow-hidden'
  const style: React.CSSProperties = {
    width: fig(400),
    height: fig(280),
    borderRadius: fig(24),
    backgroundColor: '#b5adad',
  }

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {content}
    </a>
  ) : (
    <div className={className} style={style}>
      {content}
    </div>
  )
}

export function MoreStoriesCarousel({ items }: { items: NewsItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)

  function measure() {
    const el = scrollRef.current
    if (!el || el.clientWidth === 0) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const count = maxScroll > 1 ? Math.ceil(el.scrollWidth / el.clientWidth) : 1
    setPages(count)
    // The last page may be partial, so the final dot lights up once the
    // strip is scrolled all the way to the end.
    setPage(
      maxScroll > 1 && el.scrollLeft >= maxScroll - 1
        ? count - 1
        : Math.round(el.scrollLeft / el.clientWidth)
    )
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function goTo(index: number) {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col" style={{ gap: fig(32) }}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(28),
          color: '#1a1d17',
        }}
      >
        More Stories
      </h2>
      <DragScroll
        scrollRef={scrollRef}
        onScroll={measure}
        className="flex snap-x"
        style={{ gap: fig(37) }}
      >
        {items.map((item) => (
          <StoryCard key={item._id} item={item} />
        ))}
      </DragScroll>
      {pages > 1 && (
        <div className="flex justify-center" style={{ gap: fig(8), paddingTop: fig(8) }}>
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show stories page ${index + 1}`}
              aria-current={index === page}
              onClick={() => goTo(index)}
              className="cursor-pointer transition-all"
              style={{
                width: index === page ? fig(24) : fig(12),
                height: fig(8),
                borderRadius: fig(4),
                backgroundColor:
                  index === page ? 'var(--color-brand-olive)' : 'rgba(46,58,40,0.25)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
