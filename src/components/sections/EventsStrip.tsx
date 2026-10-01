import Link from 'next/link'
import { EventCard } from '@/components/ui/EventCard'
import { buildJournalCards } from '@/lib/journal'
import type { Event, Tour } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'

interface EventsStripProps {
  tours: Tour[]
  events: Event[]
}

export function EventsStrip({ tours, events }: EventsStripProps) {
  if (!tours?.length && !events?.length) return null

  const cards = buildJournalCards(tours, events)

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

        <DragScroll className="flex gap-4 pb-2 snap-x snap-mandatory">
          {cards.map((card) => (
            <EventCard key={card.key} card={card} variant="strip" />
          ))}
        </DragScroll>

        <div className="mt-8">
          <Link
            href="/events"
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
