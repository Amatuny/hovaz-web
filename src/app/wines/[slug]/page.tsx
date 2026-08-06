// src/app/wines/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getWineBySlug, getAllWineSlugs } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'

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

const wineTypeLabels: Record<string, string> = {
  red: 'Red Wine',
  white: 'White Wine',
  rose: 'Rosé',
  sparkling: 'Sparkling',
  orange: 'Orange Wine',
  dessert: 'Dessert Wine',
}

export default async function WineDetailPage({ params }: Props) {
  const { slug } = await params
  const wine = await getWineBySlug(slug)
  if (!wine) notFound()

  return (
    <>
      {/* Hero section */}
      <div className="pt-24" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 py-6">
            <Link
              href="/wines"
              className="text-caption hover:text-brand-burgundy transition-colors"
            >
              Wines
            </Link>
            <span className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
              /
            </span>
            <span className="text-caption" style={{ color: 'var(--color-brand-burgundy)' }}>
              {wine.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
            {/* Left — bottle image */}
            <div
              className="relative flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-brand-blush)',
                minHeight: '500px',
              }}
            >
              {wine.mainImage?.asset?._ref ? (
                <Image
                  src={urlFor(wine.mainImage).width(600).height(900).url()}
                  alt={wine.mainImage.alt ?? wine.name}
                  fill
                  className="object-contain p-12"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div
                  className="w-32 h-64 rounded-sm"
                  style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                />
              )}
            </div>

            {/* Right — wine info */}
            <div className="flex flex-col justify-center">
              {/* Labels */}
              <div className="flex items-center gap-4 mb-4">
                {wine.wineType && (
                  <span className="text-label" style={{ color: 'var(--color-brand-gold)' }}>
                    {wineTypeLabels[wine.wineType] ?? wine.wineType}
                  </span>
                )}
                {wine.vintage && (
                  <span className="text-label" style={{ color: 'var(--color-brand-stone)' }}>
                    {wine.vintage}
                  </span>
                )}
              </div>

              <h1 className="heading-display mb-2" style={{ fontSize: '3rem' }}>
                {wine.name}
              </h1>

              {wine.grapeVariety && (
                <p
                  className="font-serif text-xl mb-6"
                  style={{ color: 'var(--color-brand-stone)' }}
                >
                  {wine.grapeVariety}
                </p>
              )}

              {wine.description && <p className="text-body mb-8">{wine.description}</p>}

              {/* Wine details grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6" style={{ backgroundColor: 'white' }}>
                {wine.region && (
                  <div>
                    <p className="text-label mb-1">Region</p>
                    <p className="text-body" style={{ fontSize: '0.9rem' }}>
                      {wine.region}
                    </p>
                  </div>
                )}
                {wine.vintage && (
                  <div>
                    <p className="text-label mb-1">Vintage</p>
                    <p className="text-body" style={{ fontSize: '0.9rem' }}>
                      {wine.vintage}
                    </p>
                  </div>
                )}
                {wine.alcohol && (
                  <div>
                    <p className="text-label mb-1">Alcohol</p>
                    <p className="text-body" style={{ fontSize: '0.9rem' }}>
                      {wine.alcohol}%
                    </p>
                  </div>
                )}
                {wine.servingTemp && (
                  <div>
                    <p className="text-label mb-1">Serving Temp</p>
                    <p className="text-body" style={{ fontSize: '0.9rem' }}>
                      {wine.servingTemp}
                    </p>
                  </div>
                )}
              </div>

              {/* CTA — Flow 2 conversion */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/events/guided-tasting" className="btn-primary">
                  Book a Tasting
                </Link>
                <Link href="/wines" className="btn-secondary">
                  All Wines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasting & Pairing notes */}
      {(wine.tastingNotes || wine.pairingNotes) && (
        <div className="section-padding" style={{ backgroundColor: 'white' }}>
          <div className="container-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-prose mx-auto md:max-w-none">
              {wine.tastingNotes && (
                <div>
                  <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
                    Tasting Notes
                  </p>
                  <p
                    className="font-serif text-xl"
                    style={{ color: 'var(--color-brand-charcoal)', lineHeight: '1.6' }}
                  >
                    &ldquo;{wine.tastingNotes}&rdquo;
                  </p>
                </div>
              )}

              {wine.pairingNotes && (
                <div>
                  <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
                    Food Pairing
                  </p>
                  <p className="text-body">{wine.pairingNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {wine.gallery && wine.gallery.length > 0 && (
        <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
          <div className="container-content">
            <p className="text-label mb-8 text-center" style={{ color: 'var(--color-brand-gold)' }}>
              Gallery
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wine.gallery
                .filter((img) => img?.asset?._ref)
                .map((img, i) => (
                  <div key={i} className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <Image
                      src={urlFor(img).width(600).height(450).url()}
                      alt={img.alt ?? `${wine.name} gallery image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div
        className="section-padding-sm"
        style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
      >
        <div className="container-content text-center">
          <h2 className="heading-section mb-4" style={{ color: 'white' }}>
            Taste {wine.name} in Person
          </h2>
          <p className="text-body max-w-md mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join a guided tasting at our Wine Rooms and discover the full story behind every bottle.
          </p>
          <Link href="/events/guided-tasting" className="btn-white">
            Book a Guided Tasting
          </Link>
        </div>
      </div>
    </>
  )
}
