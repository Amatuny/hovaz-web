'use client'

// Figma footer "Estates" panel (3643:5043): one card per estate (the selected
// one gets a light fill), a live map of the selected estate and a "Get
// directions" pill. Every size is the Figma px × --figma-scale, like the rest
// of the footer, with readable floors for text.
import { useState } from 'react'
import { fs } from '@/lib/figmaScale'
import type { FooterContent } from '@/components/layout/Footer'

type Location = FooterContent['locations'][number]

/** Studio's "Map Location" when set (address or "lat,lng"); otherwise name +
 *  the place part of the detail line: "Founding estate · Dilijan, Tavush" →
 *  "Dilijan Wine Rooms, Dilijan, Tavush, Armenia". */
const mapQuery = (loc: Location) => {
  if (loc.mapQuery) return loc.mapQuery
  const place = loc.detail.split('·').pop()?.trim() ?? ''
  return [loc.name, place, /armenia/i.test(place) ? '' : 'Armenia'].filter(Boolean).join(', ')
}

export function FooterEstates({
  locations,
  heading,
  newBadge,
  directions,
}: {
  locations: Location[]
  heading: string
  newBadge: string
  directions: string
}) {
  const [selected, setSelected] = useState(0)
  const active = locations[selected] ?? locations[0]
  if (!active) return null
  const query = encodeURIComponent(mapQuery(active))

  return (
    <div
      // Hugs its content on desktop (Figma: 902px wide, not the full column)
      className="flex w-full flex-col items-start lg:w-auto lg:self-start"
      style={{
        gap: fs(24),
        padding: fs(24),
        borderRadius: fs(32),
        backgroundColor: 'rgba(242,237,221,0.05)',
      }}
    >
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: fs(11),
          lineHeight: 'normal',
          letterSpacing: fs(2.5),
          color: '#8a9572',
        }}
      >
        {heading}
      </p>

      <div
        // Mobile: the estate cards side by side, the map full width below
        className="flex w-full flex-row flex-wrap lg:flex-nowrap"
        style={{ gap: fs(14) }}
      >
        {locations.map((loc, i) => {
          const isActive = i === selected
          return (
            <button
              key={`${loc.name}-${i}`}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={isActive}
              className="flex min-w-0 flex-1 cursor-pointer flex-col items-start text-left transition-colors hover:bg-[rgba(242,237,221,0.06)] sm:max-w-[220px] lg:w-[calc(var(--figma-scale)*220px)] lg:max-w-none lg:flex-none lg:shrink-0"
              style={{
                gap: fs(6),
                minHeight: fs(200),
                paddingInline: fs(20),
                paddingBlock: fs(18),
                borderRadius: fs(24),
                border: '1px solid rgba(242,237,221,0.24)',
                backgroundColor: isActive ? 'rgba(242,237,221,0.1)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 600,
                  fontSize: fs(18),
                  lineHeight: 'normal',
                  color: '#faf7ee',
                }}
              >
                {loc.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: fs(14),
                  lineHeight: fs(21.7),
                  color: '#beb9aa',
                }}
              >
                {loc.detail}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: fs(13),
                  lineHeight: 'normal',
                  color: '#a8a290',
                }}
              >
                {loc.hours}
              </span>
              {loc.isNew && (
                <span
                  className="rounded-full uppercase"
                  style={{
                    paddingInline: fs(7),
                    paddingBlock: fs(3),
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: fs(9),
                    lineHeight: 'normal',
                    letterSpacing: '1px',
                    color: '#faf7ee',
                    backgroundColor: '#7a2020',
                  }}
                >
                  {newBadge}
                </span>
              )}
            </button>
          )
        })}

        {/* Figma "Iframe": 386×200 map, 24px radius, 1px cream border */}
        <div
          className="w-full basis-full overflow-hidden sm:basis-auto sm:w-[386px] lg:w-[calc(var(--figma-scale)*386px)] lg:shrink-0 lg:basis-auto"
          style={{
            height: fs(200),
            borderRadius: fs(24),
            border: '1px solid #f2eddd',
            backgroundColor: 'rgba(40,44,36,0.24)',
          }}
        >
          <iframe
            key={query}
            title={active.name}
            src={`https://www.google.com/maps?q=${query}&z=14&output=embed`}
            className="block h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-full transition-opacity hover:opacity-85"
        style={{
          paddingInline: fs(22),
          paddingBlock: fs(12),
          fontFamily: 'var(--font-hanken)',
          fontWeight: 600,
          fontSize: fs(14),
          lineHeight: 'normal',
          color: '#1a1d17',
          backgroundColor: '#f2eddd',
        }}
      >
        {directions}
      </a>
    </div>
  )
}
