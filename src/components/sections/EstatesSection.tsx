'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { estateHref } from '@/lib/estates'
import { fig } from '@/lib/figmaScale'
import type { Estate } from '@/types/sanity'

interface EstatesSectionProps {
  estates: Estate[]
}

export function EstatesSection({ estates }: EstatesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!estates?.length) return null

  return (
    <section
      id="estates"
      className="section-padding scroll-mt-20"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        <p
          className="mb-4 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          Two Estates
        </p>
        <h2
          className="mb-10 capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.4vw, 36px)',
            color: '#1a1d17',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
          }}
        >
          Choose Your Location First
        </h2>

        {/* Figma "Locations Row": two 750.5 × 595 cards, 24px gap = 1525px,
            centred in the 1600px content column (hence the slight inset from
            the heading). All values scale with --figma-scale. */}
        <div
          className="mx-auto flex w-full flex-col md:flex-row"
          style={{ maxWidth: fig(1525), gap: fig(24) }}
        >
          {estates.map((estate) => {
            const isHovered = hoveredId === estate._id

            return (
              <Link
                key={estate._id}
                href={estateHref(estate)}
                onMouseEnter={() => setHoveredId(estate._id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(estate._id)}
                onBlur={() => setHoveredId(null)}
                // Equal widths at rest (Figma 750.5px each); on md+ the hovered
                // card grows to twice the share of the row. Row-only, so the
                // stacked mobile cards keep their fixed height.
                className={`group relative block h-[420px] min-w-0 overflow-hidden md:h-[calc(var(--figma-scale)*595px)] md:basis-0 ${isHovered ? 'md:grow-[2]' : 'md:grow'}`}
                style={{
                  borderRadius: fig(24),
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
                      'linear-gradient(to top, rgba(26,10,13,0.8) 0%, rgba(26,10,13,0.15) 42%, rgba(26,10,13,0.3) 100%)',
                  }}
                />

                {/* Stat */}
                <div
                  className="absolute left-6 top-8 text-white lg:left-[calc(var(--figma-scale)*44px)] lg:top-[calc(var(--figma-scale)*44px)]"
                  style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
                >
                  <div className="flex items-start" style={{ gap: fig(20) }}>
                    <p
                      className="leading-[0.8]"
                      style={{
                        // Figma: Playfair Display SemiBold 160px, -4px tracking,
                        // default (old-style) figures — gives the flat-topped "3"
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 600,
                        fontSize: fig(160),
                        letterSpacing: fig(-4),
                        color: '#FDFCF8',
                        // Old-style figures sit low in the line box; lift them so
                        // the digit's top lines up with the top of "Type"
                        marginTop: '-0.243em',
                      }}
                    >
                      {estate.eventsCount}
                    </p>
                    <p
                      className="flex flex-col"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 500,
                        fontSize: fig(42),
                        lineHeight: 0.9,
                      }}
                    >
                      <span>Type</span>
                      <span>Of</span>
                      <span>Experiences</span>
                    </p>
                  </div>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 border-b-2 border-white px-1 pb-1 transition-colors group-hover:border-[var(--color-brand-gold)]"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontWeight: 500,
                      fontSize: 'clamp(15px, 1.25vw, 20px)',
                      letterSpacing: '1px',
                    }}
                  >
                    Find Your <span aria-hidden="true">→</span>
                  </span>
                </div>

                {/* Name & description */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-[calc(var(--figma-scale)*40px)]">
                  <h3
                    className="mb-3 text-white"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 500,
                      fontSize: 'clamp(1.5rem, 2.2vw, 2.25rem)',
                    }}
                  >
                    {estate.name}
                  </h3>
                  <p
                    className="max-w-2xl text-white/90"
                    style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', lineHeight: 1.6 }}
                  >
                    {estate.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
