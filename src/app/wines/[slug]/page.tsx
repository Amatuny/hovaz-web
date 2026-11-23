// src/app/wines/[slug]/page.tsx
// Figma "wine page" (wine--reserve 3179:5258). Every size below is the
// Figma px at the 1900px design width; mfig() gives the phone value below lg
// and scales the desktop value with --figma-scale like the rest of the site.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getWineBySlug,
  getAllWineSlugs,
  getOtherWines,
  getWinesPage,
  getSiteSettings,
} from '@/lib/sanity/queries'
import { currentLocale, resolveWinesContent, seoToMetadata } from '@/lib/sanity/pageContent'
import { resolveHomeContent } from '@/lib/sanity/siteContent'
import type { TextSource } from '@/lib/sanity/localize'
import { urlFor } from '@/lib/sanity/image'
import { mfig } from '@/lib/figmaScale'
import { WineCard } from '@/components/ui/WineCard'
import { SectionHead } from '@/components/ui/SectionHead'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { StripEndCard } from '@/components/ui/StripEndCard'
import { TextLink } from '@/components/ui/TextLink'
import { DragScroll } from '@/components/ui/DragScroll'
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
  const [wine, locale] = await Promise.all([getWineBySlug(slug), currentLocale()])
  if (!wine) return {}

  // The wine's own SEO fields (Wines → SEO tab) win; otherwise name + description
  return seoToMetadata(wine.seo as TextSource | undefined, locale, {
    title: `${wine.name} ${wine.vintage ?? ''}`.trim(),
    description: wine.description ?? wine.tastingNotes,
    image: wine.mainImage?.asset?._ref
      ? urlFor(wine.mainImage).width(1200).height(630).url()
      : undefined,
  })
}

export const revalidate = 3600

function formatEventDateTime(startDate?: string) {
  if (!startDate) return undefined
  const d = new Date(startDate)
  if (Number.isNaN(d.getTime())) return undefined
  const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}

// Figma spec field: Hanken Bold 10 / 0.8px label over Hanken Medium 15 value, 4px apart
function MetaField({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col" style={{ gap: '4px', lineHeight: 'normal' }}>
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 700,
          fontSize: mfig(10, 10, 9),
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
          fontSize: mfig(15, 15, 13),
          color: '#1a1d16',
        }}
      >
        {value}
      </p>
    </div>
  )
}

// Figma dark story panels ("The Grape", "How We Decided"): Montserrat 12 /
// 3px label, Playfair 30 title, Hanken 16 / 1.65 text, 16px apart
const panelLabel: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: mfig(12, 12, 11),
  letterSpacing: mfig(2, 3, 2),
  lineHeight: 'normal',
  color: '#e5987d',
}
const panelTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair)',
  fontWeight: 600,
  fontSize: mfig(24, 30, 22),
  lineHeight: 'normal',
  color: '#f1eeeb',
}
const panelText: React.CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontWeight: 400,
  fontSize: mfig(15, 16, 14),
  lineHeight: 1.65,
  color: '#f1eeeb',
}

// Figma story paragraphs: Hanken 16 / 1.65, muted, left-aligned in a centred 900px box
const storyText: React.CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontWeight: 400,
  fontSize: mfig(15, 16, 14),
  lineHeight: 1.65,
  color: '#79726d',
}

