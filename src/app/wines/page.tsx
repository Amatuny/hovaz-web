import type { Metadata } from 'next'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { fig } from '@/lib/figmaScale'
import { getAllWines, getWinesPage } from '@/lib/sanity/queries'
import { WineCard } from '@/components/ui/WineCard'
import { WINES_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveWinesContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts and SEO are edited in Studio → Pages → Our Wines Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getWinesPage(), currentLocale()])
  return seoToMetadata(doc?.seo, locale, {
    title: WINES_DEFAULTS.seo.metaTitle,
    description: WINES_DEFAULTS.seo.metaDescription,
    url: 'https://hovazwines.com/wines',
  })
}

export const revalidate = 3600

/** max(floor, Figma px x --figma-scale) */
const scaled = (px: number, floor: number) => `max(${floor}px, ${fig(px)})`

// Figma "wines" (wine--reserve 3179:5504) collection "Section Header": olive
// eyebrow (Montserrat SemiBold 12, 3px tracking), Playfair SemiBold 36 title,
// Hanken 17/27.2 intro, 16px apart, max 860px wide.
function CollectionHeader({
  eyebrow,
  heading,
  paragraph,
}: {
  eyebrow: string
  heading: string
  paragraph: string
}) {
  return (
    <div className="flex flex-col" style={{ maxWidth: fig(860), gap: scaled(16, 12) }}>
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: scaled(12, 11),
          letterSpacing: scaled(3, 2),
          color: '#8a9572',
        }}
      >
        {eyebrow}
      </p>
      <h2
        className="capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: scaled(36, 26),
          lineHeight: 1.25,
          color: '#1a1d17',
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 400,
          fontSize: scaled(17, 15),
          lineHeight: 1.6,
          color: '#4f4542',
        }}
      >
        {paragraph}
      </p>
    </div>
  )
}

function ComingSoon({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-hanken)',
        fontWeight: 400,
        fontSize: scaled(15, 13),
        color: 'var(--color-brand-stone)',
      }}
    >
      {text}
    </p>
  )
}

// Figma "event card sec": 350x529 cards, 24px apart in both directions,
// 4 per row at 1600px, rows start on the left. Gaps scale with the cards.
function WineGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start" style={{ gap: scaled(24, 16) }}>
      {children}
    </div>
  )
}

export default async function WinesPage() {
  const [wines, doc, locale] = await Promise.all([getAllWines(), getWinesPage(), currentLocale()])
  const t = resolveWinesContent(doc, locale)

  const hovazWines = wines.filter((w) => (w.collection ?? 'hovaz') === 'hovaz')
  const goonehWines = wines.filter((w) => w.collection === 'gooneh')

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      {/* Page shell: 48px top, sections 82px apart, 82px bottom */}
      <div className="container-content page-main">
        {/* Figma page title: Playfair SemiBold 44, 0.5px tracking — title only */}
        <h1
          className="capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: scaled(44, 30),
            letterSpacing: '0.5px',
            lineHeight: 1.25,
            color: '#1a1d17',
            maxWidth: fig(860),
          }}
        >
          {t.list.heading}
        </h1>

        {wines.length === 0 ? (
          <ComingSoon text={t.list.comingSoon} />
        ) : (
          <>
            {/* Hovaz Collection — header, then cards 48px below */}
            <div className="flex flex-col" style={{ gap: scaled(48, 32) }}>
              <CollectionHeader
                eyebrow={t.hovaz.eyebrow}
                heading={t.hovaz.heading}
                paragraph={t.hovaz.text}
              />
              {hovazWines.length > 0 ? (
                <WineGrid>
                  {hovazWines.map((wine) => (
                    <WineCard key={wine._id} wine={wine} labels={t.cards} />
                  ))}
                </WineGrid>
              ) : (
                <ComingSoon text={t.list.comingSoon} />
              )}
            </div>

            <SectionDivider variant="vine" />

            {/* Gooneh Collection */}
            <div className="flex flex-col" style={{ gap: scaled(48, 32) }}>
              <CollectionHeader
                eyebrow={t.gooneh.eyebrow}
                heading={t.gooneh.heading}
                paragraph={t.gooneh.text}
              />
              {goonehWines.length > 0 ? (
                <WineGrid>
                  {goonehWines.map((wine) => (
                    <WineCard key={wine._id} wine={wine} labels={t.cards} />
                  ))}
                </WineGrid>
              ) : (
                <ComingSoon text={t.list.comingSoon} />
              )}
            </div>

            <SectionDivider variant="symbol" />
          </>
        )}
      </div>
    </div>
  )
}
