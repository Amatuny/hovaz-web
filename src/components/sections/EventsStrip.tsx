import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Event } from '@/types/sanity'

interface EventsStripProps {
  events: Event[]
}

export function EventsStrip({ events }: EventsStripProps) {
  if (!events?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
              What&apos;s happening
            </p>
            <h2 className="heading-section">Upcoming Events</h2>
          </div>
          <Link href="/events/whats-on" className="btn-ghost hidden md:inline-flex">
            View all events
          </Link>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => {
            const date = event.startDate ? new Date(event.startDate) : null
            const day = date?.toLocaleDateString('en-GB', { day: 'numeric' }) ?? '—'
            const month = date?.toLocaleDateString('en-GB', { month: 'short' }) ?? '—'
            const year = date?.toLocaleDateString('en-GB', { year: 'numeric' }) ?? '—'

            return (
              <Link
                key={event._id}
                href={`/events/${event.slug.current}`}
                className="card-experience group block"
                style={{ backgroundColor: 'var(--color-brand-dark)' }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.mainImage?.asset?._ref ? (
                    <Image
                      src={urlFor(event.mainImage).width(600).height(400).url()}
                      alt={event.mainImage.alt ?? event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                    />
                  )}

                  {/* Date badge */}
                  <div
                    className="absolute top-4 left-4 text-center px-3 py-2"
                    style={{ backgroundColor: 'var(--color-brand-gold)' }}
                  >
                    <p className="font-serif text-2xl text-white leading-none">{day}</p>
                    <p className="font-sans text-xs text-white uppercase tracking-widest">
                      {month}
                    </p>
                  </div>

                  {/* Status badge */}
                  {event.status === 'sold_out' && (
                    <div
                      className="absolute top-4 right-4 px-3 py-1"
                      style={{ backgroundColor: 'rgba(107,31,42,0.9)' }}
                    >
                      <p className="text-label text-white" style={{ fontSize: '0.6rem' }}>
                        Sold Out
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
                    {year} · {event.eventType?.replace(/_/g, ' ')}
                  </p>
                  <h3
                    className="heading-card mb-3 transition-colors group-hover:text-brand-gold"
                    style={{ color: 'white', fontSize: '1.25rem' }}
                  >
                    {event.title}
                  </h3>
                  {event.price && (
                    <p className="text-caption" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      From ${event.price} per person
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/events/whats-on" className="btn-ghost">
            View all events
          </Link>
        </div>
      </div>
    </section>
  )
}
