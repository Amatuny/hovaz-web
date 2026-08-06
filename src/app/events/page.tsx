import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTours, getUpcomingEvents } from '@/lib/sanity/queries'
import { ExperienceCard } from '@/components/ui/ExperienceCard'
import type { Event } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Events & Experiences',
  description:
    'Book a wine tasting, tour or event at HOVAZ Wine Rooms. Guided tastings, wine blending, food pairing and more.',
  openGraph: {
    title: 'Events & Experiences — HOVAZ',
    description: 'Book a wine experience at HOVAZ Wine Rooms.',
    url: 'https://hovazwines.com/events',
  },
}

export const revalidate = 3600

export default async function EventsPage() {
  const [tours, events] = await Promise.all([getAllTours(), getUpcomingEvents()])

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-dark)' }}>
        <div className="container-content text-center">
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
            Booking Hub
          </p>
          <h1
            className="heading-display mb-6"
            style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Events & Experiences
          </h1>
          <p
            className="text-body max-w-prose mx-auto mb-8"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            From intimate guided tastings to immersive harvest experiences — choose your HOVAZ
            moment.
          </p>
          <Link
            href="/events/whats-on"
            className="btn-secondary"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            What&apos;s on this week
          </Link>
        </div>
      </div>

      {/* Experiences grid */}
      <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="section-header-left mb-12">
            <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
              Always available
            </p>
            <h2 className="heading-section">Our Experiences</h2>
          </div>

          {tours.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              Experiences coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <ExperienceCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming events section */}
      {events.length > 0 && (
        <div className="section-padding" style={{ backgroundColor: 'white' }}>
          <div className="container-content">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
                  Scheduled events
                </p>
                <h2 className="heading-section">Upcoming Events</h2>
              </div>
              <Link href="/events/whats-on" className="btn-ghost hidden md:inline-flex">
                See full calendar
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event: Event) => {
                const date = event.startDate ? new Date(event.startDate) : null
                return (
                  <Link
                    key={event._id}
                    href={`/events/${event.slug.current}`}
                    className="card-wine group block overflow-hidden"
                  >
                    <div
                      className="p-6 flex gap-4 items-start"
                      style={{ backgroundColor: 'var(--color-brand-cream)' }}
                    >
                      {/* Date block */}
                      {date && (
                        <div
                          className="text-center px-3 py-2 shrink-0"
                          style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                        >
                          <p className="font-serif text-2xl text-white leading-none">
                            {date.toLocaleDateString('en-GB', { day: 'numeric' })}
                          </p>
                          <p className="text-label text-white" style={{ fontSize: '0.6rem' }}>
                            {date.toLocaleDateString('en-GB', { month: 'short' })}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-label mb-1" style={{ color: 'var(--color-brand-gold)' }}>
                          {event.eventType?.replace(/_/g, ' ')}
                        </p>
                        <h3 className="heading-card" style={{ fontSize: '1.1rem' }}>
                          {event.title}
                        </h3>
                        {event.price && (
                          <p className="text-caption mt-1">From ${event.price} per person</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Group events CTA */}
      <div className="section-padding-sm" style={{ backgroundColor: 'var(--color-brand-blush)' }}>
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
                For groups & agencies
              </p>
              <h2 className="heading-section mb-4">Planning a Group Visit?</h2>
              <p className="text-body mb-6" style={{ color: 'var(--color-brand-stone)' }}>
                We offer bespoke experiences for groups of all sizes — from corporate events to
                private celebrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events/group-events" className="btn-primary">
                  Group Inquiry
                </Link>
                <Link href="/contact/agencies" className="btn-secondary">
                  For Agencies
                </Link>
              </div>
            </div>
            <div className="p-8" style={{ backgroundColor: 'white' }}>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Minimum group', value: '8 guests' },
                  { label: 'Private venue hire', value: 'Available' },
                  { label: 'Custom menus', value: 'On request' },
                  { label: 'Languages', value: 'EN · HY · RU' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-3 divider-cream"
                  >
                    <p className="text-label">{item.label}</p>
                    <p
                      className="font-serif text-lg"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
