import type { Metadata } from 'next'
import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/sanity/queries'
import type { Event } from '@/types/sanity'

export const metadata: Metadata = {
  title: "What's On This Week",
  description: 'Upcoming events and experiences at HOVAZ Wine Rooms.',
}

export const revalidate = 3600

export default async function WhatsOnPage() {
  const events = await getUpcomingEvents()

  // Group events by month
  const eventsByMonth = events.reduce((acc: Record<string, Event[]>, event) => {
    if (!event.startDate) return acc
    const month = new Date(event.startDate).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    })
    if (!acc[month]) acc[month] = []
    acc[month].push(event)
    return acc
  }, {})

  return (
    <>
      {/* Header */}
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <Link href="/events" className="btn-ghost mb-8 inline-flex">
            ← All Experiences
          </Link>
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Calendar
          </p>
          <h1 className="heading-display">What&apos;s On</h1>
        </div>
      </div>

      {/* Events by month */}
      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {Object.keys(eventsByMonth).length === 0 ? (
            <div className="text-center py-20">
              <p
                className="font-serif text-2xl mb-4"
                style={{ color: 'var(--color-brand-burgundy)' }}
              >
                No upcoming events
              </p>
              <p className="text-body mb-8" style={{ color: 'var(--color-brand-stone)' }}>
                Check back soon or browse our regular experiences.
              </p>
              <Link href="/events" className="btn-primary">
                View All Experiences
              </Link>
            </div>
          ) : (
            Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} className="mb-12">
                <p
                  className="text-label mb-6 pb-3 divider-gold"
                  style={{ color: 'var(--color-brand-gold)' }}
                >
                  {month}
                </p>

                <div className="flex flex-col gap-4">
                  {monthEvents.map((event) => {
                    const date = event.startDate ? new Date(event.startDate) : null

                    return (
                      <Link
                        key={event._id}
                        href={`/events/${event.slug.current}`}
                        className="card-wine group flex items-center gap-6 p-6"
                        style={{ backgroundColor: 'var(--color-brand-cream)' }}
                      >
                        {/* Date block */}
                        {date && (
                          <div
                            className="text-center px-4 py-3 shrink-0"
                            style={{
                              backgroundColor: 'var(--color-brand-burgundy)',
                              minWidth: '60px',
                            }}
                          >
                            <p className="font-serif text-2xl text-white leading-none">
                              {date.toLocaleDateString('en-GB', { day: 'numeric' })}
                            </p>
                            <p className="text-label text-white" style={{ fontSize: '0.6rem' }}>
                              {date.toLocaleDateString('en-GB', { month: 'short' })}
                            </p>
                          </div>
                        )}

                        {/* Event info */}
                        <div className="flex-1">
                          <p
                            className="text-label mb-1"
                            style={{ color: 'var(--color-brand-gold)' }}
                          >
                            {event.eventType?.replace(/_/g, ' ')}
                            {event.location && ` · ${event.location}`}
                          </p>
                          <h3 className="heading-card" style={{ fontSize: '1.1rem' }}>
                            {event.title}
                          </h3>
                        </div>

                        {/* Price + status */}
                        <div className="text-right shrink-0">
                          {event.price ? (
                            <p
                              className="font-serif text-xl"
                              style={{ color: 'var(--color-brand-burgundy)' }}
                            >
                              ${event.price}
                            </p>
                          ) : null}
                          {event.status === 'sold_out' ? (
                            <p
                              className="text-label mt-1"
                              style={{ color: '#dc2626', fontSize: '0.6rem' }}
                            >
                              Sold Out
                            </p>
                          ) : (
                            <p
                              className="text-label mt-1 group-hover:text-brand-burgundy transition-colors"
                              style={{ color: 'var(--color-brand-stone)', fontSize: '0.6rem' }}
                            >
                              Reserve →
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
