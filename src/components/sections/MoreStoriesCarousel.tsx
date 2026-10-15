// src/components/sections/MoreStoriesCarousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { fig } from '@/lib/figmaScale'
import { DragScroll } from '@/components/ui/DragScroll'
import { NewsCard } from '@/components/ui/NewsCard'
import type { NewsItem } from '@/types/sanity'

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
          <NewsCard key={item._id} item={item} />
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
