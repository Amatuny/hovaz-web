// src/components/sections/AwardsRecognition.tsx
import Link from 'next/link'
import { fig } from '@/lib/figmaScale'
import type { NewsItem } from '@/types/sanity'
import { NEWS_DEFAULTS } from '@/content/defaults'

const INITIAL_COUNT = 3

const TIER_COLORS: Record<string, string> = {
  gold: '#997026',
  silver: '#787878',
  bronze: '#8c5a3c',
}

function tierColor(tier?: string) {
  const key = tier?.toLowerCase() ?? ''
  const match = Object.keys(TIER_COLORS).find((name) => key.includes(name))
  return match ? TIER_COLORS[match] : 'var(--color-brand-olive)'
}

function AwardCard({ award }: { award: NewsItem }) {
  const organization = award.awardOrganization ?? award.title
  const pill = [award.awardTier, award.awardYear].filter(Boolean).join(' · ')

  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ paddingInline: fig(28), paddingBlock: fig(44), gap: fig(18) }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: fig(84),
          height: fig(84),
          background: 'radial-gradient(circle, #faf7ee 0%, #f2eddd 100%)',
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(30),
          color: '#3d4a38',
        }}
        aria-hidden
      >
        {organization.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <p
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 500,
            fontSize: fig(18),
            color: '#1a1d17',
          }}
        >
          {organization}
        </p>
        {award.awardedWine && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#4f4542' }}>
            {award.awardedWine}
          </p>
        )}
      </div>
      {pill && (
        <span
          className="rounded-full uppercase"
          style={{
            paddingInline: fig(16),
            paddingBlock: fig(6),
            backgroundColor: tierColor(award.awardTier),
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: fig(10),
            letterSpacing: fig(1.5),
            color: '#fdfcf8',
          }}
        >
          {pill}
        </span>
      )}
    </div>
  )
}

export function AwardsRecognition({
  awards,
  texts = NEWS_DEFAULTS.awards,
}: {
  awards: NewsItem[]
  /** From News & Awards Page → Awards Block */
  texts?: typeof NEWS_DEFAULTS.awards
}) {
  // The first three here; "See All Awards" opens the full list on /awards
  const visible = awards.slice(0, INITIAL_COUNT)

  return (
    <div
      className="mx-auto flex w-full flex-col items-center"
      style={{ maxWidth: fig(1200), gap: fig(24) }}
    >
      <p
        className="text-center uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: fig(12),
          letterSpacing: fig(3),
          color: '#8a9572',
        }}
      >
        {texts.eyebrow}
      </p>
      <h2
        className="text-center"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(42),
          color: '#1a1d17',
        }}
      >
        {texts.heading}
      </h2>
      <div
        className="grid w-full grid-cols-1 sm:grid-cols-3"
        style={{ maxWidth: fig(1072), gap: fig(24) }}
      >
        {visible.map((award) => (
          <AwardCard key={award._id} award={award} />
        ))}
      </div>
      <Link
        href="/awards"
        className="capitalize text-[var(--color-brand-olive)] transition-colors duration-200 ease-out hover:bg-[rgba(46,58,40,0.15)] active:bg-[rgba(46,58,40,0.45)] active:duration-[60ms]"
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
        }}
      >
        {texts.showAll}
      </Link>
    </div>
  )
}
