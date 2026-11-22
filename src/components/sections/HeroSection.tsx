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
  secondaryCtaText?: string
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
// Shift that centres the wide card: 0 on desktop (narrow+gap+wide+gap+narrow
// = 100%), negative on mobile where the side cards hang off the screen edges.
const CENTRE = `((100cqw - ${WIDE}) / 2 - ${GAP} - ${NARROW})`

// Clones kept on each side of the real slides so neighbours always exist,
// whichever way the carousel moves.
const CLONES = 2

const mod = (n: number, m: number) => ((n % m) + m) % m

// Figma hero buttons — mobile: 10px text, 24px line, 2px tracking, no
// vertical padding (27px pills with the 1.5px border); desktop: 16px text, 24px line + 12×2
// padding. Side padding lives in .hero-ctas so it can give way when the
// labels are long.
const HERO_BUTTON =
  'py-0 text-[10px] leading-6 tracking-[2px] lg:py-[calc(var(--figma-scale)*12px)] lg:text-[calc(var(--figma-scale)*16px)] lg:leading-[calc(var(--figma-scale)*24px)] lg:tracking-[calc(var(--figma-scale)*2px)]'

export function HeroSection({
  headline = 'More Than Wine Grows Here',
  subheadline = 'Discover HOVAZ Wine Rooms — where ancient tradition meets modern hospitality',
  location = 'Proshyan Valley, Armenia',
  ctaText,
  secondaryCtaText,
  gallery = [],
}: HeroSectionProps) {
  const resolvedCtaText = ctaText || 'Book Your Experience'
  const resolvedSecondaryCtaText = secondaryCtaText || 'Explore Our Wines'
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
    // No vertical padding of its own — .home-hero (48px under the header)
    // and the section stack's 32px top padding space it.
    <section style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        {/* Mobile (Figma 428 frame): edge to edge, 146 | 8 | 320 | 8 | 146
            cards × 255 tall, all as shares of the screen width. Tablet
            (Figma 1027 frame, 1024-1279px): also edge to edge, the desktop
            368 | 32 | 800 cards × 640 tall, × scale. Desktop (1280+): inside
            the column, 23 | 2 | 50 | 2 | 23 %. */}
        <div className="relative -mx-4 h-[59.58vw] overflow-hidden [container-type:inline-size] [--gap:1.869cqw] [--narrow:34.11cqw] [--wide:74.77cqw] sm:-mx-6 lg:-mx-[7.1vw] lg:h-[calc(var(--figma-scale)*640px)] lg:[--gap:calc(var(--figma-scale)*32px)] lg:[--narrow:calc(var(--figma-scale)*368px)] lg:[--wide:calc(var(--figma-scale)*800px)] xl:mx-0 xl:h-[clamp(420px,72vh,640px)] xl:[--gap:2cqw] xl:[--narrow:23cqw] xl:[--wide:50cqw]">
          {/* Sliding track — the middle card shrinks away to the left while the
              next one grows into its place. Every card left of the middle is
              narrow, so one step is always narrow + gap. */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(${CENTRE} - ${trackIndex - 1} * ${STEP}))`,
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
                    {/* Figma: every panel carries a top-to-bottom dark wash */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.55))',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fixed content overlay — headline & buttons stay put; only the imagery behind them slides */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 overflow-hidden rounded-2xl lg:rounded-3xl"
            style={{ left: `calc((100cqw - ${WIDE}) / 2)`, width: WIDE }}
          >
            {/* Desktop sizes are raw Figma px (1900 canvas) × --figma-scale.
                Figma "Container": 64px padding, items 28px apart, and the
                container itself ends 48px above the panel's bottom edge — so
                the buttons sit 48 + 64 = 112px up. The right side gets less
                padding so the two pills stay on one row. */}
            <div className="pointer-events-auto absolute inset-0 flex flex-col items-start justify-end p-4 text-left lg:pr-[calc(var(--figma-scale)*32px)] lg:pb-[calc(var(--figma-scale)*112px)] lg:pl-[calc(var(--figma-scale)*64px)]">
              {location && (
                <p
                  // Not in the mobile design — desktop only
                  className="text-eyebrow mb-3 hidden lg:block lg:mb-[calc(var(--figma-scale)*28px)] lg:text-[calc(var(--figma-scale)*12px)] lg:tracking-[calc(var(--figma-scale)*3px)]"
                  style={{ color: '#d4d0c0' }}
                >
                  {location}
                </p>
              )}

              <h1
                // Mobile Figma: Playfair SemiBold 32px (at 428), normal line
                // height, 1px tracking (from .heading-hero); 16px down to the buttons
                className="heading-hero mb-4 max-w-[calc(var(--figma-scale)*699px)] text-[7.477vw] leading-[normal] lg:mb-[calc(var(--figma-scale)*36px)] lg:text-[calc(var(--figma-scale)*60px)] lg:leading-[calc(var(--figma-scale)*63px)]"
              >
                {headline}
              </h1>

              {/* Stacked below lg, one row from lg up that never wraps — the
                  buttons stay in the same spot whatever the label/language. */}
              <div className="hero-ctas flex flex-col items-start gap-2 lg:flex-row lg:gap-[calc(var(--figma-scale)*16px)]">
                <a href="#estates" className={`btn-pill ${HERO_BUTTON}`}>
                  {resolvedCtaText}
                </a>
                <Link href="/wines" className={`btn-pill-outline ${HERO_BUTTON}`}>
                  {resolvedSecondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots — manual override, autoplay resumes on its own */}
        {count > 1 && (
          // Figma "Slider Controls": 48×4 bars, 16px apart
          // The row is exactly the 4px bar tall (as in Figma) so nothing below
          // shifts; each button's 16px hit area overhangs it by 6px each side.
          <div className="mt-8 flex h-1 items-center justify-center gap-4 lg:mt-[82px]">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(CLONES + i)}
                aria-label={`Go to slide ${i + 1}`}
                // 4px bar inside a taller hit area
                className="-my-1.5 flex h-4 w-12 cursor-pointer items-center"
              >
                <span
                  className="block h-1 w-full rounded-[24px] transition-colors duration-300"
                  style={{ backgroundColor: i === active ? '#2e3a28' : 'rgba(0,0,0,0.5)' }}
                />
              </button>
            ))}
          </div>
        )}

        {subheadline && <p className="sr-only">{subheadline}</p>}
      </div>
    </section>
  )
}
