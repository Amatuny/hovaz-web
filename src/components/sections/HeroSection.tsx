'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/types/sanity'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  location?: string
  ctaText?: string
  gallery?: SanityImage[]
}

const AUTOPLAY_MS = 3500
const TRANSITION_MS = 700
const SLIDE_WIDTH_PCT = 62
const PEEK_PCT = (100 - SLIDE_WIDTH_PCT) / 2

export function HeroSection({
  headline = 'More Than Wine Grows Here',
  subheadline = 'Discover HOVAZ Wine Rooms — where ancient tradition meets modern hospitality',
  location = 'Proshyan Valley, Armenia',
  ctaText,
  gallery = [],
}: HeroSectionProps) {
  const resolvedCtaText = ctaText || 'Book Your Experience'
  const slides = gallery.length > 0 ? gallery : [undefined, undefined, undefined]
  const count = slides.length

  // The track holds [clone-of-last, ...real slides, clone-of-first] so it can
  // slide continuously right-to-left and loop without ever snapping backwards.
  const extended = [slides[count - 1], ...slides, slides[0]]

  const [trackIndex, setTrackIndex] = useState(1)
  const [animate, setAnimate] = useState(true)

  const active = (((trackIndex - 1) % count) + count) % count

  // Autoplay never stops — the images keep rolling right-to-left on their own
  // while the headline and buttons stay fixed in the same spot on screen.
  useEffect(() => {
    if (count <= 1) return
    const id = setTimeout(() => {
      setAnimate(true)
      setTrackIndex((i) => i + 1)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [trackIndex, count])

  const goTo = (realIndex: number) => {
    setAnimate(true)
    setTrackIndex(realIndex + 1)
  }

  // When the slide track lands on a cloned slide, snap invisibly (no transition)
  // back to the matching real slide so the loop never runs out of track.
  const handleTransitionEnd = () => {
    if (trackIndex === extended.length - 1) {
      setAnimate(false)
      setTrackIndex(1)
    }
  }

  return (
    <section
      className="pt-6 pb-14 lg:pt-10 lg:pb-20"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        <div className="relative overflow-hidden" style={{ height: 'clamp(420px, 72vh, 640px)' }}>
          {/* Sliding track — every image, including the centered one, rolls right-to-left */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(${PEEK_PCT}% - ${trackIndex * SLIDE_WIDTH_PCT}%))`,
              transition: animate
                ? `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((image, i) => {
              const realIndex = (((i - 1) % count) + count) % count
              return (
                <div
                  key={i}
                  className="relative h-full shrink-0 px-2 lg:px-3"
                  style={{ width: `${SLIDE_WIDTH_PCT}%` }}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl lg:rounded-3xl ${i !== trackIndex ? 'cursor-pointer' : ''}`}
                    onClick={() => i !== trackIndex && goTo(realIndex)}
                  >
                    {image?.asset?._ref ? (
                      <Image
                        src={urlFor(image).width(1600).height(1000).url()}
                        alt={image.alt ?? headline}
                        fill
                        priority={i === trackIndex}
                        className="object-cover"
                        sizes="(min-width: 1024px) 62vw, 90vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: 'var(--color-brand-dark)' }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fixed content overlay — headline & buttons stay put; only the imagery behind them slides */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 overflow-hidden rounded-2xl lg:rounded-3xl"
            style={{ left: `${PEEK_PCT}%`, width: `${SLIDE_WIDTH_PCT}%` }}
          >
            <div className="pointer-events-auto absolute inset-0 flex flex-col items-start justify-end px-8 pb-10 text-left lg:px-14 lg:pb-16">
              <div className="flex flex-col items-start sm:self-center">
                {location && (
                  <p
                    className="text-eyebrow mb-3"
                    style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
                  >
                    {location}
                  </p>
                )}

                <h1
                  className="heading-hero mb-6 max-w-xl"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 3rem)',
                    textShadow: '0 2px 20px rgba(0,0,0,0.65)',
                  }}
                >
                  {headline}
                </h1>

                <div className="flex flex-col flex-wrap items-start gap-4 sm:flex-row">
                  <Link href="/events" className="btn-pill">
                    {resolvedCtaText}
                  </Link>
                  <Link href="/wines" className="btn-pill-outline">
                    Explore Our Wines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots — manual override, autoplay resumes on its own */}
        {count > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? '1.5rem' : '0.5rem',
                  backgroundColor:
                    i === active
                      ? 'var(--color-brand-olive)'
                      : 'color-mix(in srgb, var(--color-brand-stone) 40%, transparent)',
                }}
              />
            ))}
          </div>
        )}

        {subheadline && <p className="sr-only">{subheadline}</p>}
      </div>
    </section>
  )
}
