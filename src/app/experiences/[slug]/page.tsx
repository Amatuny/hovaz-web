import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTourBySlug, getAllTourSlugs, getAllTours, getJournalEvents } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { TourExperienceDetail } from '@/components/sections/TourExperienceDetail'
import { buildJournalCards } from '@/lib/journal'
import { toExperienceType } from '@/lib/experienceType'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  if (!tour) return {}

  return {
    title: tour.seo?.metaTitle ?? tour.title,
    description: tour.seo?.metaDescription ?? tour.description,
    openGraph: {
      title: `${tour.title} — HOVAZ`,
      description: tour.description ?? '',
      url: `https://hovazwines.com/experiences/${slug}`,
      images: tour.mainImage?.asset?._ref
        ? [urlFor(tour.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export const revalidate = 3600

export default async function TourExperiencePage({ params }: Props) {
  const { slug } = await params

  const tour = await getTourBySlug(slug)
  if (!tour) notFound()

  const [tours, journalEvents] = await Promise.all([getAllTours(), getJournalEvents()])

  // The booking form lets guests switch between this estate's experiences,
  // with the current one preselected.
  const estateTours = tours.filter((t) => t.estate?._id === tour.estate?._id)
  const bookingTours = estateTours.some((t) => t._id === tour._id)
    ? estateTours
    : [tour, ...estateTours]
  const bookingOptions = bookingTours.map((t) => ({
    value: t._id,
    label: t.title,
    experienceType: toExperienceType(t.tourType),
  }))

  const journalCards = buildJournalCards(tours, journalEvents).filter((card) => card.slug !== slug)
  const typeBadge = tour.tags?.[0] ?? tour.tourType?.replace(/_/g, ' ')

  return (
    <>
      <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content flex flex-col pt-12 pb-12">
          <TourExperienceDetail
            tour={tour}
            typeBadge={typeBadge}
            bookingOptions={bookingOptions}
            journalCards={journalCards}
          />
        </div>
      </div>
      <PageTracker
        eventName="experience_viewed"
        parameters={{
          experience_title: tour.title,
          experience_type: tour.tourType,
        }}
      />
    </>
  )
}
