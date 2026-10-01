import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllEventsForListing, getTestimonials } from '@/lib/sanity/queries'
import { EventsFilterGrid } from '@/components/sections/EventsFilterGrid'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { fig } from '@/lib/figmaScale'

export const metadata: Metadata = {
  title: 'Evenings Worth The Drive',
  description:
    'Tastings, dinners, and cellar evenings across our two HOVAZ estates — browse and book upcoming events.',
  openGraph: {
    title: 'Events — HOVAZ',
    description: 'Browse and book upcoming HOVAZ wine events.',
    url: 'https://hovazwines.com/events',
  },
}

export const revalidate = 3600

interface SectionHeaderProps {
  as?: 'h1' | 'h2'
  eyebrow: string
  heading: string
  headingSize?: number
  paragraph?: string
}

function SectionHeader({
  as: Heading = 'h2',
  eyebrow,
  heading,
  headingSize = 44,
  paragraph,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col" style={{ maxWidth: fig(860), gap: fig(16) }}>
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: fig(12),
          letterSpacing: fig(3),
          color: 'rgba(93,110,82,0.92)',
        }}
      >
        {eyebrow}
      </p>
      <Heading
        className="capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 500, // Figma: Playfair Display "Medium"
          fontSize: fig(headingSize),
          color: '#1a1d17',
          letterSpacing: fig(2),
          lineHeight: 1.15,
        }}
      >
        {heading}
      </Heading>
      {paragraph && (
        <p
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: fig(18),
            lineHeight: fig(29.7),
            color: '#4f4542',
          }}
        >
          {paragraph}
        </p>
      )}
    </div>
  )
}

export default async function EventsPage() {
  const [events, testimonials] = await Promise.all([getAllEventsForListing(), getTestimonials()])

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div
        className="container-content flex flex-col"
        style={{ paddingTop: fig(48), paddingBottom: fig(48), gap: fig(82) }}
      >
        <div className="flex flex-col" style={{ gap: fig(82) }}>
          <SectionHeader
            as="h1"
            eyebrow="Events"
            heading="Evenings Worth The Drive"
            paragraph="Tastings, dinners, and cellar evenings across our two estates. From crisp whites picked at first light to reds aged slow in old oak — each wine carries the same terraces, the same hands, the same patience."
          />

          {events.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '12px',
                color: 'var(--color-brand-stone)',
              }}
            >
              No events scheduled right now — check back soon.
            </p>
          ) : (
            <EventsFilterGrid events={events} />
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center overflow-hidden">
          <Image
            src="/wines/vine-divider.svg"
            alt=""
            width={677}
            height={78}
            className="h-auto w-full"
            style={{ maxWidth: fig(420) }}
          />
        </div>

        {/* Reviews */}
        {testimonials.length > 0 && (
          <>
            <div className="flex flex-col" style={{ gap: fig(82) }}>
              <SectionHeader eyebrow="Reviews" heading="What Guests Are Saying" headingSize={52} />

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                style={{ gap: fig(32) }}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center overflow-hidden">
              <Image
                src="/wines/collection-symbol.svg"
                alt=""
                width={667}
                height={83}
                className="h-auto w-full"
                style={{ maxWidth: fig(380) }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
