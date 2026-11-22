import { SectionDivider } from '@/components/ui/SectionDivider'
import type { Metadata } from 'next'
import {
  getAllEstates,
  getAllEventsForListing,
  getEventsPage,
  getTestimonials,
} from '@/lib/sanity/queries'
import { EventsFilterGrid } from '@/components/sections/EventsFilterGrid'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { fig } from '@/lib/figmaScale'
import { EVENTS_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveEventsContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts and SEO are edited in Studio → Pages → Events Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getEventsPage(), currentLocale()])
  return seoToMetadata(doc?.seo, locale, {
    title: EVENTS_DEFAULTS.seo.metaTitle,
    description: EVENTS_DEFAULTS.seo.metaDescription,
    url: 'https://hovazwines.com/events',
  })
}

export const revalidate = 3600

interface SectionHeaderProps {
  as?: 'h1' | 'h2'
  eyebrow?: string
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
      {eyebrow && (
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
      )}
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
  const [events, testimonials, estates, doc, locale] = await Promise.all([
    getAllEventsForListing(),
    getTestimonials(),
    getAllEstates(),
    getEventsPage(),
    currentLocale(),
  ])
  const t = resolveEventsContent(doc, locale)

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content page-main">
        <div className="flex flex-col gap-12 lg:gap-[82px]">
          {/* Figma "Frame 200": page title, then the search intro 36px below */}
          <div className="flex flex-col" style={{ gap: fig(36) }}>
            <SectionHeader
              as="h1"
              eyebrow={t.list.eyebrow}
              heading={t.list.heading}
              paragraph={t.list.text}
            />
            <SectionHeader
              heading={t.list.searchHeading}
              headingSize={32}
              paragraph={t.list.searchText}
            />
          </div>

          {events.length === 0 ? (
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '12px',
                color: 'var(--color-brand-stone)',
              }}
            >
              {t.list.empty}
            </p>
          ) : (
            <EventsFilterGrid
              events={events}
              estateNames={estates.map((estate) => estate.name)}
              labels={t.filters}
              cardLabels={t.cards}
            />
          )}
        </div>

        {/* Divider (Figma "symbol" with the vine art, 677px) */}
        <SectionDivider variant="vine" />

        {/* Reviews */}
        {testimonials.length > 0 && (
          <>
            <div className="flex flex-col gap-12 lg:gap-[82px]">
              <SectionHeader
                eyebrow={t.reviews.eyebrow}
                heading={t.reviews.heading}
                headingSize={52}
              />

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                style={{ gap: fig(32) }}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                ))}
              </div>
            </div>

            <SectionDivider variant="symbol" />
          </>
        )}
      </div>
    </div>
  )
}
