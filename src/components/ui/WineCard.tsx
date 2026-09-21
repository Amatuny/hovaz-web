// src/components/ui/WineCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Wine } from '@/types/sanity'

interface WineCardProps {
  wine: Wine
}

const wineTypeLabels: Record<string, string> = {
  red: 'Red · Dry',
  white: 'White · Dry',
  rose: 'Rosé · Dry',
  sparkling: 'White · Sparkling',
  orange: 'Orange · Dry',
  dessert: 'Dessert · Sweet',
}

export function WineCard({ wine }: WineCardProps) {
  const tagLine = wine.tastingTags?.length ? wine.tastingTags.join(' · ') : undefined
  const typeLabel = wine.wineType ? (wineTypeLabels[wine.wineType] ?? wine.wineType) : undefined

  return (
    <Link
      href={`/wines/${wine.slug.current}`}
      className="group relative flex w-full flex-col overflow-hidden rounded-[24px]"
      style={{ aspectRatio: '350 / 529' }}
    >
      {/* Photo — fills exactly whatever height the panel below doesn't use, so there's never a gap */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(53,63,48,0.12), rgba(160,174,152,0.12))',
        }}
      >
        {wine.mainImage?.asset?._ref ? (
          <Image
            src={urlFor(wine.mainImage).width(700).height(812).url()}
            alt={wine.mainImage.alt ?? wine.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-48 w-20 rounded-sm"
              style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
            />
          </div>
        )}
      </div>

      {/* Default state — cream body panel; collapses away on hover so the photo above grows to fill the card */}
      <div
        className="flex max-h-[220px] flex-col gap-1 overflow-hidden p-5 opacity-100 transition-[max-height,opacity,padding] duration-300 ease-out group-hover:max-h-0 group-hover:p-0 group-hover:opacity-0"
        style={{ backgroundColor: '#f2eddd' }}
      >
        {typeLabel && (
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: '9px',
              letterSpacing: '1.5px',
              color: '#581009',
            }}
          >
            {typeLabel}
          </p>
        )}

        <p
          className="capitalize italic"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: '0.3px',
            color: '#3d4a38',
          }}
        >
          {wine.name}
        </p>

        {tagLine && (
          <p
            className="truncate capitalize"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 300,
              fontSize: '12px',
              color: '#4a4e44',
            }}
          >
            {tagLine}
          </p>
        )}

        <div
          className="flex flex-wrap items-start gap-3"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: '11px',
            letterSpacing: '0.3px',
            color: '#4a4e44',
          }}
        >
          {wine.grapeVariety && (
            <span className="capitalize" style={{ fontWeight: 500 }}>
              {wine.grapeVariety}
            </span>
          )}
          {wine.vintage && (
            <span className="italic" style={{ fontWeight: 600 }}>
              {wine.vintage}
            </span>
          )}
        </div>
      </div>

      {/* Hover state — full-bleed dark scrim + Discover action */}
      <div
        className="absolute inset-0 flex flex-col justify-end gap-1.5 p-7 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.66) 55%, rgba(0,0,0,0.78) 100%)',
        }}
      >
        {typeLabel && (
          <p
            className="uppercase text-white"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: '10px',
              letterSpacing: '1.5px',
            }}
          >
            {typeLabel}
          </p>
        )}

        <p
          className="capitalize italic text-white"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: '24px',
            letterSpacing: '0.4px',
            lineHeight: 1.15,
          }}
        >
          {wine.name}
        </p>

        {tagLine && (
          <p
            className="text-white"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 300,
              fontSize: '12px',
            }}
          >
            {tagLine}
          </p>
        )}

        <span
          className="inline-flex w-fit items-center gap-2 border-b-2 pb-1 capitalize"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: '12px',
            letterSpacing: '1.5px',
            color: '#fdfcf8',
            borderColor: '#fdfcf8',
          }}
        >
          Discover
          <Image src="/wines/discover-arrow.svg" alt="" width={15} height={7} />
        </span>
      </div>
    </Link>
  )
}
