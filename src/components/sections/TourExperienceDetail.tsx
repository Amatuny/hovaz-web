// src/components/sections/TourExperienceDetail.tsx
// The /experiences/[slug] page body (Figma "experience" frame, node 722:13667).
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { EventCard } from '@/components/ui/EventCard'
import { DragScroll } from '@/components/ui/DragScroll'
import { TastingBookingForm, type TastingOption } from '@/components/ui/TastingBookingForm'
import type { JournalCard } from '@/lib/journal'
import type { Event, ExperienceTour, MenuItem, SanityImage } from '@/types/sanity'

interface TourExperienceDetailProps {
  tour: ExperienceTour
  typeBadge?: string
  bookingOptions: TastingOption[]
  journalCards: JournalCard[]
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: fig(12),
  letterSpacing: fig(3),
  color: 'rgba(93,110,82,0.92)',
}

const paragraphStyle: React.CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(18),
  lineHeight: fig(29.7),
  color: '#4f4542',
}

const badgeStyle: React.CSSProperties = {
  paddingInline: fig(14),
  paddingBlock: fig(6),
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: fig(10),
  letterSpacing: fig(1.2),
  color: '#fdfcf8',
}

function Photo({
  image,
  radius,
  sizes,
  style,
}: {
  image?: SanityImage
  radius: number
  sizes: string
  style?: React.CSSProperties
}) {
  return (
    <div className="relative overflow-hidden" style={{ borderRadius: fig(radius), ...style }}>
      {image?.asset?._ref ? (
        <Image
          src={urlFor(image).width(1000).url()}
          alt={image.alt ?? ''}
          fill
          className="object-cover"
          sizes={sizes}
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

// Big photo on the left spanning both rows, up to two stacked on the right.
// With fewer photos, the remaining ones stretch to fill the empty cells.
function galleryCell(index: number, count: number): React.CSSProperties {
  if (index === 0) return { gridColumn: count === 1 ? '1 / span 2' : '1', gridRow: '1 / span 2' }
  return { gridColumn: '2', gridRow: count === 2 ? '1 / span 2' : String(index) }
}

function Ornament({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <div className="flex items-center justify-center overflow-hidden" style={{ height: fig(100) }}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ width: fig(width), height: fig(height) }}
      />
    </div>
  )
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="flex items-center"
      style={{ minHeight: fig(212), padding: fig(16), gap: fig(24), borderRadius: fig(20) }}
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{
          width: fig(180),
          height: fig(180),
          borderRadius: fig(18),
          boxShadow: '0px 8px 24px 0px rgba(26,29,23,0.15)',
        }}
      >
        {item.image?.asset?._ref && (
          <Image
            src={urlFor(item.image).width(360).height(360).url()}
            alt={item.image.alt ?? item.dish}
            fill
            className="object-cover"
            sizes="180px"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col" style={{ gap: fig(6), maxWidth: fig(436) }}>
        {item.course && (
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 600,
              fontSize: fig(11),
              letterSpacing: fig(1.4),
              color: '#8a9572',
            }}
          >
            {item.course}
          </p>
        )}
        <h3
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(24),
            lineHeight: fig(30),
            color: '#1a1d17',
          }}
        >
          {item.dish}
        </h3>
        {item.pairing && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(14), color: '#4f4542' }}>
            {item.pairing}
          </p>
        )}
      </div>
    </div>
  )
}

function AddOnEventCard({ event }: { event: Event }) {
  const badge = event.estate?.name ?? event.location
  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="group relative block min-w-[250px] flex-[1_0_0] overflow-hidden"
      style={{
        height: fig(400),
        maxWidth: fig(517.33),
        borderRadius: fig(24),
        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
      }}
    >
      {event.mainImage?.asset?._ref ? (
        <Image
          src={urlFor(event.mainImage).width(1040).height(800).url()}
          alt={event.mainImage.alt ?? event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.37) 45%, rgba(0,0,0,0.82) 100%)',
        }}
      />
      {badge && (
        <span
          className="absolute rounded-full uppercase"
          style={{
            left: fig(24),
            top: fig(24),
            paddingInline: fig(14),
            paddingBlock: fig(6),
            backgroundColor: '#4a0000',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: fig(10),
            letterSpacing: fig(1.2),
            color: 'white',
          }}
        >
          {badge}
        </span>
      )}
      <h3
        className="absolute bottom-0 left-0"
        style={{
          padding: fig(24),
          maxWidth: fig(320),
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(19),
          lineHeight: fig(24.7),
          letterSpacing: fig(1.3),
          color: '#fdfcf8',
        }}
      >
        {event.title}
      </h3>
    </Link>
  )
}

