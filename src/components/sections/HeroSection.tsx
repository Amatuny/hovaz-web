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

// Timing measured from the reference recording: a new slide every ~1.85s,
// moving on a soft spring (fast start, ~6% overshoot, settled by ~1s).
const AUTOPLAY_MS = 1850
const TRANSITION_MS = 1000
const SPRING_EASING =
  'linear(0, 0.053, 0.178, 0.337, 0.501, 0.652, 0.781, 0.883, 0.958, 1.009, 1.04, 1.056, 1.06, 1.057, 1.049, 1.04, 1.03, 1.021, 1.013, 1.007, 1.003, 0.999, 0.998, 0.997, 1)'

// Card sizes as shares of the carousel width, set per breakponumber through CSS
// variables: narrow | gap | wide | gap | narrow always adds up to 100%.
const NARROW = 'var(--narrow)'
const WIDE = 'var(--wide)'
const GAP = 'var(--gap)'
const STEP = `(${NARROW} + ${GAP})`

// Clones kept on each side of the real slides so neighbours always exist,
// whichever way the carousel moves.
const CLONES = 2

const mod = (n: number, m: number) => ((n % m) + m) % m

// Figma hero buttons on desktop: 48px tall (24 line + 12×2), 64px side
// padding, 16px text with 2px tracking.
const HERO_BUTTON =
  'lg:px-[calc(var(--figma-scale)*64px)] lg:py-[calc(var(--figma-scale)*12px)] lg:text-[calc(var(--figma-scale)*16px)] lg:leading-[calc(var(--figma-scale)*24px)] lg:tracking-[calc(var(--figma-scale)*2px)]'

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

  // [..last CLONES slides, ...real slides, ..first CLONES slides] — lets the
  // track keep rolling and then jump invisibly back onto the real slides.
  const extended = Array.from(
    { length: count + CLONES * 2 },
    (_, i) => slides[mod(i - CLONES, count)]
  )

  // Index into `extended` of the wide middle card.
  const [trackIndex, setTrackIndex] = useState(CLONES)
  const [animate, setAnimate] = useState(true)
  // Which way the last move went — decides which edge the middle card's photo
  // is pinned to (see the card markup below).
  const [forward, setForward] = useState(true)

  const active = mod(trackIndex - CLONES, count)

  // Autoplay never stops — the images keep rolling right-to-left on their own
  // while the headline and buttons stay fixed in the same spot on screen.
  useEffect(() => {
    if (count <= 1) return
    const id = setTimeout(() => {
      setAnimate(true)
      setForward(true)
      setTrackIndex((i) => i + 1)
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [trackIndex, count])

  const goTo = (index: number) => {
    setAnimate(true)
    setForward(index > trackIndex)
    setTrackIndex(index)
  }

  // Once the track settles on a clone, snap (with transitions off) to the
  // matching real slide so the loop never runs out of track. A timer rather
  // than transitionend, which browsers skip in background tabs.
  useEffect(() => {
    if (trackIndex >= CLONES && trackIndex < CLONES + count) return
    const id = setTimeout(() => {
      setAnimate(false)
      setTrackIndex(CLONES + mod(trackIndex - CLONES, count))
    }, TRANSITION_MS)
    return () => clearTimeout(id)
  }, [trackIndex, count])

  const transition = (properties: string[]) =>
    animate ? properties.map((p) => `${p} ${TRANSITION_MS}ms ${SPRING_EASING}`).join(', ') : 'none'

  return (
    <section
      className="pt-6 pb-14 lg:pt-10 lg:pb-20"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        <div
          className="relative overflow-hidden [container-type:inline-size] [--gap:2cqw] [--narrow:15cqw] [--wide:66cqw] lg:[--narrow:23cqw] lg:[--wide:50cqw]"
          style={{ height: 'clamp(420px, 72vh, 640px)' }}
        >
          {/* Sliding track — the middle card shrinks away to the left while the
              next one grows into its place. Every card left of the middle is
              narrow, so one step is always narrow + gap. */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(-1 * ${trackIndex - 1} * ${STEP}))`,
              transition: transition(['transform']),
            }}
          >
            {extended.map((image, i) => {
              const isActive = i === trackIndex
              // Only the middle card and its two neighbours are shown; cards
              // entering or leaving at the edges fade in and out.
              const isVisible = Math.abs(i - trackIndex) <= 1
              // Photos are never scaled: each is drawn at the wide card's size
              // and the card just reveals more or less of it. Pinning it to the
              // card's outer edge makes it slide with the card — right of the
              // middle it hangs off the right edge, left of it off the left.
              // The middle card keeps the pin it arrived with, so nothing jumps.
              const pinRight = i > trackIndex || (isActive && forward)
              return (
                <div
                  key={i}
                  className="relative h-full shrink-0"
                  style={{
                    width: isActive ? WIDE : NARROW,
                    marginRight: GAP,
                    opacity: isVisible ? 1 : 0,
                    transition: transition(['width', 'opacity']),
                  }}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl lg:rounded-3xl ${isActive ? '' : 'cursor-pointer'}`}
                    onClick={() => !isActive && goTo(i)}
                  >
                    <div
                      className="absolute inset-y-0"
                      style={{
                        // A little wider than the wide card so the spring's
                        // overshoot never uncovers an empty strip.
                        width: `calc(${WIDE} + 0.1 * (${WIDE} - ${NARROW}))`,
                        ...(pinRight ? { right: 0 } : { left: 0 }),
                      }}
                    >
                      {image?.asset?._ref ? (
                        <Image
                          src={urlFor(image).width(1600).height(1280).url()}
                          alt={image.alt ?? headline}
                          fill
                          priority={isVisible}
                          className="object-cover"
                          sizes="(min-width: 1024px) 50vw, 70vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: 'var(--color-brand-dark)' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fixed content overlay — headline & buttons stay put; only the imagery behind them slides */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 overflow-hidden rounded-2xl lg:rounded-3xl"
            style={{ left: `calc(${STEP})`, width: WIDE }}
          >
            {/* Desktop sizes are raw Figma px (1900 canvas) × --figma-scale.
                Left-aligned 64px in, buttons 116px above the card's bottom; the
                right side gets less padding so the two pills stay on one row. */}
            <div className="pointer-events-auto absolute inset-0 flex flex-col items-start justify-end px-8 pb-10 text-left lg:pr-[calc(var(--figma-scale)*32px)] lg:pb-[calc(var(--figma-scale)*116px)] lg:pl-[calc(var(--figma-scale)*64px)]">
              {location && (
                <p
                  className="text-eyebrow mb-3 lg:mb-[calc(var(--figma-scale)*26px)] lg:text-[calc(var(--figma-scale)*12px)] lg:tracking-[calc(var(--figma-scale)*3.6px)]"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}
                >
                  {location}
                </p>
              )}

              <h1
                className="heading-hero mb-6 text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.05] lg:mb-[calc(var(--figma-scale)*40px)] lg:text-[calc(var(--figma-scale)*64px)] lg:leading-[calc(var(--figma-scale)*62px)]"
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}
              >
                {headline}
              </h1>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap lg:gap-[calc(var(--figma-scale)*16px)]">
                <a href="#estates" className={`btn-pill ${HERO_BUTTON}`}>
                  {resolvedCtaText}
                </a>
                <Link href="/wines" className={`btn-pill-outline ${HERO_BUTTON}`}>
                  Explore Our Wines
                </Link>
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
                onClick={() => goTo(CLONES + i)}
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
