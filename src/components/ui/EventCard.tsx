// src/components/ui/EventCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import type { SanityImage } from '@/types/sanity'

// Shared by the /events grid and the homepage's horizontal "journal" strip —
// one component, one hover implementation, so a fix here applies everywhere.
// Only the "Reserve Your Seat" button links to the event; the card itself isn't clickable.
export interface EventCardData {
  href: string
  title: string
  description?: string
  image?: SanityImage
  badgeLabel?: string
  badgeKey?: string
  isPast?: boolean
  tags?: string[]
  dateLabel?: string | null
}

interface EventCardProps {
  card: EventCardData
  // 'grid' (default): fluid 320:400 card sized off --figma-scale, used in the
  // /events page's responsive grid.
  // 'strip': fixed 240×300 card for the homepage's horizontal-scroll strip —
  // sized at a flat 0.75× of the grid's raw Figma numbers (240/320 = 0.75),
  // not responsive, since it's a fixed-size card regardless of viewport.
  variant?: 'grid' | 'strip'
}

const STRIP_SCALE = 0.75

// Cycles a small badge palette across whichever estates/locations are attached
// to the card — stable per key so the same place always gets the same color.
const BADGE_COLORS = ['var(--color-brand-burgundy)', 'var(--color-brand-forest)']

function badgeColor(key?: string) {
  if (!key) return BADGE_COLORS[0]
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

export function EventCard({ card, variant = 'grid' }: EventCardProps) {
  const isStrip = variant === 'strip'
  // calc(var(--figma-scale) * Npx) for grid, flat "Npx" for strip.
  const size = (px: number) => (isStrip ? `${px * STRIP_SCALE}px` : fig(px))

  const tags = card.tags?.length ? card.tags.slice(0, 3) : []

  return (
    <article
      className={`group relative overflow-hidden ${isStrip ? 'shrink-0 snap-start' : 'w-full'}`}
      style={
        isStrip
          ? { width: '240px', height: '300px', borderRadius: '18px' }
          : { aspectRatio: '320 / 400', borderRadius: '24px' }
      }
    >
      {/* Photo */}
      <div className="absolute inset-0">
        {card.image?.asset?._ref ? (
          <Image
            src={urlFor(card.image)
              .width(isStrip ? 480 : 640)
              .height(isStrip ? 600 : 800)
              .url()}
            alt={card.image.alt ?? card.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-focus-within:scale-110"
            sizes={isStrip ? '240px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
          />
        )}
      </div>

      {/* Soft white wash over the photo on hover — same effect as NewsCard */}
      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-700 group-hover:opacity-35 group-focus-within:opacity-35" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,1) 100%)',
        }}
      />

      {/* Reserve CTA — revealed on hover */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Link
          href={card.href}
          aria-label={`Reserve your seat: ${card.title}`}
          // Fixed, not scaled by `size()`: this CTA isn't in the Figma design
          // at all (the card component has no button in its node tree), and
          // scaling its padding with the viewport made it overflow the card
          // at breakpoints where the grid packs 3-4 narrower columns — a
          // small fixed pill stays comfortable at any card width.
          className="pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap bg-[#fdfcf8] px-5 py-2 text-[#1a1d17] opacity-0 transition-all duration-300 hover:bg-[rgba(63,91,63,0.92)] hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.3px',
            lineHeight: 1,
            borderRadius: '999px',
          }}
        >
          Reserve Your Seat
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Badges */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: size(24), top: size(24), gap: size(6) }}
      >
        {card.badgeLabel && (
          <span
            className="rounded-full uppercase text-white"
            style={{
              paddingInline: size(14),
              paddingBlock: size(6),
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: size(10),
              letterSpacing: size(1.2),
              backgroundColor: badgeColor(card.badgeKey ?? card.badgeLabel),
            }}
          >
            {card.badgeLabel}
          </span>
        )}
        {card.isPast && (
          <span
            className="rounded-full uppercase text-white"
            style={{
              paddingInline: size(14),
              paddingBlock: size(6),
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: size(10),
              letterSpacing: size(1.2),
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            Past Event
          </span>
        )}
      </div>

      {/* Content — title stays put (never hides); only the description
          collapses on hover. Since the title has no bottom margin of its own
          and sits right above the description, collapsing the description's
          margin/height naturally slides the title down into its spot. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col" style={{ padding: size(24) }}>
        <p
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: size(19),
            letterSpacing: size(1.3),
            lineHeight: size(24.7),
            color: '#fdfcf8',
          }}
        >
          {card.title}
        </p>

        {card.description && (
          <p
            // marginTop/maxHeight must be Tailwind classes (not inline style):
            // an inline style always wins the cascade over a class, so
            // `group-hover:mt-0`/`max-h-0` could never override them there —
            // the description would never actually collapse.
            className="line-clamp-2 mt-[var(--desc-mt)] max-h-[2.6em] overflow-hidden capitalize text-white transition-all duration-300 group-hover:mt-0 group-hover:max-h-0 group-hover:opacity-0"
            style={
              {
                '--desc-mt': size(8),
                fontFamily: 'var(--font-hanken)',
                fontWeight: 400,
                fontSize: size(12),
              } as React.CSSProperties
            }
          >
            {card.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: size(6), paddingTop: size(2) }}>
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full uppercase"
                style={{
                  paddingInline: size(11),
                  paddingBlock: size(5),
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: size(9),
                  letterSpacing: size(0.8),
                  color: '#fdfcf8',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {card.dateLabel && (
          <p
            className="uppercase"
            style={{
              paddingTop: size(2),
              fontFamily: 'var(--font-hanken)',
              fontWeight: 500,
              fontSize: size(12),
              letterSpacing: size(0.5),
              color: '#d4d0c0',
            }}
          >
            {card.dateLabel}
          </p>
        )}
      </div>
    </article>
  )
}
