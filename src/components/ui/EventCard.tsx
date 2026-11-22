// src/components/ui/EventCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/types/sanity'
import { EVENTS_DEFAULTS, type EventCardLabels } from '@/content/defaults'

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
  // 'grid' (default): fixed 320×400 card (handoff §4) for the /events grid.
  // 'strip': fixed 240×300 card for the homepage's horizontal-scroll strip —
  // sized at a flat 0.75× of the grid's raw Figma numbers (240/320 = 0.75),
  // not responsive, since it's a fixed-size card regardless of viewport.
  variant?: 'grid' | 'strip'
  /** From Events Page → Event Cards; built-in labels when omitted */
  labels?: EventCardLabels
}

// Cycles a small badge palette across whichever estates/locations are attached
// to the card — stable per key so the same place always gets the same color.
// Figma "Tag/Forest" badges: deep red #4a0000 and forest #2e3a28
const BADGE_COLORS = ['#4a0000', '#2e3a28']

function badgeColor(key?: string) {
  if (!key) return BADGE_COLORS[0]
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return BADGE_COLORS[hash % BADGE_COLORS.length]
}

export function EventCard({
  card,
  variant = 'grid',
  labels = EVENTS_DEFAULTS.card,
}: EventCardProps) {
  const isStrip = variant === 'strip'
  // The card is a size container and always 320:400. Every inner value is
  // the Figma px (designed at 320 wide) scaled to the card's actual width —
  // 100cqw here is the card's own width — so it's the same card at any size.
  // Strip: width comes from --card-w (.event-strip). Grid: fills its grid
  // cell / wrapper (.event-grid sets the column width).
  const size = (px: number) => `calc(100cqw * ${+(px / 320).toFixed(5)})`

  const tags = card.tags?.length ? card.tags.slice(0, 3) : []

  return (
    <article
      className={`group relative overflow-hidden [container-type:inline-size] ${isStrip ? 'shrink-0 snap-start' : 'w-full'}`}
      style={
        isStrip
          ? {
              width: 'var(--card-w)',
              aspectRatio: '320 / 400',
              borderRadius: 'calc(var(--card-w) * 0.075)',
            }
          : { aspectRatio: '320 / 400', borderRadius: 'max(16px, calc(var(--figma-scale) * 24px))' }
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
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.115] group-focus-within:scale-[1.115]"
            sizes="(min-width: 1200px) 22vw, (min-width: 640px) 40vw, 90vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
          />
        )}
      </div>

      {/* Figma hover: the photo drops to 70% over the card's white fill,
          i.e. a 30% white wash */}
      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-30 group-focus-within:opacity-30" />

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
          aria-label={`${labels.reserve}: ${card.title}`}
          // Figma hover button: #fdfcf8 pill, radius 60, 10/32 padding,
          // Hanken Grotesk SemiBold 14px in #1f281b, scaled with the card.
          className="pointer-events-auto inline-flex items-center whitespace-nowrap rounded-full bg-[#fdfcf8] text-[#1f281b] opacity-0 transition-[opacity,background-color,color] duration-200 ease-out hover:bg-[#2e3a28] hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
          style={{
            paddingInline: size(32),
            paddingBlock: size(10),
            gap: size(8),
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: size(14),
            lineHeight: 1.3,
          }}
        >
          {labels.reserve}
        </Link>
      </div>

      {/* Badges */}
      <div
        className="absolute flex flex-col items-start"
        style={{ left: size(24), top: size(24), gap: size(8) }}
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
              backgroundColor: '#4f4542',
            }}
          >
            {labels.pastEvent}
          </span>
        )}
      </div>

      {/* Content — title stays put (never hides); only the description
          collapses on hover. Since the title has no bottom margin of its own
          and sits right above the description, collapsing the description's
          margin/height naturally slides the title down into its spot. */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{ padding: size(24), gap: size(8) }}
      >
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
            className="line-clamp-2 max-h-[2.6em] overflow-hidden capitalize text-white transition-all duration-300 group-hover:max-h-0 group-hover:opacity-0"
            style={
              {
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
          <div className="flex flex-wrap" style={{ gap: size(6) }}>
            {tags.map((tag) => (
              <span
                key={tag}
                // Figma tag pill: radius 999, padding 5/11
                className="inline-flex items-center rounded-full uppercase"
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
