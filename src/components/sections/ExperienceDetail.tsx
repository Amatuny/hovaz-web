// src/components/sections/ExperienceDetail.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { EventCard } from '@/components/ui/EventCard'
import { ReservationForm } from '@/components/ui/ReservationForm'
import type { JournalCard } from '@/lib/journal'
import type { SanityImage } from '@/types/sanity'
import type { BookingInput } from '@/lib/validations/booking'

interface ExperienceDetailProps {
  title: string
  estateTagline?: string
  mainImage?: SanityImage
  estateBadge?: string
  typeBadge?: string
  dateLocationLabel?: string
  description?: string
  aboutImages: SanityImage[]
  includesHeading?: string
  includesImages: SanityImage[]
  reservation: {
    experienceType: BookingInput['experienceType']
    location: string
    duration?: string
    dateTimeLabel?: string
    fixedDate?: string
    minGuests?: number
    maxGuests?: number
    ctaText?: string
  }
  journalCards: JournalCard[]
}

function SectionHeading({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: fig(12),
          letterSpacing: fig(3),
          color: 'rgba(93,110,82,0.92)',
        }}
      >
        {eyebrow}
      </p>
      <h2
        className="capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(32),
          letterSpacing: fig(0.5),
          color: '#1a1d17',
        }}
      >
        {heading}
      </h2>
    </div>
  )
}

function ImageBlock({
  image,
  className,
  style,
}: {
  image?: SanityImage
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ''}`}
      style={{ borderRadius: fig(20), ...style }}
    >
      {image?.asset?._ref ? (
        <Image
          src={urlFor(image).width(900).height(900).url()}
          alt={image.alt ?? ''}
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
}

export function ExperienceDetail({
  title,
  estateTagline,
  mainImage,
  estateBadge,
  typeBadge,
  dateLocationLabel,
  description,
  aboutImages,
  includesHeading,
  includesImages,
  reservation,
  journalCards,
}: ExperienceDetailProps) {
  return (
    <div className="flex flex-col" style={{ gap: fig(82) }}>
      {/* Breadcrumb + estate context heading */}
      <div className="flex flex-col" style={{ gap: fig(16) }}>
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#a8a290' }}>
          Experiences / <span style={{ color: '#4f4542' }}>{title}</span>
        </p>
        {estateTagline && (
          <h1
            className="capitalize"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(44),
              letterSpacing: fig(0.5),
              color: '#1a1d17',
              maxWidth: fig(860),
            }}
          >
            welcome to {estateTagline}
          </h1>
        )}
      </div>

      {/* Hero banner */}
      <div
        className="relative flex w-full items-end overflow-hidden"
        style={{ height: fig(580), borderRadius: fig(28) }}
      >
        {mainImage?.asset?._ref && (
          <Image
            src={urlFor(mainImage).width(1600).height(900).url()}
            alt={mainImage.alt ?? title}
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
            {estateBadge && (
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
                {estateBadge}
              </span>
            )}
            {typeBadge && (
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
                {typeBadge}
              </span>
            )}
          </div>
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
            {title}
          </p>
          {dateLocationLabel && (
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontWeight: 500,
                fontSize: fig(15),
                letterSpacing: fig(0.5),
                color: '#f0ede2',
              }}
            >
              {dateLocationLabel}
            </p>
          )}
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

      {/* About + reservation */}
      <div className="flex flex-wrap items-start" style={{ gap: fig(82) }}>
        <div
          className="flex min-w-[432px] flex-[1_0_0] flex-col justify-between"
          style={{ gap: fig(32) }}
        >
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <SectionHeading eyebrow="Experience" heading="About the Experience" />
            {description && (
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: fig(18),
                  lineHeight: fig(29.7),
                  color: '#4f4542',
                }}
              >
                {description}
              </p>
            )}
          </div>

          {aboutImages.length > 0 && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                gridTemplateRows: 'repeat(2, minmax(0,1fr))',
                height: fig(492),
                gap: fig(12),
              }}
            >
              {aboutImages[0] && (
                <ImageBlock
                  image={aboutImages[0]}
                  style={{ gridColumn: '1', gridRow: '1 / span 2' }}
                />
              )}
              {aboutImages[1] && (
                <ImageBlock image={aboutImages[1]} style={{ gridColumn: '2', gridRow: '1' }} />
              )}
              {aboutImages[2] && (
                <ImageBlock image={aboutImages[2]} style={{ gridColumn: '2', gridRow: '2' }} />
              )}
            </div>
          )}
        </div>

        <ReservationForm experienceTitle={title} {...reservation} />
      </div>

      {/* Includes */}
      {includesHeading && includesImages.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(48) }}>
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: fig(12),
                letterSpacing: fig(3),
                textTransform: 'uppercase',
                color: 'rgba(93,110,82,0.92)',
              }}
            >
              Experience
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fig(26),
                color: '#1a1d17',
              }}
            >
              {includesHeading}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: fig(12), height: fig(276) }}>
            {includesImages.map((image, i) => (
              <ImageBlock
                key={image.asset._ref ?? i}
                image={image}
                className="min-w-px flex-[1_0_0]"
                style={{ borderRadius: fig(24) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discover Our Events */}
      {journalCards.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(48) }}>
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: fig(12),
                letterSpacing: fig(3),
                color: 'rgba(93,110,82,0.92)',
              }}
            >
              Journal
            </p>
            <h2
              className="capitalize"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 500,
                fontSize: fig(32),
                letterSpacing: fig(2),
                color: 'black',
              }}
            >
              discover Our events
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(18),
                lineHeight: fig(29.7),
                color: '#4f4542',
              }}
            >
              From crisp whites picked at first light to reds aged slow in old oak — each wine
              carries the same terraces, the same hands, the same patience.
            </p>
          </div>

          <div className="flex flex-wrap items-start" style={{ gap: fig(32) }}>
            {journalCards.slice(0, 5).map((card) => (
              <div key={card.key} style={{ width: fig(320) }}>
                <EventCard card={card} />
              </div>
            ))}

            <Link
              href="/events"
              className="flex shrink-0 flex-col items-center justify-center overflow-hidden"
              style={{
                width: fig(320),
                height: fig(400),
                borderRadius: fig(24),
                padding: fig(32),
                background: 'linear-gradient(to bottom, #c59400 0%, #1f1804 99.99%)',
                opacity: 0.9,
              }}
            >
              <div className="flex flex-col items-center" style={{ gap: fig(16), width: fig(208) }}>
                <Image
                  src="/events/collection-icon.svg"
                  alt=""
                  width={37}
                  height={37}
                  style={{ width: fig(37), height: fig(37) }}
                />
                <p
                  className="text-center"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: fig(20),
                    lineHeight: fig(24),
                    color: 'white',
                  }}
                >
                  Explore the Complete Collection
                </p>
                <div
                  className="flex items-center justify-center text-center uppercase"
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    height: fig(74),
                    width: '100%',
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 500,
                    fontSize: fig(18),
                    letterSpacing: fig(1.6),
                    color: 'white',
                  }}
                >
                  See All Events
                </div>
              </div>
            </Link>
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
