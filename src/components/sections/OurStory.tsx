// src/components/sections/OurStory.tsx
// The /about/our-story page body (Figma "About" frame, node 722:12726).
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { fig } from '@/lib/figmaScale'
import { OUR_STORY_DEFAULTS } from '@/content/defaults'
import type { OurStoryContent } from '@/lib/sanity/pageContent'

const INK = '#1a1d17'
const BODY = '#4f4542'
const SAGE = '#8a9572'
const CARD_DARK = '#231814'
const CARD_TEXT = '#f1eeeb'

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: fig(12),
  letterSpacing: fig(3),
  color: 'rgba(93,110,82,0.92)',
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(16),
  lineHeight: fig(28),
  color: BODY,
}

// All texts, lists and photos come from Studio → Pages → Our Story Page
// (see resolveOurStoryContent); the photos below are used while it has none.

/** Splits a text field into paragraphs on empty lines. */
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

/** Splits a text field into its lines. */
const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

// Built-in team photos, matched by position to the built-in team members.
// `imageFrame` reproduces Figma's zoomed crop where it isn't a plain cover-fit.
const DEFAULT_TEAM_PHOTOS: {
  src: string
  imageClass?: string
  imageFrame?: CSSProperties
}[] = [
  { src: '/about/team-lilit.png', imageClass: 'object-cover object-[center_25%]' },
  {
    src: '/about/team-nelli.jpg',
    imageFrame: {
      width: '111.78%',
      height: '214.6%',
      left: '-11.87%',
      top: '-66.11%',
      right: 'auto',
      bottom: 'auto',
    },
  },
  { src: '/about/team-sirvard.jpg' },
]

/** Content used when the page is rendered without Sanity data. */
const DEFAULT_CONTENT: OurStoryContent = {
  intro: OUR_STORY_DEFAULTS.intro,
  heroImage: undefined,
  beginning: OUR_STORY_DEFAULTS.beginning,
  timeline: OUR_STORY_DEFAULTS.timeline,
  mosaicMain: undefined,
  mosaicSmall1: undefined,
  mosaicSmall2: undefined,
  mosaicCard1: OUR_STORY_DEFAULTS.mosaicCard1,
  mosaicCard2: OUR_STORY_DEFAULTS.mosaicCard2,
  values: OUR_STORY_DEFAULTS.values,
  valueItems: OUR_STORY_DEFAULTS.valueItems,
  milestones: OUR_STORY_DEFAULTS.milestones,
  milestoneItems: OUR_STORY_DEFAULTS.milestoneItems,
  principles: OUR_STORY_DEFAULTS.principles,
  principleItems: OUR_STORY_DEFAULTS.principleItems,
  team: OUR_STORY_DEFAULTS.team,
  teamMembers: undefined,
}

function SectionHead({
  eyebrow,
  title,
  as: Heading = 'h2',
}: {
  eyebrow?: string
  title: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="flex w-full flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
      {eyebrow && (
        <p className="uppercase" style={eyebrowStyle}>
          {eyebrow}
        </p>
      )}
      <Heading
        className="capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(Heading === 'h1' ? 44 : 36),
          letterSpacing: fig(0.5),
          lineHeight: 1.33,
          color: INK,
        }}
      >
        {title}
      </Heading>
    </div>
  )
}

