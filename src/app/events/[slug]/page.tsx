import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getTourBySlug,
  getEventBySlug,
  getAllTourSlugs,
  getAllEventSlugs,
} from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { BookingForm } from '@/components/ui/BookingForm'
import type { BookingInput } from '@/lib/validations/booking'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const [tourSlugs, eventSlugs] = await Promise.all([getAllTourSlugs(), getAllEventSlugs()])
  return [...tourSlugs.map(({ slug }) => ({ slug })), ...eventSlugs.map(({ slug }) => ({ slug }))]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tour = await getTourBySlug(slug)
  const content = tour ?? (await getEventBySlug(slug))
  if (!content) return {}

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: `${content.title} — HOVAZ`,
      description: content.description ?? '',
      images: content.mainImage?.asset?._ref
        ? [urlFor(content.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export const revalidate = 3600

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params

  // Try tour first, then event
  const tour = await getTourBySlug(slug)
  const event = tour ? null : await getEventBySlug(slug)
  const content = tour ?? event

  if (!content) notFound()

  const isTour = !!tour
  const isEvent = !!event

  // Format event date
  const eventDate = isEvent && event?.startDate ? new Date(event.startDate) : null

  const experienceTypeMap: Record<string, BookingInput['experienceType']> = {
    wine_tasting: 'wine_tasting',
    vineyard_walk: 'vineyard_walk',
    private_tour: 'private_tour',
    group_tour: 'group_tour',
    winemaking_experience: 'winemaking_experience',
    harvest_experience: 'harvest_experience',
    wine_dinner: 'wine_dinner',
  }

  const mappedExperienceType =
    isTour && tour?.tourType ? (experienceTypeMap[tour.tourType] ?? 'custom') : 'custom'

  return (
    <>
      {/* Hero */}
      <div
        className="relative pt-24 overflow-hidden"
        style={{ minHeight: '60vh', backgroundColor: 'var(--color-brand-dark)' }}
      >
        {content.mainImage?.asset?._ref && (
          <>
            <Image
              src={urlFor(content.mainImage).width(1920).height(1080).url()}
              alt={content.mainImage.alt ?? content.title}
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
            />
            <div className="hero-overlay" />
          </>
        )}

        <div className="container-content relative z-10 py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/events"
              className="text-caption transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Events & Experiences
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span className="text-caption" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {content.title}
            </span>
          </div>

          <div className="max-w-2xl">
            {/* Event date badge */}
            {eventDate && (
              <div
                className="inline-flex items-center gap-3 px-4 py-2 mb-6"
                style={{ backgroundColor: 'var(--color-brand-gold)' }}
              >
                <p className="text-label text-white">
                  {eventDate.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}

            {isTour && tour?.tourType && (
              <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
                {tour.tourType.replace(/_/g, ' ')}
              </p>
            )}

            <h1
              className="heading-display mb-6"
              style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {content.title}
            </h1>

            {content.description && (
              <p className="text-body text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {content.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left — details */}
            <div className="lg:col-span-2">
              {/* Tour specifics */}
              {isTour && tour && (
                <>
                  {/* Included services */}
                  {tour.includedServices && tour.includedServices.length > 0 && (
                    <div className="mb-10">
                      <p className="text-label mb-5" style={{ color: 'var(--color-brand-gold)' }}>
                        What&apos;s Included
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tour.includedServices.map((service) => (
                          <div
                            key={service}
                            className="flex items-center gap-3 p-4"
                            style={{ backgroundColor: 'white' }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: 'var(--color-brand-gold)' }}
                            />
                            <p className="text-body" style={{ fontSize: '0.9rem' }}>
                              {service}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Event specifics */}
              {isEvent && event && (
                <div className="mb-10">
                  <div className="grid grid-cols-2 gap-4 p-6" style={{ backgroundColor: 'white' }}>
                    {event.location && (
                      <div>
                        <p className="text-label mb-1">Location</p>
                        <p className="text-body" style={{ fontSize: '0.9rem' }}>
                          {event.location}
                        </p>
                      </div>
                    )}
                    {event.capacity && (
                      <div>
                        <p className="text-label mb-1">Capacity</p>
                        <p className="text-body" style={{ fontSize: '0.9rem' }}>
                          {event.capacity} guests
                        </p>
                      </div>
                    )}
                    {eventDate && (
                      <div>
                        <p className="text-label mb-1">Date</p>
                        <p className="text-body" style={{ fontSize: '0.9rem' }}>
                          {eventDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {event.priceNote && (
                      <div>
                        <p className="text-label mb-1">Includes</p>
                        <p className="text-body" style={{ fontSize: '0.9rem' }}>
                          {event.priceNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {content.gallery && content.gallery.length > 0 && (
                <div>
                  <p className="text-label mb-6" style={{ color: 'var(--color-brand-gold)' }}>
                    Gallery
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {content.gallery
                      .filter((img) => img?.asset?._ref)
                      .map((img, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden"
                          style={{ aspectRatio: '4/3' }}
                        >
                          <Image
                            src={urlFor(img).width(600).height(450).url()}
                            alt={img.alt ?? `${content.title} image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — inline booking form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingForm
                  experienceTitle={content.title}
                  experienceType={mappedExperienceType}
                  pricePerPerson={isTour ? tour?.pricePerPerson : event?.price}
                  priceNote={isTour ? tour?.priceNote : undefined}
                  duration={isTour ? tour?.duration : undefined}
                  minGroupSize={isTour ? tour?.minGroupSize : undefined}
                  maxGroupSize={isTour ? tour?.maxGroupSize : undefined}
                  privateAvailable={isTour ? tour?.privateAvailable : undefined}
                  ctaText={
                    isTour
                      ? (tour?.ctaText ?? 'Book This Experience')
                      : (event?.ctaText ?? 'Reserve Your Spot')
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PageTracker
        eventName="experience_viewed"
        parameters={{
          experience_title: content.title,
          experience_type: isTour ? tour?.tourType : event?.eventType,
        }}
      />
    </>
  )
}
