// src/components/ui/WineCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Wine } from '@/types/sanity'

interface WineCardProps {
  wine: Wine
}

const wineTypeLabels: Record<string, string> = {
  red: 'Red Wine',
  white: 'White Wine',
  rose: 'Rosé',
  sparkling: 'Sparkling',
  orange: 'Orange Wine',
  dessert: 'Dessert Wine',
}

export function WineCard({ wine }: WineCardProps) {
  return (
    <Link href={`/wines/${wine.slug.current}`} className="card-wine group block">
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: '280px', backgroundColor: 'var(--color-brand-blush)' }}
      >
        {wine.mainImage?.asset?._ref ? (
          <Image
            src={urlFor(wine.mainImage).width(300).height(500).url()}
            alt={wine.mainImage.alt ?? wine.name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="w-20 h-48 rounded-sm"
            style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
          />
        )}

        {/* Wine type badge */}
        {wine.wineType && (
          <div className="absolute top-4 right-4 px-3 py-1" style={{ backgroundColor: 'white' }}>
            <p className="text-label" style={{ fontSize: '0.6rem' }}>
              {wineTypeLabels[wine.wineType] ?? wine.wineType}
            </p>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-label mb-1" style={{ color: 'var(--color-brand-gold)' }}>
              {wine.vintage} · {wine.region}
            </p>
            <h3 className="heading-card" style={{ fontSize: '1.25rem' }}>
              {wine.name}
            </h3>
          </div>
        </div>

        {wine.grapeVariety && <p className="text-caption mt-1 mb-4">{wine.grapeVariety}</p>}

        {wine.description && (
          <p className="text-body mb-6 line-clamp-2" style={{ fontSize: '0.875rem' }}>
            {wine.description}
          </p>
        )}

        <span className="btn-ghost text-xs">Discover →</span>
      </div>
    </Link>
  )
}
