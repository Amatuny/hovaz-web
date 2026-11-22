import { EventCard } from '@/components/ui/EventCard'
import { buildJournalCards } from '@/lib/journal'
import type { Event, Tour } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'
import { SectionHead } from '@/components/ui/SectionHead'
import { StripEndCard } from '@/components/ui/StripEndCard'
import { TextLink } from '@/components/ui/TextLink'
import { mfig } from '@/lib/figmaScale'
import { HOME_DEFAULTS, type EventCardLabels } from '@/content/defaults'

interface EventsStripProps {
  tours: Tour[]
  events: Event[]
  texts?: typeof HOME_DEFAULTS.events
  cardLabels?: EventCardLabels
}

// Figma "event" (3179:4823): section head (52px Medium title), the event-card
// carousel ending in a "View the full calendar" card, then the text link.
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
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead
          eyebrow={texts.eyebrow}
          title={texts.heading}
          text={texts.text}
          weight="medium"
          titleSize={52}
        />

        <DragScroll arrows className="event-strip flex snap-x snap-mandatory">
          {cards.map((card) => (
            <EventCard key={card.key} card={card} variant="strip" labels={cardLabels} />
          ))}
          <StripEndCard
            href="/events"
            variant="events"
            heading={texts.endHeading}
            button={texts.endButton}
          />
        </DragScroll>

        <TextLink href="/events">{texts.linkText}</TextLink>
      </div>
    </section>
  )
}