export function TourExperienceDetail({
  tour,
  typeBadge,
  bookingOptions,
  journalCards,
}: TourExperienceDetailProps) {
  const estate = tour.estate
  const gallery = tour.gallery ?? []
  const aboutImages = gallery.slice(0, 3)
  const plateImages = gallery.slice(3, 6)
  const includes = (tour.includedServices ?? []).filter(Boolean)
  const menuItems = estate?.menuItems ?? []
  const menuLeft = menuItems.slice(0, Math.ceil(menuItems.length / 2))
  const menuRight = menuItems.slice(menuLeft.length)
  const addOnEvents = (tour.addOnEvents ?? []).filter((event) => event?.slug?.current)

  return (
    <div className="flex flex-col" style={{ gap: fig(82) }}>
      {/* Breadcrumb + estate heading */}
      <div className="flex flex-col" style={{ gap: fig(16) }}>
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#a8a290' }}>
          <Link href="/experiences" className="hover:underline">
            Experiences
          </Link>{' '}
          / <span style={{ color: '#4f4542' }}>{tour.title}</span>
        </p>
        {(estate?.tagline || estate?.name) && (
          <p
            className="capitalize"
            style={{
              maxWidth: fig(860),
              fontFamily: 'var(--font-playfair)',
              fontWeight: 500,
              fontSize: fig(44),
              letterSpacing: fig(2),
              color: 'black',
            }}
          >
            welcome to {estate.tagline ?? estate.name}
          </p>
        )}
      </div>

      {/* Hero banner */}
      <div
        className="relative flex w-full items-end overflow-hidden"
        style={{ height: fig(560), borderRadius: fig(28) }}
      >
        {tour.mainImage?.asset?._ref && (
          <Image
            src={urlFor(tour.mainImage).width(1600).height(560).url()}
            alt={tour.mainImage.alt ?? tour.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50.272%, rgba(0,0,0,0.52) 100%)',
          }}
        />
        <div className="relative flex flex-col" style={{ padding: fig(44), gap: fig(14) }}>
          {(estate?.name || typeBadge) && (
            <div className="flex" style={{ gap: fig(10) }}>
              {estate?.name && (
                <span
                  className="rounded-full uppercase"
                  style={{ ...badgeStyle, backgroundColor: 'var(--color-brand-olive)' }}
                >
                  {estate.name} Estate
                </span>
              )}
              {typeBadge && (
                <span
                  className="rounded-full uppercase"
                  style={{ ...badgeStyle, backgroundColor: 'rgba(253,252,248,0.15)' }}
                >
                  {typeBadge}
                </span>
              )}
            </div>
          )}
          <h1
            style={{
              maxWidth: fig(640),
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(44),
              letterSpacing: fig(0.5),
              color: '#fdfcf8',
            }}
          >
            {tour.title}
          </h1>
        </div>
      </div>

      <Ornament src="/wines/vine-divider.svg" width={677.469} height={78} />

      {/* About + booking */}
      <div className="flex flex-wrap items-start" style={{ gap: fig(82) }}>
        <div
          className="flex min-w-[min(432px,100%)] flex-[998_1_0] flex-col"
          style={{ gap: fig(40) }}
        >
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p className="uppercase" style={eyebrowStyle}>
              Experience
            </p>
            <h2
              className="capitalize"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fig(32),
                lineHeight: fig(40),
                color: '#1a1d17',
              }}
            >
              {tour.experienceHeading || tour.title}
            </h2>
            {tour.description && <p style={paragraphStyle}>{tour.description}</p>}
          </div>

          {aboutImages.length > 0 && (
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'minmax(0,648fr) minmax(0,338fr)',
                gridTemplateRows: `repeat(2, ${fig(240)})`,
                gap: fig(12),
              }}
            >
              {aboutImages.map((image, index) => (
                <Photo
                  key={image.asset._ref}
                  image={image}
                  radius={20}
                  sizes={
                    index === 0
                      ? '(max-width: 1024px) 66vw, 35vw'
                      : '(max-width: 1024px) 33vw, 18vw'
                  }
                  style={galleryCell(index, aboutImages.length)}
                />
              ))}
            </div>
          )}

          {plateImages.length > 0 && (
            <div className="flex flex-col" style={{ gap: fig(20) }}>
              {tour.includesHeading && (
                <h2
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 600,
                    fontSize: fig(26),
                    color: '#1a1d17',
                  }}
                >
                  {tour.includesHeading}
                </h2>
              )}
              <div className="flex" style={{ gap: fig(12) }}>
                {plateImages.map((image) => (
                  <Photo
                    key={image.asset._ref}
                    image={image}
                    radius={24}
                    sizes="(max-width: 1024px) 33vw, 18vw"
                    style={{ flex: '1 0 0', minWidth: 0, height: fig(220) }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <TastingBookingForm
          estateName={estate?.name ? `${estate.name} Estate` : 'HOVAZ'}
          options={bookingOptions}
          defaultValue={tour._id}
          foodOptions={estate?.foodOptions ?? []}
          minGuests={tour.minGroupSize ?? 1}
          maxGuests={tour.maxGroupSize ?? 12}
          ctaText={tour.ctaText ?? 'Reserve Your Seat'}
          width={520}
        />
      </div>

      {/* Includes */}
      {includes.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(24) }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(26),
              color: '#1a1d17',
            }}
          >
            Includes:
          </h2>
          <ul
            className="italic"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 300,
              fontSize: fig(18),
              lineHeight: fig(29.7),
              color: '#32180b',
            }}
          >
            {includes.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Menu */}
      {menuItems.length > 0 && (
        <div className="flex flex-col items-start" style={{ gap: fig(48) }}>
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p className="uppercase" style={eyebrowStyle}>
              Menu
            </p>
            <h2
              className="capitalize"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fig(36),
                letterSpacing: fig(0.5),
                color: '#1a1d17',
              }}
            >
              Make your visit even better — add something from our new menu
            </h2>
          </div>
          <div className="flex w-full flex-wrap" style={{ gap: fig(20) }}>
            {[menuLeft, menuRight].map((column, index) => (
              <div
                key={index}
                className="flex min-w-[min(420px,100%)] flex-[1_0_0] flex-col"
                style={{ gap: fig(20) }}
              >
                {column.map((item) => (
                  <MenuCard key={item._key} item={item} />
                ))}
              </div>
            ))}
          </div>
          {estate?.menuUrl && (
            <a
              href={estate.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center capitalize transition-colors hover:bg-[var(--color-brand-olive)] hover:text-[#fdfcf8]"
              style={{
                border: '1.5px solid var(--color-brand-olive)',
                borderRadius: fig(60),
                paddingInline: fig(64),
                paddingBlock: fig(12),
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: fig(16),
                lineHeight: fig(24),
                letterSpacing: fig(2),
                color: 'var(--color-brand-olive)',
              }}
            >
              See Full Menu →
            </a>
          )}
        </div>
      )}

      {/* Add-on events */}
      {addOnEvents.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(48) }}>
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <h2
              className="capitalize"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 500,
                fontSize: fig(36),
                letterSpacing: fig(0.5),
                color: 'black',
              }}
            >
              events you can add to your experience
            </h2>
            <p style={paragraphStyle}>
              If you&apos;re looking for something even more interesting, you can leave a comment
              and add one of these events to your bucket list.
            </p>
          </div>
          <div className="flex flex-wrap" style={{ gap: fig(24) }}>
            {addOnEvents.map((event) => (
              <AddOnEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Discover our events */}
      {journalCards.length > 0 && (
        <div className="flex flex-col" style={{ gap: fig(48) }}>
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <p className="uppercase" style={eyebrowStyle}>
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
            <p style={paragraphStyle}>
              From crisp whites picked at first light to reds aged slow in old oak — each wine
              carries the same terraces, the same hands, the same patience.
            </p>
          </div>

          <DragScroll className="flex snap-x" style={{ gap: fig(32) }}>
            {journalCards.slice(0, 5).map((card) => (
              <div key={card.key} className="shrink-0 snap-start" style={{ width: fig(320) }}>
                <EventCard card={card} />
              </div>
            ))}

            <Link
              href="/events"
              className="flex shrink-0 snap-start flex-col items-center justify-center overflow-hidden opacity-70 transition-opacity hover:opacity-90"
              style={{
                width: fig(320),
                height: fig(360),
                borderRadius: fig(24),
                padding: fig(32),
                background: 'linear-gradient(to bottom, #c59400 0%, #1f1804 99.99%)',
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
                    fontWeight: 500,
                    fontSize: fig(20),
                    lineHeight: fig(24),
                    color: 'white',
                  }}
                >
                  Explore the Complete Collection
                </p>
                <div
                  className="flex w-full items-center justify-center text-center uppercase"
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    height: fig(74),
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: 500,
                    fontSize: fig(18),
                    lineHeight: fig(24),
                    letterSpacing: fig(1.6),
                    color: 'white',
                  }}
                >
                  See all
                  <br />
                  events
                </div>
              </div>
            </Link>
          </DragScroll>
        </div>
      )}

      <Ornament src="/wines/collection-symbol.svg" width={666.622} height={83.3614} />
    </div>
  )
}
