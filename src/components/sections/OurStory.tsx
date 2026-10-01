// src/components/sections/OurStory.tsx
// The /about/our-story page body (Figma "About" frame, node 722:12726).
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { fig } from '@/lib/figmaScale'

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

const TIMELINE = [
  {
    year: '2018 — HOVAZ begins',
    text: [
      'HOVAZ is founded by a group of young Armenian wine enthusiasts with a shared passion for wine and viticulture.',
    ],
  },
  {
    year: '2022 — HOVAZ Wine Rooms, Dilijan',
    text: [
      'Our Wine Rooms became the first expression of our idea of bringing people closer to wine.',
      'In Dilijan, we created an experience that allows guests to engage directly with the sparkling wine production process — going beyond tasting to discover how sparkling wine is actually made. It remains the only experience of its kind in Armenia.',
    ],
  },
  {
    year: '2026 — HOVAZ Wine Boutique, Proshyan',
    text: ['Our new Wine Boutique takes participation one step further.'],
  },
]

const VALUES = [
  {
    title: 'SUSTAINABILITY:',
    text: 'We believe a modern wine business should take responsibility for the resources it uses. Our HOVAZ Wine Boutique in Proshyan operates entirely on solar energy, supported by solar generators. It is one of the practical ways we are working to reduce our environmental footprint and make our operations more sustainable. For us, sustainability is not simply a principle. It is something we put into practice.',
  },
  {
    title: 'WILDLIFE CONSERVATION:',
    text: "HOVAZ takes its name from the Armenian word for leopard. The leopard is one of Armenia's most threatened wild animals, and its survival depends on it on continued protection of its habitat and population. HOVAZ has adopted an Armenian leopard and supports its conservation as part of: our commitment to protecting Armenia's wildlife. The leopard is not simply part of our name. It is part of what we stand behind.",
  },
  {
    title: 'WOMEN EMPOWERMENT',
    text: "HOVAZ is a women-founded business, and promoting women's participation in wine is an important part of who we are. We believe there should be more opportunities for women to build careers, lead, create and shape the future of the wine industry. We want HOVAZ to contribute to a wine culture where women are visible not only as: wine lovers, but as professionals, leaders, entrepreneurs and creators.",
  },
]

const MILESTONES = [
  { year: '2018', lines: ['Family rows above Dilijan become a working estate.'] },
  { year: '2019', lines: ['First vintage released — 800 bottles, sold locally.'] },
  { year: '2021', lines: ["Plans begin for a second site in Proshyan's Ararat Valley."] },
  { year: '2023', lines: ['Reserve Collection introduced, our first library wines.'] },
  {
    year: '2026',
    lines: [
      'Proshyan Wine Rooms opens — two estates',
      'now welcome tastings, tours and private events.',
    ],
  },
]

const PRINCIPLES = [
  {
    glyph: '◈',
    title: 'Hand-Grown',
    text: 'Every parcel is hand-harvested and fermented in small, native-yeast batches.',
  },
  {
    glyph: '✦',
    title: 'Two Terroirs',
    text: "Proshyan's high valley and Dilijan's forested hills, kept distinct, never blended for convenience.",
  },
  {
    glyph: '❖',
    title: 'Slow, on Purpose',
    text: 'Small lots, patient aging, and releases only when a wine is ready — not on a schedule.',
  },
]

