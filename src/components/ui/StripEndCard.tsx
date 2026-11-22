// src/components/ui/StripEndCard.tsx
// Figma "Shop All Card" — the last card in the homepage Wines, Events and
// Journal carousels: icon, two-line heading and a two-line boxed button,
// 16px apart in a 208px column. Each strip has its own size and colour.
import Link from 'next/link'
import Image from 'next/image'
import { fig } from '@/lib/figmaScale'

type Variant = 'wines' | 'events' | 'news'

const VARIANTS: Record<Variant, React.CSSProperties> = {
  // 320×480, radius 60, amber → near-black — scaled with the wine cards
  // beside it (same 250px floor ratio as WineCard)
  wines: {
    width: 'max(229px, calc(var(--figma-scale) * 320px))',
    aspectRatio: '320 / 480',
    borderRadius: fig(60),
    background: 'linear-gradient(to bottom, #bf9363, #1d1308)',
  },
  // Same width as the event cards (--card-w from .event-strip), 320:360,
  // gold → near-black at 70% opacity
  events: {
    width: 'var(--card-w)',
    aspectRatio: '320 / 360',
    borderRadius: 'calc(var(--card-w) * 0.075)',
    background: 'linear-gradient(to bottom, #c59400, #1f1804 99.99%)',
    opacity: 0.7,
  },
  // Same size as a NewsCard, flat grey
  news: {
    width: fig(400),
    height: fig(280),
    borderRadius: fig(24),
    backgroundColor: '#6c6969',
  },
}

interface StripEndCardProps {
  href: string
  variant: Variant
  /** Two lines separated by a line break (from Studio) */
  heading: string
  button: string
}

const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

export function StripEndCard({ href, variant, heading, button }: StripEndCardProps) {
  return (
    // Only the boxed button navigates — the card itself is not a link.
    <div
      className="flex shrink-0 snap-start items-center justify-center self-start"
      style={{ padding: fig(32), ...VARIANTS[variant] }}
    >
      {/* Inner column scales with --figma-scale so it still fits the news
          variant, whose card shrinks with the viewport. */}
      <span
        className="flex max-w-full flex-col items-center justify-center text-center text-white"
        style={{ width: fig(208), gap: fig(16) }}
      >
        <span className="relative shrink-0" style={{ width: fig(37), height: fig(37) }}>
          <Image src="/home/strip-end-icon.svg" alt="" aria-hidden="true" fill />
        </span>
        <span
          className="flex flex-col"
          style={{
            // Figma: EB Garamond — Regular on the wines card, Medium on the others
            fontFamily: 'var(--font-eb-garamond), var(--font-armenian), var(--font-serif), serif',
            fontWeight: variant === 'wines' ? 400 : 500,
            fontSize: fig(20),
            lineHeight: fig(24),
          }}
        >
          {lines(heading).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </span>
        <Link
          href={href}
          className="flex w-full flex-col items-center justify-center border border-white/30 uppercase transition-colors hover:bg-white/10"
          style={{
            height: fig(74),
            fontFamily: 'var(--font-hanken)',
            fontWeight: 500,
            fontSize: fig(18),
            lineHeight: fig(24),
            letterSpacing: fig(1.6),
          }}
        >
          {lines(button).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </Link>
      </span>
    </div>
  )
}
