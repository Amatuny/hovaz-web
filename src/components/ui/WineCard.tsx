// src/components/ui/WineCard.tsx
// Figma "wine-card" (wine--reserve 35:578): 350×529 at the 1900px design
// width, radius 24. Default: 360px photo window over a cream body panel.
// Hover (smart-animate 200ms ease-out): the photo fills the card under a dark
// scrim with a larger name and a "Discover" text link.
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Wine } from '@/types/sanity'
import { WINES_DEFAULTS, type WineCardLabels } from '@/content/defaults'

interface WineCardProps {
  wine: Wine
  /** From Our Wines Page → Wine Cards; built-in labels when omitted */
  labels?: WineCardLabels
}

const DEFAULT_LABELS: WineCardLabels = {
  card: WINES_DEFAULTS.card,
  wineTypes: WINES_DEFAULTS.wineTypes,
}

// The card scales with --figma-scale like the rest of the page (350px at the
// 1900px design width), never below 250px so it stays legible on phones.
// Every inner value is the Figma px scaled by the card's width, so the card
// keeps the design's proportions at any size.
// Mobile Figma: a full 350px card (narrower only on phones under ~382px).
const CARD_WIDTH =
  'calc(min(350px, calc(100vw - 32px)) * (1 - var(--lg, 1)) + max(250px, calc(var(--figma-scale) * 350px)) * var(--lg, 1))'
const w = (px: number) => `calc(var(--wcw) * ${+(px / 350).toFixed(5)})`

export function WineCard({ wine, labels = DEFAULT_LABELS }: WineCardProps) {
  const tagLine = wine.tastingTags?.length ? wine.tastingTags.join(' · ') : undefined
  const wineTypes: Record<string, string> = labels.wineTypes
  const typeLabel = wine.wineType ? (wineTypes[wine.wineType] ?? wine.wineType) : undefined

  return (
    // Only the "Discover" button navigates — the card itself is not a link.
    <article
      className="group relative flex max-w-full flex-none flex-col overflow-hidden"
      style={
        {
          '--wcw': CARD_WIDTH,
          // Sizes the hover state animates — set as variables so the
          // group-hover classes below can override them.
          '--wc-photo': w(360),
          '--wc-body-max': w(220),
          '--wc-body-pad': w(32),
          width: 'var(--wcw)',
          aspectRatio: '350 / 529',
          borderRadius: w(24),
        } as React.CSSProperties
      }
    >
      {/* Photo window — 360px tall; grows to the full card on hover as the
          body panel collapses. Figma "photo ph": the image itself is 406px
          tall, pinned to the top of the window (its bottom 46px is cropped),
          and fills the whole card on hover. */}
      <div
        className="relative h-[var(--wc-photo)] shrink-0 overflow-hidden transition-[height] duration-200 ease-out group-focus-within:h-full group-hover:h-full"
        style={{
          background: 'linear-gradient(to bottom, rgba(53,63,48,0.12), rgba(160,174,152,0.12))',
        }}
      >
        {wine.mainImage?.asset?._ref ? (
          <div
            className="absolute inset-x-0 top-0 h-[var(--wc-img)] transition-[height] duration-200 ease-out group-focus-within:h-full group-hover:h-full"
            style={{ '--wc-img': w(406) } as React.CSSProperties}
          >
            <Image
              src={urlFor(wine.mainImage).width(700).height(1058).url()}
              alt={wine.mainImage.alt ?? wine.name}
              fill
              className="object-cover"
              sizes="(min-width: 1900px) 350px, (min-width: 714px) 18.4vw, 250px"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-sm"
              style={{
                width: w(80),
                height: w(192),
                backgroundColor: 'var(--color-brand-burgundy)',
              }}
            />
          </div>
        )}
      </div>

      {/* Default state — cream body panel (32px padding, 8px gaps); collapses
          away on hover so the photo above grows to fill the card */}
      <div
        className="flex max-h-[var(--wc-body-max)] flex-1 flex-col overflow-hidden p-[var(--wc-body-pad)] opacity-100 transition-[max-height,opacity,padding] duration-200 ease-out group-focus-within:max-h-0 group-focus-within:p-0 group-focus-within:opacity-0 group-hover:max-h-0 group-hover:p-0 group-hover:opacity-0"
        style={{ backgroundColor: '#f2eddd', gap: w(8) }}
      >
        {typeLabel && (
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: w(12),
              lineHeight: w(13),
              letterSpacing: w(3),
              color: '#581009',
            }}
          >
            {typeLabel}
          </p>
        )}

        <p
          className="truncate capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: w(24),
            lineHeight: 1.333,
            letterSpacing: w(0.5),
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
              fontSize: w(16),
              lineHeight: 1.3,
              color: '#4a4e44',
            }}
          >
            {tagLine}
          </p>
        )}

        <div
          className="flex flex-wrap items-start"
          style={{
            gap: w(16),
            fontFamily: 'var(--font-hanken)',
            fontSize: w(14),
            lineHeight: w(15),
            letterSpacing: w(0.5),
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

      {/* Hover state — full-bleed scrim (clear → 80% at 55% → 95%), body 48px
          in, items 12px apart */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity duration-200 ease-out group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
        style={{
          padding: w(48),
          gap: w(12),
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.95) 100%)',
        }}
      >
        {typeLabel && (
          <p
            className="uppercase text-white"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: w(14),
              lineHeight: w(28),
              letterSpacing: w(3),
            }}
          >
            {typeLabel}
          </p>
        )}

        <p
          className="capitalize text-white"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: w(42),
            lineHeight: 1.333,
            letterSpacing: w(1),
          }}
        >
          {wine.name}
        </p>

        {tagLine && (
          <p
            className="truncate text-white"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 300,
              fontSize: w(16),
              lineHeight: 1.3,
            }}
          >
            {tagLine}
          </p>
        )}

        {/* Figma white text link: 16px, 2px tracking, 8/4 padding, 8px gap.
            Its own hover (863:7579) fades it to 78%; pressed nudges it 1px. */}
        <Link
          href={`/wines/${wine.slug.current}`}
          aria-label={`${labels.card.discover}: ${wine.name}`}
          className="inline-flex w-fit items-center border-b-2 capitalize transition-opacity duration-150 ease-out hover:opacity-[0.78] active:translate-y-px"
          style={{
            gap: w(8),
            paddingInline: w(8),
            paddingBlock: w(4),
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: w(16),
            letterSpacing: w(2),
            color: '#fdfcf8',
            borderColor: '#fdfcf8',
          }}
        >
          {labels.card.discover}
          <span className="relative shrink-0" style={{ width: w(15), height: w(7) }}>
            <Image src="/wines/discover-arrow.svg" alt="" aria-hidden="true" fill />
          </span>
        </Link>
      </div>
    </article>
  )
}
