import type { NewsItem } from '@/types/sanity'
import { fig, mfig } from '@/lib/figmaScale'
import { HOME_DEFAULTS } from '@/content/defaults'
import { TextLink } from '@/components/ui/TextLink'

interface AwardsStripProps {
  awards: NewsItem[]
  texts?: typeof HOME_DEFAULTS.awards
}

interface AwardItem {
  key: string
  organization: string
  wine?: string
  tier?: string
  year?: number
}

// Shown until awards are published in Studio (News → category "Award").
const FALLBACK_AWARDS: AwardItem[] = [
  { key: 'decanter', organization: 'Decanter World Wine Awards' },
  { key: 'wine-spectator', organization: 'Wine Spectator' },
]

/** Figma pill colours: gold #997026, everything else silver-grey #787878. */
function tierColor(tier?: string) {
  return tier && /gold|grand|platinum|trophy/i.test(tier) ? '#997026' : '#787878'
}

const scaled = (px: number, floor: number) => `max(${floor}px, ${fig(px)})`

// Figma "Section section awards" (3179:4799): centred eyebrow + title, a
// 1072px row of three award cards (lettered medallion, competition, wine,
// tier pill), then a left-aligned text link. 32px between rows.
export function AwardsStrip({ awards, texts = HOME_DEFAULTS.awards }: AwardsStripProps) {
  const realAwards: AwardItem[] = (awards ?? []).slice(0, 3).map((item) => ({
    key: item._id,
    organization: item.awardOrganization ?? item.publication ?? item.title,
    wine: item.awardedWine,
    tier: item.awardTier,
    year: item.awardYear,
  }))
  const items = realAwards.length > 0 ? realAwards : FALLBACK_AWARDS

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col items-center" style={{ gap: mfig(32, 32) }}>
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 500,
            fontSize: scaled(11, 10),
            lineHeight: 1.27,
            letterSpacing: scaled(3, 2),
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          {texts.eyebrow}
        </p>
        <h2
          className="text-center capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: mfig(32, 32, 26),
            lineHeight: 'normal',
            letterSpacing: scaled(2, 1),
            color: '#231814',
          }}
        >
          {texts.heading}
        </h2>

        <div
          // A row of equal thirds, centred — so 1–2 awards don't leave empty slots
          className="flex w-full flex-col justify-center sm:flex-row"
          style={{ maxWidth: fig(1072), gap: mfig(32, 24) }}
        >
          {items.map((item) => (
            <div
              key={item.key}
              className="flex min-w-0 flex-col items-center text-center sm:max-w-[calc((100%-48px)/3)] sm:flex-1"
              style={{ gap: scaled(18, 12), paddingInline: fig(28), paddingBlock: fig(44) }}
            >
              <div
                className="flex shrink-0 items-center justify-center rounded-full"
                style={{
                  width: scaled(84, 64),
                  height: scaled(84, 64),
                  background: 'radial-gradient(circle, #faf7ee 0%, #f2eddd 100%)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 600,
                    fontSize: scaled(30, 24),
                    color: '#3d4a38',
                  }}
                >
                  {item.organization.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col" style={{ gap: fig(6) }}>
                <p
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontWeight: 500,
                    fontSize: scaled(18, 16),
                    lineHeight: 'normal',
                    color: '#1a1d17',
                  }}
                >
                  {item.organization}
                </p>
                {item.wine && (
                  <p
                    style={{
                      fontFamily: 'var(--font-hanken)',
                      fontSize: scaled(13, 12),
                      lineHeight: 'normal',
                      color: '#4f4542',
                    }}
                  >
                    {item.wine}
                  </p>
                )}
              </div>
              {(item.tier || item.year) && (
                <span
                  className="rounded-full uppercase"
                  style={{
                    paddingInline: fig(16),
                    paddingBlock: fig(6),
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 700,
                    fontSize: '10px',
                    lineHeight: 'normal',
                    letterSpacing: '1.5px',
                    color: '#fdfcf8',
                    backgroundColor: tierColor(item.tier),
                  }}
                >
                  {[item.tier, item.year].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="w-full">
          <TextLink href="/news">{texts.linkText}</TextLink>
        </div>
      </div>
    </section>
  )
}