function Ornament({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center overflow-hidden"
      style={{ height: fig(100) }}
    >
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

function DarkCard({
  eyebrow,
  title,
  children,
  className = '',
}: {
  eyebrow: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex flex-col justify-center ${className}`}
      style={{ backgroundColor: CARD_DARK, borderRadius: fig(24), padding: fig(64), gap: fig(16) }}
    >
      <p className="uppercase" style={{ ...eyebrowStyle, color: '#e5987d' }}>
        {eyebrow}
      </p>
      <h3
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(30),
          lineHeight: 1.33,
          color: CARD_TEXT,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontSize: fig(16),
          lineHeight: 1.65,
          color: CARD_TEXT,
        }}
      >
        {children}
      </p>
    </div>
  )
}

export function OurStory({ content = DEFAULT_CONTENT }: { content?: OurStoryContent }) {
  const c = content

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div
        className="container-content flex flex-col items-center pt-12"
        style={{ gap: fig(82), paddingBottom: fig(82) }}
      >
        <div className="w-full">
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <SectionHead as="h1" eyebrow={c.intro.eyebrow} title={c.intro.heading} />
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(18),
                lineHeight: fig(29.7),
                color: BODY,
              }}
            >
              {c.intro.text}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col" style={{ maxWidth: fig(1200), gap: fig(82) }}>
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '1200 / 568', borderRadius: fig(24) }}
          >
            <Image
              src={c.heroImage?.src ?? '/about/hero-cellar.png'}
              alt={
                c.heroImage
                  ? c.heroImage.alt
                  : 'Stainless steel tanks and oak barrels in the HOVAZ cellar'
              }
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>

          <Ornament src="/wines/vine-divider.svg" width={677.469} height={78} />

          {/* The beginning */}
          <section className="flex flex-col" style={{ gap: fig(48) }}>
            <SectionHead eyebrow={c.beginning.eyebrow} title={c.beginning.heading} />
            <div className="flex flex-col" style={{ gap: fig(24) }}>
              <div style={bodyStyle}>
                {paragraphs(c.beginning.text).map((paragraph, i) => (
                  <p key={i} style={i > 0 ? { marginTop: fig(28) } : undefined}>
                    {paragraph}
                  </p>
                ))}
                {c.beginning.highlight && (
                  <p style={{ marginTop: fig(28), fontWeight: 600, fontSize: fig(20) }}>
                    {c.beginning.highlight}
                  </p>
                )}
              </div>
              <div className="flex flex-col" style={{ ...bodyStyle, gap: fig(28) }}>
                {c.timeline.map((entry, i) => {
                  const [first, ...rest] = paragraphs(entry.text)
                  return (
                    <div key={i} className="flex flex-col" style={{ gap: fig(28) }}>
                      <div>
                        <p style={{ fontWeight: 700 }}>{entry.title}</p>
                        {first && <p>{first}</p>}
                      </div>
                      {rest.map((paragraph, j) => (
                        <p key={j}>{paragraph}</p>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Image mosaic */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 lg:[grid-template-rows:var(--mosaic-rows)]"
            style={
              {
                gap: fig(24),
                '--mosaic-rows': `${fig(320)} ${fig(220)} ${fig(260)}`,
              } as CSSProperties
            }
          >
            <div
              className="relative col-span-2 row-span-2 min-h-[320px] overflow-hidden lg:min-h-0"
              style={{ borderRadius: fig(24) }}
            >
              <Image
                src={c.mosaicMain?.src ?? '/about/mosaic-grapes.jpg'}
                alt={c.mosaicMain ? c.mosaicMain.alt : 'Ripe grape clusters on the vine'}
                fill
                className="object-cover"
                // The built-in photo is framed on the grapes; CMS photos use their hotspot crop
                style={c.mosaicMain ? undefined : { objectPosition: '88% top' }}
                sizes="(max-width: 1024px) 100vw, 590px"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(to top, rgba(18,8,5,0.75), rgba(18,8,5,0) 55%)',
                }}
              />
            </div>
            <DarkCard
              eyebrow={c.mosaicCard1.eyebrow}
              title={c.mosaicCard1.title}
              className="col-span-2"
            >
              {c.mosaicCard1.text}
            </DarkCard>
            <div
              className="relative min-h-[180px] overflow-hidden lg:min-h-0"
              style={{ borderRadius: fig(24) }}
            >
              <Image
                src={c.mosaicSmall1?.src ?? '/about/mosaic-bottles.jpg'}
                alt={c.mosaicSmall1?.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 290px"
              />
            </div>
            <div
              className="relative min-h-[180px] overflow-hidden lg:min-h-0"
              style={{ borderRadius: fig(24) }}
            >
              <Image
                src={c.mosaicSmall2?.src ?? '/about/mosaic-barrels.jpg'}
                alt={c.mosaicSmall2?.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 290px"
              />
            </div>
            <DarkCard
              eyebrow={c.mosaicCard2.eyebrow}
              title={c.mosaicCard2.title}
              className="col-span-2 lg:col-span-4"
            >
              {c.mosaicCard2.text}
            </DarkCard>
          </div>

          {/* What we stand for */}
          <section className="flex flex-col" style={{ gap: fig(48) }}>
            <SectionHead title={c.values.heading} />
            <div className="flex flex-col" style={{ ...bodyStyle, gap: fig(28) }}>
              {c.valueItems.map((value, i) => (
                <div key={i}>
                  <p style={{ fontWeight: 700 }}>{value.title}</p>
                  <p>{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="flex flex-col items-center" style={{ gap: fig(48) }}>
            <div className="w-full">
              <SectionHead eyebrow={c.milestones.eyebrow} title={c.milestones.heading} />
            </div>
            <ol className="flex w-full flex-col" style={{ maxWidth: fig(900), gap: fig(24) }}>
              {c.milestoneItems.map((milestone, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: '#f2eddd',
                    borderRadius: fig(24),
                    paddingInline: fig(64),
                    paddingBlock: fig(16),
                    gap: fig(32),
                    fontFamily: 'var(--font-playfair)',
                    fontSize: fig(24),
                    lineHeight: 1.33,
                  }}
                >
                  <span style={{ fontWeight: 600, color: SAGE }}>{milestone.year}</span>
                  <span className="text-right" style={{ fontWeight: 400, color: '#160805' }}>
                    {lines(milestone.text).map((line, j) => (
                      <span key={j} className="lg:block lg:whitespace-nowrap">
                        {line}{' '}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Principles */}
          <section className="flex flex-col" style={{ gap: fig(48) }}>
            <SectionHead eyebrow={c.principles.eyebrow} title={c.principles.heading} />
            <div className="flex flex-wrap" style={{ gap: fig(24) }}>
              {c.principleItems.map((principle, i) => (
                <div
                  key={i}
                  className="flex min-w-[260px] flex-[1_0_0] flex-col bg-white"
                  style={{
                    borderRadius: fig(20),
                    padding: fig(32),
                    gap: fig(14),
                    minHeight: fig(206),
                  }}
                >
                  <span
                    aria-hidden
                    className="flex items-center justify-center"
                    style={{
                      width: fig(44),
                      height: fig(44),
                      fontFamily: 'var(--font-hanken)',
                      fontSize: fig(18),
                      color: '#3d4a38',
                    }}
                  >
                    {principle.symbol}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 500,
                      fontSize: fig(19),
                      lineHeight: 1.33,
                      color: INK,
                    }}
                  >
                    {principle.title}
                  </h3>
                  <p
                    style={{
                      maxWidth: fig(275),
                      fontFamily: 'var(--font-hanken)',
                      fontSize: fig(14),
                      lineHeight: fig(22.4),
                      color: BODY,
                    }}
                  >
                    {principle.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Team */}
        <section className="flex w-full flex-col" style={{ maxWidth: fig(1200), gap: fig(48) }}>
          <SectionHead title={c.team.heading} />
          <div style={{ ...bodyStyle, maxWidth: fig(900), fontWeight: 700 }}>
            {paragraphs(c.team.text).map((paragraph, i) => (
              <p key={i} style={i > 0 ? { marginTop: fig(28) } : undefined}>
                {paragraph}
              </p>
            ))}
            {c.team.subheading && (
              <h3
                style={{
                  marginTop: fig(28),
                  fontFamily: 'var(--font-hanken)',
                  fontSize: fig(24),
                  fontWeight: 700,
                  color: BODY,
                }}
              >
                {c.team.subheading}
              </h3>
            )}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: fig(24) }}>
            {(c.teamMembers ?? OUR_STORY_DEFAULTS.teamMembers).map((member, i) => {
              // CMS members use their own photo (cropped by Sanity); built-in
              // members keep their static photo and Figma crop.
              const cmsPhoto = c.teamMembers
                ? (member as { photo?: { src: string } }).photo
                : undefined
              const builtIn = c.teamMembers ? undefined : DEFAULT_TEAM_PHOTOS[i]
              const src = cmsPhoto?.src ?? builtIn?.src
              return (
                <li key={i} className="flex flex-col" style={{ gap: fig(14) }}>
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      height: fig(300),
                      borderRadius: fig(20),
                      backgroundColor: 'var(--color-brand-sand)',
                    }}
                  >
                    {src && (
                      <div className="absolute inset-0" style={builtIn?.imageFrame}>
                        <Image
                          src={src}
                          alt={member.name}
                          fill
                          className={builtIn?.imageClass ?? 'object-cover'}
                          sizes="(max-width: 640px) 100vw, 400px"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col" style={{ gap: fig(2) }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontWeight: 500,
                        fontSize: fig(19),
                        lineHeight: 1.33,
                        color: INK,
                      }}
                    >
                      {member.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontSize: fig(13),
                        lineHeight: 1.3,
                        color: SAGE,
                      }}
                    >
                      {member.role}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <Ornament src="/about/ornament-bottom.svg" width={666.622} height={83.3613} />
      </div>
    </div>
  )
}