// `imageFrame` positions the image box to reproduce Figma's zoomed crop where it isn't a plain cover-fit.
const TEAM: {
  name: string
  role: string
  src: string
  imageClass?: string
  imageFrame?: CSSProperties
}[] = [
  {
    name: 'Lilit Avetisyan',
    role: 'Founder & Winemaker',
    src: '/about/team-lilit.png',
    imageClass: 'object-cover object-[center_25%]',
  },
  {
    name: 'Nelli Petrosyan',
    role: 'Estate Director, Dilijan',
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
  { name: 'Sirvard Amatuni', role: 'Estate Director, Proshyan', src: '/about/team-sirvard.jpg' },
]

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

export function OurStory() {
  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div
        className="container-content flex flex-col items-center pt-12"
        style={{ gap: fig(82), paddingBottom: fig(82) }}
      >
        <div className="w-full">
          <div className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
            <SectionHead as="h1" eyebrow="Our Story" title="The forest and the valley" />
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(18),
                lineHeight: fig(29.7),
                color: BODY,
              }}
            >
              Founded in 2018 on terraces above Proshyan, Vineyard Reserve sits where wild forest
              meets cultivated valley — a boundary we try to keep visible in every bottle.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col" style={{ maxWidth: fig(1200), gap: fig(82) }}>
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '1200 / 568', borderRadius: fig(24) }}
          >
            <Image
              src="/about/hero-cellar.png"
              alt="Stainless steel tanks and oak barrels in the HOVAZ cellar"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>

          <Ornament src="/wines/vine-divider.svg" width={677.469} height={78} />

          {/* The beginning */}
          <section className="flex flex-col" style={{ gap: fig(48) }}>
            <SectionHead eyebrow="The Beginning" title="From family table to estate" />
            <div className="flex flex-col" style={{ gap: fig(24) }}>
              <div style={bodyStyle}>
                <p>
                  HOVAZ began in 2018 with a passion for Armenian wine and a desire to explore how
                  people could experience it differently. From the beginning, we have believed that
                  wine is more interesting when you can get closer to what happens behind the
                  bottle— to the craft, the decisions, the people and the process.
                </p>
                <p style={{ marginTop: fig(28), fontWeight: 600, fontSize: fig(20) }}>
                  That idea has shaped how HOVAZ has evolved.
                </p>
              </div>
              <div className="flex flex-col" style={{ ...bodyStyle, gap: fig(28) }}>
                {TIMELINE.map((entry) => (
                  <div key={entry.year} className="flex flex-col" style={{ gap: fig(28) }}>
                    <div>
                      <p style={{ fontWeight: 700 }}>{entry.year}</p>
                      <p>{entry.text[0]}</p>
                    </div>
                    {entry.text.slice(1).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ))}
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
                src="/about/mosaic-grapes.jpg"
                alt="Ripe grape clusters on the vine"
                fill
                className="object-cover"
                style={{ objectPosition: '88% top' }}
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
              eyebrow="The Beginning"
              title="From family table to estate"
              className="col-span-2"
            >
              Hovaz began with a handful of family rows above Dilijan, planted for the household
              table long before they were planted for a label. In 2018 that plot became an estate —
              small, deliberately so, working with growers who still pick fruit by hand and ferment
              in native-yeast batches.
            </DarkCard>
            <div
              className="relative min-h-[180px] overflow-hidden lg:min-h-0"
              style={{ borderRadius: fig(24) }}
            >
              <Image
                src="/about/mosaic-bottles.jpg"
                alt=""
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
                src="/about/mosaic-barrels.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 290px"
              />
            </div>
            <DarkCard
              eyebrow="How we decided"
              title="Built for the long table"
              className="col-span-2 lg:col-span-4"
            >
              We wanted a red that could sit through a whole evening — poured early, still good
              three hours later. Twelve months in Caucasian oak softened the tannins without masking
              the fruit, and it&apos;s stayed our benchmark for every reserve since.
            </DarkCard>
          </div>

          {/* What we stand for */}
          <section className="flex flex-col" style={{ gap: fig(48) }}>
            <SectionHead title="What we stand for" />
            <div className="flex flex-col" style={{ ...bodyStyle, gap: fig(28) }}>
              {VALUES.map((value) => (
                <div key={value.title}>
                  <p style={{ fontWeight: 700 }}>{value.title}</p>
                  <p>{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Milestones */}
          <section className="flex flex-col items-center" style={{ gap: fig(48) }}>
            <div className="w-full">
              <SectionHead eyebrow="Milestones" title="Along the way" />
            </div>
            <ol className="flex w-full flex-col" style={{ maxWidth: fig(900), gap: fig(24) }}>
              {MILESTONES.map((milestone) => (
                <li
                  key={milestone.year}
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
                    {milestone.lines.map((line) => (
                      <span key={line} className="lg:block lg:whitespace-nowrap">
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
            <SectionHead eyebrow="What Guides Us" title="Principles over process" />
            <div className="flex flex-wrap" style={{ gap: fig(24) }}>
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.title}
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
                    {principle.glyph}
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
          <SectionHead title="The people behind HOVAZ" />
          <div style={{ ...bodyStyle, maxWidth: fig(900), fontWeight: 700 }}>
            <p>
              HOVAZ is built by people who care about wine and about what happens around it. Our
              team brings together winemaking, hospitality, creativity and a willingness to
              experiment. We believe the best experiences come from people who know their craft,
              enjoy sharing it and remain curious about what comes next.
            </p>
            <h3
              style={{
                marginTop: fig(28),
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(24),
                fontWeight: 700,
                color: BODY,
              }}
            >
              Meet the HOVAZ team
            </h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: fig(24) }}>
            {TEAM.map((member) => (
              <li key={member.name} className="flex flex-col" style={{ gap: fig(14) }}>
                <div
                  className="relative w-full overflow-hidden"
                  style={{ height: fig(300), borderRadius: fig(20) }}
                >
                  <div className="absolute inset-0" style={member.imageFrame}>
                    <Image
                      src={member.src}
                      alt={member.name}
                      fill
                      className={member.imageClass ?? 'object-cover'}
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
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
            ))}
          </ul>
        </section>

        <Ornament src="/about/ornament-bottom.svg" width={666.622} height={83.3613} />
      </div>
    </div>
  )
}
