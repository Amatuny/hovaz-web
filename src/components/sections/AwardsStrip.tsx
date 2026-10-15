import type { NewsItem } from '@/types/sanity'

interface AwardsStripProps {
  awards: NewsItem[]
}

interface RecognitionItem {
  key: string
  icon: 'star' | 'pin'
  label: string
  meta?: string
}

const FALLBACK_AWARDS: RecognitionItem[] = [
  { key: 'decanter', icon: 'star', label: 'Decanter World Wine Awards' },
  { key: 'wine-spectator', icon: 'star', label: 'Wine Spectator' },
]

const BRAND_FACT: RecognitionItem = {
  key: 'women-led',
  icon: 'pin',
  label: 'Women-led Winery',
  meta: 'Since 2018',
}

function StarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5l2.47 5.18 5.71.66-4.2 3.93 1.13 5.67-5.11-2.86-5.11 2.86 1.13-5.67-4.2-3.93 5.71-.66L12 3.5z"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z"
      />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

export function AwardsStrip({ awards }: AwardsStripProps) {
  const realAwards: RecognitionItem[] = (awards ?? []).slice(0, 2).map((item) => ({
    key: item._id,
    icon: 'star',
    label: item.awardOrganization ?? item.publication ?? item.title,
    meta: [item.awardTier?.toUpperCase(), item.awardYear].filter(Boolean).join(' · '),
  }))

  const items: RecognitionItem[] = [
    ...(realAwards.length > 0 ? realAwards : FALLBACK_AWARDS),
    BRAND_FACT,
  ]

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content text-center">
        <p
          className="mb-4 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          Recognition
        </p>
        <h2
          className="mb-14 capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.6vw, 36px)',
            color: '#1a1d17',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
          }}
        >
          Quietly Awarded
        </h2>

        <div className="flex flex-wrap justify-center gap-x-16 gap-y-10">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex flex-col items-center"
              style={{ maxWidth: '180px' }}
            >
              <div
                className="mb-4 flex items-center justify-center rounded-full"
                style={{
                  width: '56px',
                  height: '56px',
                  border: '1px solid color-mix(in srgb, var(--color-brand-stone) 35%, transparent)',
                  color: 'var(--color-brand-stone)',
                }}
              >
                {item.icon === 'star' ? <StarIcon /> : <PinIcon />}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: '14px',
                  color: 'var(--color-brand-charcoal)',
                }}
              >
                {item.label}
              </p>
              {item.meta && (
                <p
                  className="mt-2 uppercase"
                  style={{
                    fontFamily: 'var(--font-hanken)',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    color: 'var(--color-brand-stone)',
                  }}
                >
                  {item.meta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
