// src/components/sections/AwardsList.tsx
// The /awards page body (Figma "Awards", 3322:7944): page header, vine
// ornament, every award as a row on a dark panel, symbol ornament, then the
// burgundy "taste the medal winners" banner. "See All Awards" on /news links here.
import Image from 'next/image'
import Link from 'next/link'
import { fig, mfig } from '@/lib/figmaScale'
import { urlFor } from '@/lib/sanity/image'
import { pick, type TextSource } from '@/lib/sanity/localize'
import type { Locale } from '@/i18n/config'
import type { AwardItem } from '@/types/sanity'
import type { NewsContent } from '@/lib/sanity/pageContent'
import { AwardMedal } from '@/components/ui/AwardMedal'
import { Ornament } from '@/components/ui/Ornament'

type Texts = NewsContent['awardsPage']

/** "Berliner Wine Trophy" → ["Berliner", "Wine Trophy"] */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/)
  return [first ?? '', rest.join(' ')]
}

const monts = (px: number, weight: number, tracking: number): React.CSSProperties => ({
  fontFamily: 'var(--font-montserrat)',
  fontWeight: weight,
  fontSize: mfig(px, px),
  letterSpacing: mfig(tracking, tracking),
  lineHeight: 'normal',
})

function AwardRow({ award, texts, locale }: { award: AwardItem; texts: Texts; locale: Locale }) {
  const src = award as unknown as TextSource
  const organization = pick(src, 'awardOrganization', locale) ?? award.title
  const tier = pick(src, 'awardTier', locale)
  const [orgFirst, orgRest] = splitName(organization)
  const wine = award.wine
  const wineName = wine?.name ?? pick(src, 'awardedWine', locale) ?? award.title
  const wineLine =
    pick(src, 'awardWineLine', locale) ??
    [wine?.grapeVariety, wine?.vintage].filter(Boolean).join(' · ')
  const description = pick(src, 'excerpt', locale)
  const image = wine?.mainImage?.asset?._ref ? wine.mainImage : award.featuredImage

  return (
    // Figma row: cream card, radius 12, 48px padding, three 320px columns
    // 56px apart (photo · text · medal), hairline along the bottom
    <article
      className="grid w-full grid-cols-1 items-center justify-items-center lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:justify-items-stretch"
      style={{
        maxWidth: fig(1168),
        padding: mfig(24, 48),
        gap: mfig(32, 56),
        borderRadius: '12px',
        backgroundColor: '#faf7ee',
        borderBottom: '1px solid rgba(26,29,23,0.14)',
      }}
    >
      {/* Wine photo — 320 × 340, radius 32 */}
      <div
        className="relative aspect-[320/340] w-full overflow-hidden"
        style={{ maxWidth: mfig(320, 320), borderRadius: mfig(24, 32), backgroundColor: '#f2eddd' }}
      >
        {image?.asset?._ref && (
          <Image
            src={urlFor(image).width(640).height(680).url()}
            alt={image.alt ?? wineName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 320px, 90vw"
          />
        )}
      </div>

      {/* Text column, items 22px apart */}
      <div className="flex w-full flex-col items-start" style={{ gap: mfig(18, 22) }}>
        {/* Competition: first word big, the rest + year in small caps */}
        <div
          className="flex flex-col"
          style={{ gap: '2px', color: '#7a2020', lineHeight: 'normal' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: mfig(20, 22),
            }}
          >
            {orgFirst}
          </p>
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 500,
              fontSize: mfig(12, 13),
              letterSpacing: mfig(1.5, 1.5),
            }}
          >
            {[orgRest, award.awardYear].filter(Boolean).join(' ')}
          </p>
        </div>

        <div className="flex flex-col" style={{ gap: '6px' }}>
          <h2
            className="uppercase"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: mfig(32, 42),
              lineHeight: 1,
              letterSpacing: mfig(2, 3),
              color: '#7a2020',
            }}
          >
            {wineName}
          </h2>
          {wineLine && (
            <p className="uppercase" style={{ ...monts(14, 600, 2.5), color: '#1a1d17' }}>
              {wineLine}
            </p>
          )}
        </div>

        {description && (
          <p
            style={{
              maxWidth: fig(340),
              fontFamily: 'var(--font-hanken)',
              fontWeight: 300,
              fontSize: mfig(15, 15),
              lineHeight: 1.6,
              color: '#4f4542',
            }}
          >
            {description}
          </p>
        )}

        <div className="flex flex-col uppercase" style={{ gap: '3px', color: '#1a1d17' }}>
          <p style={monts(11, 600, 2)}>{organization}</p>
          {tier && <p style={monts(11, 700, 2)}>{`${tier} ${texts.medalWord}`}</p>}
        </div>

        {wine?.slug?.current && (
          <Link
            href={`/wines/${wine.slug.current}`}
            className="uppercase transition-opacity duration-150 ease-out hover:opacity-[0.78]"
            style={{
              ...monts(11, 600, 2),
              paddingBottom: '4px',
              borderBottom: '1px solid #2e3a28',
              color: '#2e3a28',
            }}
          >
            {texts.discover} →
          </Link>
        )}
      </div>

      {/* Medal, centred in the third column */}
      <div className="flex w-full justify-center">
        <AwardMedal year={award.awardYear} name={orgFirst} subname={orgRest} tier={tier} />
      </div>
    </article>
  )
}

