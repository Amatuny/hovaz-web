import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  tourSlugExists,
  getEventBySlug,
  getAllEventSlugs,
  getAllTours,
  getJournalEvents,
  getEventsPage,
} from '@/lib/sanity/queries'
import { currentLocale, resolveEventsContent, seoToMetadata } from '@/lib/sanity/pageContent'
import type { TextSource } from '@/lib/sanity/localize'
import { urlFor } from '@/lib/sanity/image'
import { ExperienceDetail } from '@/components/sections/ExperienceDetail'
import { buildJournalCards } from '@/lib/journal'
import { toExperienceType } from '@/lib/experienceType'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const eventSlugs = await getAllEventSlugs()
  return eventSlugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [event, locale] = await Promise.all([getEventBySlug(slug), currentLocale()])
  if (!event) return {}

  // The event's own SEO fields (Events → SEO tab) win; otherwise title + description
  return seoToMetadata(event.seo as TextSource | undefined, locale, {
    title: event.title,
    description: event.description,
    image: event.mainImage?.asset?._ref
      ? urlFor(event.mainImage).width(1200).height(630).url()
      : undefined,
  })
}

export const revalidate = 3600

function formatBannerDate(startDate?: string) {
  if (!startDate) return null
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} · ${time}`
}

function formatPanelDate(startDate?: string) {
  if (!startDate) return undefined
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day}, ${time}`
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params

  const event = await getEventBySlug(slug)
  if (!event) {
    // Tours (experiences) used to live under /events — keep old links working.
    if (await tourSlugExists(slug)) permanentRedirect(`/experiences/${slug}`)
    notFound()
  }

  const [tours, journalEvents, doc, locale] = await Promise.all([
    getAllTours(),
    getJournalEvents(),
    getEventsPage(),
    currentLocale(),
  ])
  // Fixed texts — Studio → Pages → Events Page
  const t = resolveEventsContent(doc, locale)

  const journalCards = buildJournalCards(tours, journalEvents).filter((card) => card.slug !== slug)

  const gallery = event.gallery ?? []
  const aboutImages = gallery.slice(0, 3)
  const includesImages = gallery.slice(3, 6)

  const typeBadge = event.eventType?.replace(/_/g, ' ')

  const estateBadge = event.estate?.name
    ? `${event.estate.name} ${t.detail.estateSuffix}`.trim()
    : undefined
  const location = event.location ?? t.detail.defaultLocation

  const dateLocationLabel = event.startDate
    ? `${formatBannerDate(event.startDate)} — ${location}`
    : undefined

  return (
    <>
      <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content flex flex-col pt-12 pb-12">
          <ExperienceDetail
            title={event.title}
            estateTagline={event.estate?.tagline ?? event.estate?.name}
            mainImage={event.mainImage}
            estateBadge={estateBadge}
            typeBadge={typeBadge}
            dateLocationLabel={dateLocationLabel}
            description={event.description}
            aboutImages={aboutImages}
            includesHeading={event.includesHeading}
            includesImages={includesImages}
            reservation={{
              experienceType: toExperienceType(event.eventType),
              location,
              duration: event.duration,
              dateTimeLabel: formatPanelDate(event.startDate),
              fixedDate: event.startDate,
              minGuests: 1,
              maxGuests: event.capacity ?? 12,
              // Event's own button text, else Events Page → Reservation Form
              ctaText: event.ctaText,
            }}
            journalCards={journalCards}
            labels={t.detail}
            formLabels={t.form}
            cardLabels={t.cards}
          />
        </div>
      </div>
      <PageTracker
        eventName="experience_viewed"
        parameters={{
          experience_title: event.title,
          experience_type: event.eventType,
        }}
      />
    </>
  )
}
