// src/app/not-found.tsx
import Link from 'next/link'
import Image from 'next/image'
import { getNextUpcomingEvent } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import type { Event } from '@/types/sanity'

// "Oct 18 · 19:30" — the Next Up card's date line. Pinned to Yerevan time so
// the venue's local time shows regardless of the server's timezone (UTC on Vercel).
const TIME_ZONE = 'Asia/Yerevan'

function formatNextUpDate(startDate?: string) {
  if (!startDate) return null
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: TIME_ZONE,
  })
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  })
  return `${day} · ${time}`
}

const pillBase =
  'inline-flex h-10 items-center justify-center rounded-full px-12 whitespace-nowrap transition-colors duration-300'
const pillText = {
  fontFamily: 'var(--font-hanken)',
  fontWeight: 600,
  fontSize: '14px',
  letterSpacing: '1.25px',
} as const

export default async function NotFound() {
  // A Sanity hiccup must never turn the 404 into a 500 — just drop the card.
  const event = await getNextUpcomingEvent().catch(() => null)

  return (
    <section
      className="flex min-h-[80vh] flex-col items-center px-4 pt-24 pb-16 text-center sm:pt-28"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <p
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: 'clamp(72px, 8vw, 120px)',
          lineHeight: 1,
          color: 'var(--color-brand-olive)',
        }}
      >
        404
      </p>
      <h1
        className="mt-3"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: 'clamp(26px, 2.4vw, 36px)',
          lineHeight: 1.2,
          color: '#1a1d17',
        }}
      >
        This page doesn&apos;t exist
      </h1>
      <p
        className="mt-6"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontSize: '15px',
          lineHeight: '24px',
          color: '#4f4542',
        }}
      >
        While this page went missing, our next tasting hasn&apos;t.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className={`${pillBase} text-white hover:bg-[var(--color-brand-forest)]`}
          style={{ ...pillText, backgroundColor: 'var(--color-brand-olive)' }}
        >
          Back To Home
        </Link>
        <Link
          href="/events"
          className={`${pillBase} border-[1.5px] border-[var(--color-brand-olive)] text-[var(--color-brand-olive)] hover:bg-[#dcdbd1]`}
          style={pillText}
        >
          See Upcoming Events
        </Link>
      </div>

      {event && <NextUpCard event={event} />}

      <Image
        src="/about/ornament-bottom.svg"
        alt=""
        width={666.622}
        height={83.3613}
        className="mt-16 h-auto w-full max-w-[666px]"
      />
    </section>
  )
}

function NextUpCard({ event }: { event: Event }) {
  const href = `/events/${event.slug.current}`
  const dateLabel = formatNextUpDate(event.startDate)
  const place = event.estate?.name ?? event.location
  const meta = [dateLabel, place].filter(Boolean).join(' — ')

  return (
    <article className="mt-14 flex w-full max-w-[770px] flex-col overflow-hidden rounded-[20px] bg-white text-left shadow-[0_12px_32px_rgba(26,29,23,0.08)] sm:flex-row">
      <div className="relative aspect-[324/220] shrink-0 sm:aspect-auto sm:w-[42%]">
        {event.mainImage?.asset?._ref ? (
          <Image
            src={urlFor(event.mainImage).width(660).height(440).url()}
            alt={event.mainImage.alt ?? event.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 330px"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
          />
        )}
      </div>

      <div className="flex flex-col justify-center gap-2 px-8 py-8 sm:py-10">
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          Next Up
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 500,
            fontSize: '22px',
            lineHeight: 1.25,
            color: '#1a1d17',
          }}
        >
          {event.title}
        </h2>
        {meta && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: '13px', color: '#4f4542' }}>
            {meta}
          </p>
        )}
        <Link
          href={href}
          className="group mt-2 inline-flex items-center gap-2 self-start uppercase transition-colors hover:text-[var(--color-brand-gold)]"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: '12px',
            letterSpacing: '0.5px',
            color: '#1a1d17',
          }}
        >
          Reserve Your Seat
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  )
}