export function AwardsList({
  awards,
  texts,
  locale,
}: {
  awards: AwardItem[]
  /** From Studio → Pages → News & Awards Page → Awards Page */
  texts: Texts
  locale: Locale
}) {
  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content page-main">
        {/* Figma "Section Header": olive eyebrow, Playfair 44 title, Hanken 16 intro */}
        <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
          <p className="uppercase" style={{ ...monts(12, 600, 3), color: '#8a9572' }}>
            {texts.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: mfig(32, 44, 30),
              lineHeight: 'normal',
              color: '#1a1d17',
            }}
          >
            {texts.heading}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: mfig(15, 16, 14),
              lineHeight: 1.6,
              color: '#4f4542',
            }}
          >
            {texts.text}
          </p>
        </div>

        <Ornament variant="vine" />

        {/* Dark panel: 1296 wide, centred, 64px padding, rows 24px apart */}
        {awards.length > 0 && (
          <div
            className="mx-auto flex w-full flex-col items-center"
            style={{
              maxWidth: fig(1296),
              padding: mfig(12, 64),
              gap: mfig(12, 24),
              borderRadius: mfig(20, 32),
              backgroundColor: '#2b1713',
            }}
          >
            {awards.map((award) => (
              <AwardRow key={award._id} award={award} texts={texts} locale={locale} />
            ))}
          </div>
        )}

        <Ornament variant="symbol" />

        {/* Banner: burgundy, radius 32, 64px padding, 400 tall, text top /
            button bottom */}
        <div
          className="flex flex-col items-start justify-between"
          style={{
            minHeight: mfig(320, 400),
            padding: mfig(32, 64),
            gap: mfig(32, 48),
            borderRadius: mfig(20, 32),
            backgroundColor: '#4a0000',
          }}
        >
          <div className="flex flex-col" style={{ gap: '8px', maxWidth: fig(680) }}>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: mfig(26, 34),
                lineHeight: 'normal',
                color: '#faf7ee',
              }}
            >
              {texts.ctaHeading}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontWeight: 300,
                fontSize: mfig(14, 15),
                lineHeight: 'normal',
                color: '#ebd7d2',
              }}
            >
              {texts.ctaText}
            </p>
          </div>
          <Link
            href="/experiences"
            className="rounded-full uppercase transition-opacity duration-150 ease-out hover:opacity-90"
            style={{
              ...monts(12, 600, 1.6),
              paddingInline: '32px',
              paddingBlock: '16px',
              backgroundColor: '#faf7ee',
              color: '#7a2020',
            }}
          >
            {texts.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  )
}
