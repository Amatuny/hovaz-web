import Link from 'next/link'
import { EventCard } from '@/components/ui/EventCard'
import { buildJournalCards } from '@/lib/journal'
import type { Event, Tour } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'
import { HOME_DEFAULTS, type EventCardLabels } from '@/content/defaults'

interface EventsStripProps {
  tours: Tour[]
  events: Event[]
  texts?: typeof HOME_DEFAULTS.events
  cardLabels?: EventCardLabels
}

export function EventsStrip({
  tours,
  events,
  texts = HOME_DEFAULTS.events,
  cardLabels,
}: EventsStripProps) {
  if (!tours?.length && !events?.length) return null

  const cards = buildJournalCards(tours, events)

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
          {texts.eyebrow}
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
          {texts.heading}
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
          {texts.text}
        </p>

        <DragScroll arrows className="flex gap-4 pb-2 snap-x snap-mandatory">
          {cards.map((card) => (
            <EventCard key={card.key} card={card} variant="strip" labels={cardLabels} />
          ))}
        </DragScroll>

        <div className="mt-8">
          <Link
            href="/events"
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
              {texts.linkText}
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
