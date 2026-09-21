// src/app/wines/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getWineBySlug, getAllWineSlugs, getOtherWines } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { WineCard } from '@/components/ui/WineCard'
import { JsonLd } from '@/components/sanity/JsonLd'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllWineSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const wine = await getWineBySlug(slug)
  if (!wine) return {}

  return {
    title: `${wine.name} ${wine.vintage ?? ''}`.trim(),
    description: wine.description ?? wine.tastingNotes,
    openGraph: {
      title: `${wine.name} — HOVAZ`,
      description: wine.description ?? '',
      images: wine.mainImage?.asset?._ref
        ? [urlFor(wine.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export const revalidate = 3600

const styleLabels: Record<string, string> = {
  red: 'Red, Dry',
  white: 'White, Dry',
  rose: 'Rosé, Dry',
  sparkling: 'White, Sparkling',
  orange: 'Orange, Dry',
  dessert: 'Dessert, Sweet',
}

function formatEventDateTime(startDate?: string) {
  if (!startDate) return undefined
  const d = new Date(startDate)
  if (Number.isNaN(d.getTime())) return undefined
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}

function MetaField({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 700,
          fontSize: '9px',
          letterSpacing: '0.8px',
          color: '#a8a272',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 500,
          fontSize: '13px',
          color: '#1a1d16',
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default async function WineDetailPage({ params }: Props) {
  const { slug } = await params
  const wine = await getWineBySlug(slug)
  if (!wine) notFound()

  const otherWines = await getOtherWines(slug)
  const styleLabel = wine.wineType ? styleLabels[wine.wineType] : undefined
  const upcomingEvents = (wine.relatedEvents ?? [])
    .filter((event) => event.status === 'upcoming')
    .slice(0, 3)
  const [storyImage, storyImageA, storyImageB] = wine.gallery ?? []
  const hasGrapeSection = Boolean(storyImage || wine.grapeStoryText || wine.howWeDecidedText)

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col gap-14 pt-8 pb-16 lg:gap-16">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2"
          style={{ fontFamily: 'var(--font-hanken)', fontSize: '12px', color: '#79726d' }}
        >
          <Link href="/wines" className="hover:underline">
            Wines
          </Link>
          <span>/</span>
          <span style={{ color: '#2e3a28' }}>{wine.name}</span>
        </nav>

        {/* Hero */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div
            className="relative overflow-hidden rounded-[20px]"
            style={{ aspectRatio: '512 / 811', backgroundColor: '#f2eddd' }}
          >
            {wine.mainImage?.asset?._ref ? (
              <Image
                src={urlFor(wine.mainImage).width(1024).height(1622).url()}
                alt={wine.mainImage.alt ?? wine.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-64 w-32 rounded-sm"
                  style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {wine.award && (
                <span
                  className="inline-flex w-fit items-center rounded-full px-3.5 py-1.5"
                  style={{ backgroundColor: '#8e6711' }}
                >
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 700,
                      fontSize: '9px',
                      letterSpacing: '0.8px',
                      color: '#fdfcf8',
                    }}
                  >
                    {wine.award}
                  </span>
                </span>
              )}

              <h1
                className="capitalize"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 600,
                  fontSize: '32px',
                  letterSpacing: '0.4px',
                  color: '#1a1d17',
                }}
              >
                {wine.name}
              </h1>

              {(wine.tastingNotes || wine.description) && (
                <p
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: '#4f4542',
                  }}
                >
                  {wine.tastingNotes ?? wine.description}
                </p>
              )}
            </div>

            {(Boolean(wine.pairWith?.length) || Boolean(wine.perfectFor?.length)) && (
              <div
                className="flex flex-col gap-1"
                style={{ fontFamily: 'var(--font-hanken)', fontSize: '13px', color: '#2e3a28' }}
              >
                {wine.pairWith?.length ? (
                  <p>
                    <span style={{ fontWeight: 600, fontStyle: 'italic' }}>PAIR WITH </span>
                    <span style={{ fontWeight: 400, fontStyle: 'italic' }}>
                      {wine.pairWith.join(' · ')}
                    </span>
                  </p>
                ) : null}
                {wine.perfectFor?.length ? (
                  <p>
                    <span style={{ fontWeight: 600, fontStyle: 'italic' }}>PERFECT FOR — </span>
                    <span style={{ fontWeight: 400, fontStyle: 'italic' }}>
                      {wine.perfectFor.join(' · ')}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            <div
              className="grid grid-cols-2 gap-x-4 gap-y-3 border-y py-4"
              style={{ borderColor: 'rgba(26,29,23,0.1)' }}
            >
              <MetaField label="Aging" value={wine.agingNotes} />
              <MetaField label="Bottle Size" value={wine.bottleSize} />
              <MetaField label="Vintage" value={wine.vintage?.toString()} />
              <MetaField label="Region" value={wine.region} />
              <MetaField label="Varietal" value={wine.grapeVariety} />
              <MetaField label="Style" value={styleLabel} />
            </div>

            {upcomingEvents.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <p
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: 600,
                      fontSize: '10px',
                      letterSpacing: '2px',
                      color: 'rgba(93,110,82,0.92)',
                    }}
                  >
                    Taste It At
                  </p>
                  <h2
                    className="capitalize"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: '22px',
                      letterSpacing: '0.3px',
                      color: '#1a1d17',
                      lineHeight: 1.15,
                    }}
                  >
                    Upcoming events pouring this wine
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  {upcomingEvents.map((event) => {
                    const when = formatEventDateTime(event.startDate)
                    return (
                      <Link
                        key={event._id}
                        href={`/events/${event.slug.current}`}
                        className="flex items-center justify-between gap-4 rounded-[24px] bg-white px-6 py-4"
                      >
                        <div className="flex flex-col gap-1">
                          <p
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontWeight: 500,
                              fontSize: '15px',
                              color: '#1a1d17',
                            }}
                          >
                            {event.title}
                          </p>
                          {event.location && (
                            <p
                              style={{
                                fontFamily: 'var(--font-hanken)',
                                fontSize: '12px',
                                color: '#4f4542',
                              }}
                            >
                              {event.location}
                            </p>
                          )}
                        </div>
                        {when && (
                          <p
                            className="shrink-0 uppercase"
                            style={{
                              fontFamily: 'var(--font-hanken)',
                              fontWeight: 500,
                              fontSize: '11px',
                              letterSpacing: '0.5px',
                              color: '#3d4a38',
                            }}
                          >
                            {when}
                          </p>
                        )}
                      </Link>
                    )
                  })}
                </div>

                <Link
                  href={`/events/${upcomingEvents[0].slug.current}`}
                  className="inline-flex items-center justify-center rounded-full px-10 py-3 text-center"
                  style={{ backgroundColor: '#2e3a28' }}
                >
                  <span
                    className="capitalize text-white"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 600,
                      fontSize: '13px',
                      letterSpacing: '1.5px',
                    }}
                  >
                    Reserve Your Seat
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center overflow-hidden">
          <Image
            src="/wines/vine-divider.svg"
            alt=""
            width={677}
            height={78}
            className="h-auto w-full max-w-[420px]"
          />
        </div>

        {wine.storyIntro && (
          <p
            className="mx-auto max-w-[720px] text-center"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '13px',
              lineHeight: 1.65,
              color: '#79726d',
            }}
          >
            {wine.storyIntro}
          </p>
        )}

        {hasGrapeSection && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-[260px_180px_210px]">
            <div className="relative overflow-hidden rounded-[24px] lg:col-span-2 lg:row-span-2">
              {storyImage?.asset?._ref && (
                <Image
                  src={urlFor(storyImage).width(1000).height(1000).url()}
                  alt={storyImage.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(18,8,5,0.75) 0%, rgba(18,8,5,0) 55%)',
                }}
              />
            </div>

            {wine.grapeStoryText && (
              <div
                className="flex flex-col justify-center gap-3 rounded-[24px] p-8 lg:col-span-2"
                style={{ backgroundColor: '#231814' }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '2px',
                    color: '#e5987d',
                  }}
                >
                  The Grape
                </p>
                {wine.grapeVariety && (
                  <p
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: '24px',
                      color: '#f1eeeb',
                    }}
                  >
                    {wine.grapeVariety}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: '#f1eeeb',
                  }}
                >
                  {wine.grapeStoryText}
                </p>
              </div>
            )}

            {storyImageA?.asset?._ref && (
              <div className="relative overflow-hidden rounded-[24px] lg:col-start-3 lg:row-start-2">
                <Image
                  src={urlFor(storyImageA).width(600).height(600).url()}
                  alt={storyImageA.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            )}

            {wine.howWeDecidedText && (
              <div
                className="flex flex-col justify-center gap-3 rounded-[24px] p-8 lg:col-span-4 lg:row-start-3"
                style={{ backgroundColor: '#231814' }}
              >
                <p
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '2px',
                    color: '#e5987d',
                  }}
                >
                  How We Decided
                </p>
                {wine.howWeDecidedTitle && (
                  <p
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: '24px',
                      color: '#f1eeeb',
                    }}
                  >
                    {wine.howWeDecidedTitle}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: '#f1eeeb',
                  }}
                >
                  {wine.howWeDecidedText}
                </p>
              </div>
            )}

            {storyImageB?.asset?._ref && (
              <div className="relative overflow-hidden rounded-[24px] lg:col-start-4 lg:row-start-2">
                <Image
                  src={urlFor(storyImageB).width(600).height(600).url()}
                  alt={storyImageB.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            )}
          </div>
        )}

        {Boolean(wine.storyOutro?.length) && (
          <div
            className="mx-auto flex max-w-[720px] flex-col gap-4 text-center"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '13px',
              lineHeight: 1.65,
              color: '#79726d',
            }}
          >
            {wine.storyOutro?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {/* Wines of the Valley teaser */}
        {otherWines.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex max-w-[860px] flex-col gap-2">
              <p
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: 'rgba(93,110,82,0.92)',
                }}
              >
                The Cellar
              </p>
              <h2
                className="capitalize"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 600,
                  fontSize: '26px',
                  color: '#1a1d17',
                  lineHeight: 1.15,
                }}
              >
                Wines of the Valley
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: '12px',
                  lineHeight: '19px',
                  color: '#4f4542',
                }}
              >
                Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made
                slowly.
              </p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-2">
              {otherWines.map((otherWine) => (
                <div key={otherWine._id} className="w-[240px] shrink-0 sm:w-[280px]">
                  <WineCard wine={otherWine} />
                </div>
              ))}
            </div>

            <Link
              href="/wines"
              className="inline-flex w-fit items-center gap-2 border-b pb-1 capitalize"
              style={{
                borderColor: '#2e3a28',
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '1.5px',
                color: '#2e3a28',
              }}
            >
              Explore the Cellar
              <Image src="/wines/explore-arrow.svg" alt="" width={15} height={7} />
            </Link>
          </div>
        )}

        {/* Closing symbol */}
        <div className="flex items-center justify-center overflow-hidden">
          <Image
            src="/wines/collection-symbol.svg"
            alt=""
            width={667}
            height={83}
            className="h-auto w-full max-w-[380px]"
          />
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: wine.name,
          description: wine.description,
          brand: {
            '@type': 'Brand',
            name: 'HOVAZ',
          },
          category: wine.wineType,
        }}
      />
      <PageTracker
        eventName="wine_viewed"
        parameters={{
          wine_name: wine.name,
          wine_type: wine.wineType,
          vintage: wine.vintage,
        }}
      />
    </div>
  )
}
