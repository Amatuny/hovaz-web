import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Wine } from '@/types/sanity'

interface WinePreviewProps {
  wines: Wine[]
}

const wineTypeLabels: Record<string, string> = {
  red: 'Red',
  white: 'White',
  rose: 'Rosé',
  sparkling: 'Sparkling',
  orange: 'Orange',
  dessert: 'Dessert',
}

export function WinePreview({ wines }: WinePreviewProps) {
  if (!wines?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
          The Cellar
        </p>
        <h2 className="heading-section mb-3">Wines of the valley</h2>
        <p className="mb-10 max-w-xl text-base" style={{ color: 'var(--color-brand-stone)' }}>
          Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made
          slowly.
        </p>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-brand-gold)]">
          {wines.map((wine) => (
            <Link
              key={wine._id}
              href={`/wines/${wine.slug.current}`}
              className="group block shrink-0 snap-start overflow-hidden rounded-2xl"
              style={{ width: '250px', backgroundColor: 'var(--color-brand-blush)' }}
            >
              {/* Bottle image */}
              <div
                className="relative overflow-hidden"
                style={{ height: '260px', backgroundColor: 'var(--color-brand-dark)' }}
              >
                {wine.mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(wine.mainImage).width(500).height(600).url()}
                    alt={wine.mainImage.alt ?? wine.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="250px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div
                      className="h-40 w-16 rounded-sm"
                      style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                {wine.wineType && (
                  <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
                    {wineTypeLabels[wine.wineType] ?? wine.wineType}
                  </p>
                )}
                <h3
                  className="mb-2 font-serif"
                  style={{ fontSize: '1.15rem', color: 'var(--color-brand-charcoal)' }}
                >
                  {wine.name}
                </h3>
                {wine.description && (
                  <p
                    className="mb-4 text-sm line-clamp-2"
                    style={{ color: 'var(--color-brand-stone)', lineHeight: 1.6 }}
                  >
                    {wine.description}
                  </p>
                )}
                <div
                  className="flex items-center justify-between pt-3"
                  style={{
                    borderTop:
                      '1px solid color-mix(in srgb, var(--color-brand-stone) 20%, transparent)',
                  }}
                >
                  <span className="text-label" style={{ fontSize: '0.65rem' }}>
                    {wine.grapeVariety}
                  </span>
                  <span
                    className="font-serif italic"
                    style={{ fontSize: '0.85rem', color: 'var(--color-brand-stone)' }}
                  >
                    {wine.vintage}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/wines"
            className="group inline-flex items-center gap-2 font-sans text-base"
            style={{ color: 'var(--color-brand-charcoal)' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Explore The Cellar
            </span>
            <span
              aria-hidden="true"
              className="transition-colors group-hover:text-[var(--color-brand-gold)]"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
