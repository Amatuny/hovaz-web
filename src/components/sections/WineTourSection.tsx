import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/types/sanity'

interface WineTourSectionProps {
  images: SanityImage[]
}

export function WineTourSection({ images }: WineTourSectionProps) {
  if (!images?.length) return null

  const [large, ...rest] = images
  const gridImages = rest.slice(0, 4)

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
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
          Wine Experience
        </p>
        <h2
          className="mb-4 max-w-[870px] capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.6vw, 36px)',
            color: '#1a1d17',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
          }}
        >
          Experience that will make you back to us
        </h2>
        <p
          className="mb-10 max-w-[860px]"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '26px',
            color: '#4f4542',
          }}
        >
          Small-group tastings and dinners in the cellar and among the vines, held through the
          harvest season.
        </p>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Large photo */}
          <div
            className="relative flex-1 overflow-hidden rounded-2xl lg:rounded-3xl"
            style={{ aspectRatio: '788 / 814' }}
          >
            <Image
              src={urlFor(large).width(900).height(950).url()}
              alt={large.alt ?? 'Wine experience'}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.7) 100%)',
              }}
            />
          </div>

          {/* 2x2 photo grid */}
          {gridImages.length > 0 && (
            <div className="grid flex-1 grid-cols-2 gap-6">
              {gridImages.map((image, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl lg:rounded-3xl"
                  style={{ aspectRatio: '382 / 395' }}
                >
                  <Image
                    src={urlFor(image).width(500).height(500).url()}
                    alt={image.alt ?? 'Wine experience'}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.65) 100%)',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 border-b-2 border-[#1a1d17] px-2 pb-1 transition-colors hover:border-[var(--color-brand-gold)]"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '1px',
              color: '#1a1d17',
            }}
          >
            <span className="capitalize transition-colors group-hover:text-[var(--color-brand-gold)]">
              Find your experience
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
