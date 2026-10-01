// src/components/sections/ExperiencesEstateSwitcher.tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import type { Estate, Tour } from '@/types/sanity'

interface ExperiencesEstateSwitcherProps {
  estates: Estate[]
  tours: Tour[]
}

function estateLabel(estate: Estate) {
  return estate.tagline || estate.name
}

function formatPrice(tour: Tour) {
  const price =
    tour.priceNote || (tour.pricePerPerson ? `$${tour.pricePerPerson} per person` : null)
  return [tour.duration, price].filter(Boolean).join(' · ')
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center justify-center rounded-full capitalize transition-colors hover:bg-[var(--color-brand-olive)] hover:text-[#fdfcf8]"
      style={{
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: 'var(--color-brand-olive)',
        paddingInline: fig(64),
        paddingBlock: fig(12),
        gap: fig(8),
        fontFamily: 'var(--font-hanken)',
        fontWeight: 600,
        fontSize: fig(16),
        letterSpacing: fig(2),
        color: 'var(--color-brand-olive)',
      }}
    >
      {children}
    </Link>
  )
}

export function ExperiencesEstateSwitcher({ estates, tours }: ExperiencesEstateSwitcherProps) {
  const [selectedId, setSelectedId] = useState(estates[0]?._id)
  const selectedEstate = estates.find((e) => e._id === selectedId) ?? estates[0]

  const estateTours = useMemo(
    () => tours.filter((tour) => tour.estate?._id === selectedEstate?._id),
    [tours, selectedEstate]
  )

  const featuredTour = estateTours.find((t) => t.featured) ?? estateTours[0]

  const galleryImages = useMemo(
    () => (selectedEstate?.gallery ?? []).filter((img) => img?.asset?._ref).slice(0, 5),
    [selectedEstate]
  )

  if (!selectedEstate) return null

  return (
    <div className="flex flex-col" style={{ gap: fig(82) }}>
      {/* Breadcrumb + estate switcher */}
      <div className="flex flex-col" style={{ gap: fig(16) }}>
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#a8a290' }}>
          Experiences / <span style={{ color: '#4f4542' }}>{estateLabel(selectedEstate)}</span>
        </p>

        <div className="flex flex-col" style={{ maxWidth: fig(860), gap: fig(16) }}>
          <h1
            className="capitalize"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(32),
              letterSpacing: fig(0.5),
              color: '#1a1d17',
            }}
          >
            Choose your estate
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: fig(18),
              lineHeight: fig(29.7),
              color: '#4f4542',
            }}
          >
            Two terroirs, two rhythms — pick the estate, then the tasting that suits you.
          </p>
        </div>

        <div
          className="inline-flex w-fit items-center rounded-full"
          style={{ backgroundColor: '#d4ceb9', padding: fig(8), gap: fig(8) }}
        >
          {estates.map((estate) => {
            const active = estate._id === selectedEstate._id
            return (
              <button
                key={estate._id}
                type="button"
                onClick={() => setSelectedId(estate._id)}
                className="cursor-pointer whitespace-nowrap rounded-full transition-colors"
                style={{
                  paddingInline: fig(32),
                  paddingBlock: fig(16),
                  fontFamily: 'var(--font-hanken)',
                  fontWeight: 600,
                  fontSize: fig(16),
                  backgroundColor: active ? 'var(--color-brand-olive)' : 'transparent',
                  color: active ? '#fdfcf8' : '#1a1d17',
                }}
              >
                {estateLabel(estate)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Hero banner */}
      <div className="flex flex-col" style={{ gap: fig(82) }}>
        <h2
          className="capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(44),
            letterSpacing: fig(0.5),
            color: '#1a1d17',
          }}
        >
          welcome to {estateLabel(selectedEstate)}
        </h2>

        <div
          className="relative flex w-full items-end overflow-hidden"
          style={{ height: fig(580), borderRadius: fig(28) }}
        >
          {(selectedEstate.heroImage ?? selectedEstate.mainImage)?.asset?._ref && (
            <Image
              src={urlFor(selectedEstate.heroImage ?? selectedEstate.mainImage)
                .width(1600)
                .height(900)
                .url()}
              alt={selectedEstate.heroHeading ?? selectedEstate.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.52) 100%)',
            }}
          />

          <div className="relative flex flex-col" style={{ padding: fig(44), gap: fig(14) }}>
            <div className="flex" style={{ gap: fig(10) }}>
              <span
                className="rounded-full uppercase"
                style={{
                  paddingInline: fig(14),
                  paddingBlock: fig(6),
                  backgroundColor: 'var(--color-brand-olive)',
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: fig(10),
                  letterSpacing: fig(1.2),
                  color: '#fdfcf8',
                }}
              >
                {selectedEstate.name} Estate
              </span>
              {featuredTour?.tourType && (
                <span
                  className="rounded-full uppercase"
                  style={{
                    paddingInline: fig(14),
                    paddingBlock: fig(6),
                    backgroundColor: 'rgba(253,252,248,0.15)',
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: fig(10),
                    letterSpacing: fig(1.2),
                    color: '#fdfcf8',
                  }}
                >
                  {featuredTour.tourType.replace(/_/g, ' ')}
                </span>
              )}
            </div>
            {selectedEstate.heroHeading && (
              <p
                style={{
                  maxWidth: fig(640),
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 600,
                  fontSize: fig(44),
                  letterSpacing: fig(0.5),
                  color: '#fdfcf8',
                }}
              >
                {selectedEstate.heroHeading}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center overflow-hidden">
        <Image
          src="/wines/vine-divider.svg"
          alt=""
          width={677}
          height={78}
          className="h-auto w-full"
          style={{ maxWidth: fig(420) }}
        />
      </div>

      {/* What to expect */}
      <div className="flex flex-col" style={{ gap: fig(24) }}>
        <h2
          className="capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(44),
            letterSpacing: fig(0.5),
            color: '#1a1d17',
          }}
        >
          What To Expect
        </h2>
        <div className="flex flex-col" style={{ maxWidth: fig(860), gap: fig(16) }}>
          <p
            className="capitalize"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(36),
              letterSpacing: fig(0.5),
              color: '#1a1d17',
            }}
          >
            Three Experiences, One Estate
          </p>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: fig(18),
              lineHeight: fig(29.7),
              color: '#4f4542',
            }}
          >
            Whether you have an hour or an evening, there&apos;s a way to taste Hovaz that fits —
            from a quick discovery tasting to our full signature experience with the winemaker.
          </p>
        </div>
      </div>

      {/* Experience packages — alternating image side */}
      {estateTours.map((tour, index) => {
        const imageFirst = index % 2 === 0
        const image = (
          <div
            className="relative min-h-[420px] flex-[630_0_0] overflow-hidden"
            style={{ height: fig(460) }}
          >
            {tour.mainImage?.asset?._ref ? (
              <Image
                src={urlFor(tour.mainImage).width(900).height(900).url()}
                alt={tour.mainImage.alt ?? tour.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
              />
            )}
          </div>
        )
        const content = (
          <div
            className="flex min-w-[432px] flex-[682_0_0] flex-col justify-center"
            style={{ height: fig(460), padding: fig(56) }}
          >
            <div className="flex flex-col items-start" style={{ gap: fig(16) }}>
              <p
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 600,
                  fontSize: fig(32),
                  lineHeight: fig(40),
                  color: '#1a1d17',
                }}
              >
                {tour.title}
              </p>
              <p
                className="italic"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 700,
                  fontSize: fig(20),
                  lineHeight: fig(40),
                  color: '#1a1d17',
                }}
              >
                {formatPrice(tour)}
              </p>
              {tour.description && (
                <p
                  style={{
                    maxWidth: fig(570),
                    fontFamily: 'var(--font-hanken)',
                    fontSize: fig(16),
                    lineHeight: fig(25.6),
                    color: '#4f4542',
                  }}
                >
                  {tour.description}
                </p>
              )}
              <OutlineButton href={`/experiences/${tour.slug.current}`}>Learn More →</OutlineButton>
            </div>
          </div>
        )

        return (
          <div
            key={tour._id}
            className="flex flex-wrap overflow-hidden bg-white"
            style={{ borderRadius: fig(32), boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
          >
            {imageFirst ? (
              <>
                {image}
                {content}
              </>
            ) : (
              <>
                {content}
                {image}
              </>
            )}
          </div>
        )
      })}

      {/* Gallery mosaic */}
      {galleryImages.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(48) }}>
          <p
            className="capitalize"
            style={{
              maxWidth: fig(860),
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(32),
              letterSpacing: fig(0.5),
              color: '#1a1d17',
            }}
          >
            Gallery from the &ldquo;Days with Us&rdquo; series
          </p>
          <div className="grid grid-cols-5 grid-rows-2" style={{ height: fig(492), gap: fig(12) }}>
            {galleryImages.map((image, index) => {
              const gridArea =
                index === 0
                  ? '1 / 1 / 3 / 3' // big square, cols 1-2, rows 1-2
                  : index === 1
                    ? '1 / 3 / 2 / 4' // col 3, row 1
                    : index === 2
                      ? '2 / 3 / 3 / 5' // cols 3-4, row 2
                      : index === 3
                        ? '1 / 4 / 2 / 6' // cols 4-5, row 1
                        : '2 / 5 / 3 / 6' // col 5, row 2
              return (
                <div
                  key={image.asset._ref}
                  className="relative overflow-hidden"
                  style={{ gridArea, borderRadius: fig(24) }}
                >
                  <Image
                    src={urlFor(image).width(700).height(700).url()}
                    alt={image.alt ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Closing symbol */}
      <div className="flex items-center justify-center overflow-hidden">
        <Image
          src="/wines/collection-symbol.svg"
          alt=""
          width={667}
          height={83}
          className="h-auto w-full"
          style={{ maxWidth: fig(380) }}
        />
      </div>
    </div>
  )
}
