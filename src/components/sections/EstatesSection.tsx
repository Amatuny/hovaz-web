'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { estateHref } from '@/lib/estates'
import { fig, mfig } from '@/lib/figmaScale'
import type { Estate } from '@/types/sanity'
import { HOME_DEFAULTS } from '@/content/defaults'
import { SectionHead } from '@/components/ui/SectionHead'

interface EstatesSectionProps {
  estates: Estate[]
  texts?: typeof HOME_DEFAULTS.estates
}

export function EstatesSection({ estates, texts = HOME_DEFAULTS.estates }: EstatesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!estates?.length) return null

  return (
    <section
      id="estates"
      className="section-padding scroll-mt-20"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead eyebrow={texts.eyebrow} title={texts.heading} />

        {/* Figma "Locations Row": two 750.5 × 595 cards, 24px gap = 1525px,
            centred in the 1600px content column (hence the slight inset from
            the heading). All values scale with --figma-scale. */}
        <div
          className="mx-auto flex w-full flex-col items-center xl:flex-row xl:items-stretch"
          style={{ maxWidth: fig(1525), gap: mfig(24, 24) }}
        >
          {estates.map((estate) => {
            const isHovered = hoveredId === estate._id

            return (
              // Only the "Choose yours" button navigates — the card is not a link.
              // Focus from that button bubbles up, so keyboard users still get
              // the hover widening.
              <div
                key={estate._id}
                onMouseEnter={() => setHoveredId(estate._id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(estate._id)}
                onBlur={() => setHoveredId(null)}
                // Equal widths at rest (Figma 750.5px each); on md+ the hovered
                // card grows to Figma's hover split, 1023 : 478 = 2.14 : 1. Row-only, so the
                // stacked mobile cards keep their fixed height.
                className={`group relative block h-[400px] w-full max-w-[350px] min-w-0 overflow-hidden lg:h-[calc(var(--figma-scale)*595px)] lg:max-w-[calc(var(--figma-scale)*750.5px)] xl:max-w-none xl:basis-0 ${isHovered ? 'xl:grow-[2.14]' : 'xl:grow'}`}
                style={{
                  // Figma "Location Card": radius 24 on mobile, 28 on desktop
                  borderRadius: mfig(24, 28),
                  transition: 'flex-grow 600ms cubic-bezier(0.65, 0, 0.35, 1)',
                }}
              >
                {estate.mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(estate.mainImage).width(1400).height(1000).url()}
                    alt={estate.mainImage.alt ?? estate.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'var(--color-brand-dark)' }}
                  />
                )}

                {/* Gradient overlay for text legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      // Figma: bottom-up black wash (0.78 → 0.66 at 35% → clear at
                      // 63%) plus a radial darkening in the top-left behind the stat
                      `linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.66) 35%, rgba(0,0,0,0) 63%), radial-gradient(circle ${fig(431)} at 0 0, rgba(0,0,0,0.54) 77%, rgba(0,0,0,0) 100%)`,
                  }}
                />

                {/* Stat */}
                <div
                  className="absolute left-6 top-8 flex flex-col items-start text-white lg:left-[calc(var(--figma-scale)*40px)] lg:top-[calc(var(--figma-scale)*40px)]"
                  style={{ gap: fig(12) }}
                >
                  {/* Figma "Frame 187": 120px-tall row (the 3-line label's
                      height), 12px gap. min-height keeps that height even when
                      the Studio label is only one or two lines, so the oversized
                      "3" never runs into the link below. */}
                  <div className="flex items-start" style={{ gap: fig(12), minHeight: fig(120) }}>
                    <p
                      className="shrink-0"
                      style={{
                        // Figma: Playfair Display SemiBold 160px, -4px tracking,
                        // 36% line height in a 76px-wide box — the glyph spills
                        // out of its short line box exactly as in the design
                        width: fig(76),
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 600,
                        fontSize: fig(160),
                        lineHeight: 0.36,
                        letterSpacing: fig(-4),
                        color: '#FDFCF8',
                      }}
                    >
                      {estate.eventsCount}
                    </p>
                    <p
                      className="flex flex-col"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 600,
                        fontSize: fig(42),
                        lineHeight: 0.96,
                        color: '#FDFCF8',
                      }}
                    >
                      {/* One word per line, as in the design */}
                      {texts.statLabel.split(/\s+/).map((word, i) => (
                        <span key={i}>{word}</span>
                      ))}
                    </p>
                  </div>
                  {/* Figma text link, white, 24px — the card's only link */}
                  <Link
                    href={estateHref(estate)}
                    aria-label={`${texts.linkText}: ${estate.name}`}
                    className="inline-flex items-center border-b-2 border-[#fdfcf8] capitalize text-[#fdfcf8] transition-opacity duration-150 ease-out hover:opacity-[0.78] active:translate-y-px"
                    style={{
                      gap: fig(8),
                      paddingInline: fig(8),
                      paddingBlock: fig(4),
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 600,
                      fontSize: `max(15px, ${fig(24)})`,
                      letterSpacing: fig(2),
                    }}
                  >
                    {texts.linkText}
                    <Image
                      src="/wines/discover-arrow.svg"
                      alt=""
                      aria-hidden="true"
                      width={15}
                      height={7}
                    />
                  </Link>
                </div>

                {/* Name & description */}
                <div
                  className="absolute inset-x-0 bottom-0 flex flex-col p-6 lg:p-[calc(var(--figma-scale)*40px)]"
                  style={{ gap: fig(12) }}
                >
                  <h3
                    className="capitalize"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: `max(24px, ${fig(32)})`,
                      color: '#fdfcf8',
                    }}
                  >
                    {estate.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: `max(14px, ${fig(15)})`,
                      lineHeight: 1.55,
                      color: '#f0ede2',
                    }}
                  >
                    {estate.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
