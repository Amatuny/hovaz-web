import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Event, Tour } from '@/types/sanity'

interface EventsStripProps {
  tours: Tour[]
  events: Event[]
}

// Cycles a small badge palette across whichever estates are attached to the
// content — stable per estate id so the same place always gets the same color.
const ESTATE_BADGE_COLORS = ['var(--color-brand-burgundy)', 'var(--color-brand-forest)']

function estateColor(estateId?: string, fallbackIndex = 0) {
  if (!estateId) return ESTATE_BADGE_COLORS[fallbackIndex % ESTATE_BADGE_COLORS.length]
  let hash = 0
  for (let i = 0; i < estateId.length; i++) hash = (hash * 31 + estateId.charCodeAt(i)) >>> 0
  return ESTATE_BADGE_COLORS[hash % ESTATE_BADGE_COLORS.length]
}

function formatEventDate(startDate?: string) {
  if (!startDate) return null
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} · ${time}`
}

function isEventPast(status?: string, startDate?: string) {
  if (status === 'completed') return true
  return !!startDate && new Date(startDate).getTime() < Date.now()
}

interface JournalCard {
  key: string
  href: string
  title: string
  description?: string
  image?: Event['mainImage']
  estateName?: string
  estateId?: string
  tags?: string[]
  dateLabel?: string | null
  isPast?: boolean
  index: number
}

export function EventsStrip({ tours, events }: EventsStripProps) {
  if (!tours?.length && !events?.length) return null

  const tourCards: JournalCard[] = (tours ?? []).map((tour, index) => ({
    key: `tour-${tour._id}`,
    href: `/events/${tour.slug.current}`,
    title: tour.title,
    description: tour.description,
    image: tour.mainImage,
    estateName: tour.estate?.name,
    estateId: tour.estate?._id,
    tags: tour.tags?.length
      ? tour.tags
      : tour.tourType
        ? [tour.tourType.replace(/_/g, ' ')]
        : undefined,
    dateLabel: null,
    isPast: false,
    index,
  }))

  const eventCards: JournalCard[] = (events ?? []).map((event, index) => ({
    key: `event-${event._id}`,
    href: `/events/${event.slug.current}`,
    title: event.title,
    description: event.description,
    image: event.mainImage,
    estateName: event.estate?.name ?? event.location,
    estateId: event.estate?._id,
    tags: event.tags?.length
      ? event.tags
      : event.eventType
        ? [event.eventType.replace(/_/g, ' ')]
        : undefined,
    dateLabel: formatEventDate(event.startDate),
    isPast: isEventPast(event.status, event.startDate),
    index: tourCards.length + index,
  }))

  const cards = [...tourCards, ...eventCards]

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p
          className="mb-2 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '1.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          Upcoming
        </p>
        <h2
          className="mb-3 capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: '26px',
            color: '#1a1d17',
            letterSpacing: '0.3px',
            lineHeight: 1.15,
          }}
        >
          Discover All Events
        </h2>
        <p
          className="mb-10 max-w-xl"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#4f4542',
          }}
        >
          Small-group tastings and dinners in the cellar and among the vines — see what&apos;s
          coming next, or look back at what we&apos;ve hosted across both estates.
        </p>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cards.map((card) => (
            <JournalCardItem key={card.key} card={card} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/events/whats-on"
            className="group inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', color: '#1a1d17' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              See What&apos;s Coming
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

function JournalCardItem({ card }: { card: JournalCard }) {
  const badgeColor = estateColor(card.estateId, card.index)

  return (
    <Link
      href={card.href}
      className="group relative block shrink-0 snap-start overflow-hidden"
      style={{
        width: '240px',
        height: '300px',
        borderRadius: '18px',
        backgroundColor: 'var(--color-brand-dark)',
      }}
    >
      {/* Image */}
      {card.image?.asset?._ref ? (
        <Image
          src={urlFor(card.image).width(480).height(600).url()}
          alt={card.image.alt ?? card.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="240px"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
        />
      )}

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(26,10,13,0.88) 0%, rgba(26,10,13,0.15) 45%, rgba(26,10,13,0.3) 100%)',
        }}
      />

      {/* Soft glow behind the CTA, revealed on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.16) 25%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Reserve CTA — revealed on hover */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          className="pointer-events-auto inline-flex items-center gap-1.5 whitespace-nowrap bg-[#fdfcf8] text-[#1a1d17] opacity-0 transition-all duration-300 hover:bg-[rgba(63,91,63,0.92)] hover:text-white group-hover:opacity-100"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '0.3px',
            lineHeight: 1,
            padding: '8px 26px',
            borderRadius: '999px',
          }}
        >
          Reserve Your Seat
          <span aria-hidden="true">→</span>
        </span>
      </div>

      {/* Badges */}
      <div className="absolute left-0 top-0 flex flex-col items-start gap-1.5 p-3">
        {card.estateName && (
          <span
            className="px-2.5 py-1 uppercase"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '9px',
              letterSpacing: '1px',
              color: 'white',
              backgroundColor: badgeColor,
              borderRadius: '999px',
            }}
          >
            {card.estateName}
          </span>
        )}
        {card.isPast && (
          <span
            className="px-2.5 py-1 uppercase"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '9px',
              letterSpacing: '1px',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '999px',
            }}
          >
            Past Event
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3
          className="mb-1.5 text-white"
          style={{ fontFamily: 'var(--font-playfair)', fontWeight: 600, fontSize: '1.15rem' }}
        >
          {card.title}
        </h3>

        {card.description && (
          <p
            className="mb-3 overflow-hidden text-white/75 line-clamp-2 transition-all duration-300 group-hover:mb-0 group-hover:max-h-0 group-hover:opacity-0"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '12px',
              lineHeight: 1.6,
              maxHeight: '2.6em',
            }}
          >
            {card.description}
          </p>
        )}

        {card.tags && card.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 uppercase"
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: 'white',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {card.dateLabel && (
          <p
            className="mt-1 text-white/55"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: '10px', letterSpacing: '0.15em' }}
          >
            {card.dateLabel}
          </p>
        )}
      </div>
    </Link>
  )
}
