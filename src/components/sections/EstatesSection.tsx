'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Estate } from '@/types/sanity'

interface EstatesSectionProps {
  estates: Estate[]
}

export function EstatesSection({ estates }: EstatesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!estates?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p
          className="mb-2 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '1.5px',
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
            fontSize: '26px',
            color: '#1a1d17',
            letterSpacing: '0.3px',
            lineHeight: 1.15,
          }}
        >
          Proshyan &amp; Dilijan
        </h2>

        <div
          className="flex flex-col gap-4 md:flex-row"
          style={{ height: 'clamp(420px, 62vh, 600px)' }}
        >
          {estates.map((estate) => {
            const isHovered = hoveredId === estate._id

            return (
              <Link
                key={estate._id}
                href={estate.link}
                onMouseEnter={() => setHoveredId(estate._id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(estate._id)}
                onBlur={() => setHoveredId(null)}
                className="group relative block overflow-hidden rounded-2xl lg:rounded-3xl"
                style={{
                  flexGrow: isHovered ? 2 : 1,
                  flexBasis: 0,
                  minWidth: 0,
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
                <div className="absolute left-6 top-8 lg:left-9 lg:top-10">
                  <p
                    className="leading-none text-white"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: 'clamp(2.75rem, 5.5vw, 5rem)',
                      textShadow: '0 2px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    {estate.eventsCount}
                  </p>
                  <p
                    className="mt-2 flex items-center gap-1.5 uppercase text-white"
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: '10px',
                      letterSpacing: '1.5px',
                    }}
                  >
                    Events <span aria-hidden="true">→</span>
                  </p>
                  <div
                    className="mt-3 h-px w-16"
                    style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
                  />
                </div>

                {/* Name & description */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
                  <h3
                    className="mb-2 text-white"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    }}
                  >
                    {estate.name}
                  </h3>
                  <p
                    className="max-w-sm text-white/80"
                    style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', lineHeight: 1.6 }}
                  >
                    {estate.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10">
          <Link
            href="/about/our-story"
            className="group inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', color: '#1a1d17' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Read Our Story
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