export default async function WineDetailPage({ params }: Props) {
  const { slug } = await params
  const [wine, doc, settings, locale] = await Promise.all([
    getWineBySlug(slug),
    getWinesPage(),
    getSiteSettings(),
    currentLocale(),
  ])
  if (!wine) notFound()

  // Fixed labels — Studio → Pages → Our Wines Page → Wine Detail Page
  const content = resolveWinesContent(doc, locale)
  const t = content.detail
  // "Browse all wines" end card — same texts as the homepage wines strip
  const homeWines = resolveHomeContent(settings, locale).wines

  const otherWines = await getOtherWines(slug)
  const wineTypes: Record<string, string> = content.cards.wineTypes
  // Same label as the cards, written "Red, Dry" instead of "Red · Dry"
  const styleLabel = wine.wineType ? wineTypes[wine.wineType]?.replace(/\s*·\s*/g, ', ') : undefined
  const upcomingEvents = (wine.relatedEvents ?? [])
    .filter((event) => event.status === 'upcoming')
    .slice(0, 3)
  const [storyImage, storyImageA, storyImageB] = wine.gallery ?? []
  const hasGrapeSection = Boolean(storyImage || wine.grapeStoryText || wine.howWeDecidedText)

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content page-main page-main--wine">
        {/* Bottle info column (handoff §5) — 1200px, centred in the 1600
            container, its blocks stacked 82px apart (48px on mobile). */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:gap-[82px]">
          {/* Breadcrumb, then the two-column row 16px below */}
          <div className="flex flex-col gap-4">
            <nav
              className="flex items-center gap-1"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '13px',
                lineHeight: 'normal',
                color: '#a8a290',
              }}
            >
              <Link href="/wines" className="hover:underline">
                {t.breadcrumb}
              </Link>
              <span>/</span>
              <span style={{ color: '#4f4542' }}>{wine.name}</span>
            </nav>

            {/* Two-column row — photo 512 + 64 gap + description 624 = 1200,
                811 tall, tops aligned, never stacked on desktop. Both
                columns shrink in proportion below the design width. */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16">
              {/* Figma "bottle-photo": the photo fills the whole 512×811 card */}
              <div
                className="relative mx-auto aspect-[512/811] w-full max-w-[512px] shrink-0 overflow-hidden rounded-[20px] lg:mx-0 lg:max-w-none lg:flex-[0_1_512px]"
                style={{ backgroundColor: '#f2eddd' }}
              >
                {wine.mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(wine.mainImage).width(1024).height(1622).url()}
                    alt={wine.mainImage.alt ?? wine.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 512px"
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

              {/* Description column — 624px, same height as the photo, its
                  blocks spread with an "auto" gap (space-between). */}
              <div className="flex min-w-0 flex-col gap-6 lg:flex-[0_1_624px] lg:justify-between lg:gap-5">
                <div className="flex flex-col gap-4">
                  {wine.award && (
                    <span
                      className="inline-flex w-fit items-center rounded-full px-3.5 py-1.5 uppercase"
                      style={{
                        backgroundColor: '#8e6711',
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 700,
                        fontSize: '10px',
                        lineHeight: 'normal',
                        letterSpacing: '0.8px',
                        color: '#fdfcf8',
                      }}
                    >
                      {wine.award}
                    </span>
                  )}

                  <h1
                    className="capitalize"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: mfig(32, 44, 30),
                      lineHeight: 'normal',
                      letterSpacing: '0.5px',
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
                        fontSize: mfig(15, 16, 14),
                        lineHeight: 1.6,
                        color: '#4f4542',
                      }}
                    >
                      {wine.tastingNotes ?? wine.description}
                    </p>
                  )}
                </div>

                {(Boolean(wine.pairWith?.length) || Boolean(wine.perfectFor?.length)) && (
                  <div
                    className="flex flex-col italic"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: mfig(15, 16, 14),
                      lineHeight: 'normal',
                      color: '#2e3a28',
                    }}
                  >
                    {wine.pairWith?.length ? (
                      <p>
                        <span style={{ fontWeight: 600 }}>{t.pairWithLabel} </span>
                        <span style={{ fontWeight: 400 }}>{wine.pairWith.join(' · ')}</span>
                      </p>
                    ) : null}
                    {wine.perfectFor?.length ? (
                      <p>
                        <span style={{ fontWeight: 600 }}>{t.perfectForLabel} </span>
                        <span style={{ fontWeight: 400 }}>{wine.perfectFor.join(' · ')}</span>
                      </p>
                    ) : null}
                  </div>
                )}

                {/* Spec table: 2 columns 16px apart, rows 24px apart, 16px
                    padding between the hairlines */}
                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-6 border-y py-4"
                  style={{ borderColor: 'rgba(26,29,23,0.1)' }}
                >
                  <MetaField label={t.agingLabel} value={wine.agingNotes} />
                  <MetaField label={t.bottleSizeLabel} value={wine.bottleSize} />
                  <MetaField label={t.vintageLabel} value={wine.vintage?.toString()} />
                  <MetaField label={t.regionLabel} value={wine.region} />
                  <MetaField label={t.varietalLabel} value={wine.grapeVariety} />
                  <MetaField label={t.styleLabel} value={styleLabel} />
                </div>

                {upcomingEvents.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <SectionHead eyebrow={t.eventsEyebrow} title={t.eventsHeading} titleSize={32} />

                    {/* Event rows: white, radius 24, 22/28 padding, 12px apart */}
                    <div className="flex flex-col gap-3">
                      {upcomingEvents.map((event) => {
                        const when = formatEventDateTime(event.startDate)
                        return (
                          <Link
                            key={event._id}
                            href={`/events/${event.slug.current}`}
                            className="flex items-center justify-between gap-4 rounded-[24px] bg-white px-5 py-4 lg:px-7 lg:py-[22px]"
                            style={{ lineHeight: 'normal' }}
                          >
                            <div className="flex flex-col gap-1">
                              <p
                                style={{
                                  fontFamily: 'var(--font-playfair)',
                                  fontWeight: 500,
                                  fontSize: mfig(16, 18, 15),
                                  color: '#1a1d17',
                                }}
                              >
                                {event.title}
                              </p>
                              {event.location && (
                                <p
                                  style={{
                                    fontFamily: 'var(--font-hanken)',
                                    fontWeight: 400,
                                    fontSize: mfig(13, 13, 12),
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
                                  fontSize: mfig(12, 13, 12),
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
                  </div>
                )}

                {/* Figma "Button": full column width, forest pill, 12/64
                    padding, Hanken SemiBold 16 / 2px */}
                {upcomingEvents.length > 0 && (
                  <Link
                    href={`/events/${upcomingEvents[0].slug.current}`}
                    className="inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-center capitalize text-white transition-opacity duration-150 ease-out hover:opacity-90 lg:px-16"
                    style={{
                      backgroundColor: '#2e3a28',
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 600,
                      fontSize: mfig(15, 16, 14),
                      lineHeight: '24px',
                      letterSpacing: mfig(1.5, 2, 1.5),
                    }}
                  >
                    {t.eventsButton}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <SectionDivider variant="vine" />

          {wine.storyIntro && (
            <p className="mx-auto w-full max-w-[900px]" style={storyText}>
              {wine.storyIntro}
            </p>
          )}

          {/* Figma story grid: 4 columns, rows 320 / 220 / 260, 24px gaps.
              Photo 2×2 on the left, "The Grape" panel top right, two small
              photos under it, "How We Decided" across the bottom row. */}
          {hasGrapeSection && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:grid-rows-[320px_220px_260px] lg:gap-6">
              <div className="relative aspect-square overflow-hidden rounded-[24px] lg:col-span-2 lg:row-span-2 lg:aspect-auto">
                {storyImage?.asset?._ref && (
                  <Image
                    src={urlFor(storyImage).width(1000).height(1000).url()}
                    alt={storyImage.alt ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 600px"
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
                  className="flex flex-col justify-center gap-4 rounded-[24px] p-8 lg:col-span-2 lg:p-16"
                  style={{ backgroundColor: '#231814' }}
                >
                  <p className="uppercase" style={panelLabel}>
                    {t.grapeLabel}
                  </p>
                  {wine.grapeVariety && <p style={panelTitle}>{wine.grapeVariety}</p>}
                  <p style={panelText}>{wine.grapeStoryText}</p>
                </div>
              )}

              {storyImageA?.asset?._ref && (
                <div className="relative aspect-[282/220] overflow-hidden rounded-[24px] lg:col-start-3 lg:row-start-2 lg:aspect-auto">
                  <Image
                    src={urlFor(storyImageA).width(600).height(468).url()}
                    alt={storyImageA.alt ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 282px"
                  />
                </div>
              )}

              {storyImageB?.asset?._ref && (
                <div className="relative aspect-[282/220] overflow-hidden rounded-[24px] lg:col-start-4 lg:row-start-2 lg:aspect-auto">
                  <Image
                    src={urlFor(storyImageB).width(600).height(468).url()}
                    alt={storyImageB.alt ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 282px"
                  />
                </div>
              )}

              {wine.howWeDecidedText && (
                <div
                  className="flex flex-col justify-center gap-4 rounded-[24px] p-8 lg:col-span-4 lg:row-start-3 lg:p-16"
                  style={{ backgroundColor: '#231814' }}
                >
                  <p className="uppercase" style={panelLabel}>
                    {t.howWeDecidedLabel}
                  </p>
                  {wine.howWeDecidedTitle && <p style={panelTitle}>{wine.howWeDecidedTitle}</p>}
                  <p style={panelText}>{wine.howWeDecidedText}</p>
                </div>
              )}
            </div>
          )}

          {/* Paragraphs separated by one empty line, as in Figma */}
          {Boolean(wine.storyOutro?.length) && (
            <div
              className="mx-auto flex w-full max-w-[900px] flex-col"
              style={{ ...storyText, gap: '1.65em' }}
            >
              {wine.storyOutro?.map((paragraph, i) => (
                <p key={i} style={{ lineHeight: 'inherit' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
        {/* end bottle info column */}

        {/* Figma "wine": the same strip as the homepage — section head, 350px
            cards 32px apart ending in "Browse all wines", then the text link,
            48px between each. */}
        {otherWines.length > 0 && (
          <div className="flex flex-col" style={{ gap: mfig(32, 48) }}>
            <SectionHead eyebrow={t.moreEyebrow} title={t.moreHeading} text={t.moreText} />

            <DragScroll
              arrows
              className="flex snap-x snap-mandatory"
              style={{ gap: mfig(32, 32, 16) }}
            >
              {otherWines.map((otherWine) => (
                <div key={otherWine._id} className="shrink-0 snap-start">
                  <WineCard wine={otherWine} labels={content.cards} />
                </div>
              ))}
              <StripEndCard
                href="/wines"
                variant="wines"
                heading={homeWines.endHeading}
                button={homeWines.endButton}
              />
            </DragScroll>

            <TextLink href="/wines">{t.moreLink}</TextLink>
          </div>
        )}

        <SectionDivider variant="symbol" />
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
