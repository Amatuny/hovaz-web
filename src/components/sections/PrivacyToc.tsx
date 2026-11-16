'use client'
// src/components/sections/PrivacyToc.tsx
// Privacy Policy "Contents" list — highlights the section currently in view.
import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  title: string
}

export function PrivacyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    // A section counts as "current" once its top passes the upper ~third of
    // the viewport; the last one to cross wins.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -60% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="Contents" className="lg:sticky lg:top-32">
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
        Contents
      </p>
      <ol className="flex flex-col gap-0.5">
        {items.map((item, i) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => setActive(item.id)}
                className={`flex items-baseline gap-3 rounded-md px-2.5 py-2 transition-colors ${
                  isActive ? 'bg-[#f1ebdc]' : 'hover:bg-[#f1ebdc]/60'
                }`}
                style={{ fontFamily: 'var(--font-hanken)', fontSize: '13px' }}
              >
                <span style={{ fontSize: '10px', color: 'rgba(93,110,82,0.92)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    color: isActive ? '#1a1d17' : '#4f4542',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
