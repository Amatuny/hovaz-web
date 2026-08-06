import Link from 'next/link'
import type { NewsItem } from '@/types/sanity'

interface AwardsStripProps {
  awards: NewsItem[]
}

export function AwardsStrip({ awards }: AwardsStripProps) {
  return (
    <section className="section-padding-sm" style={{ backgroundColor: 'var(--color-brand-dark)' }}>
      <div className="container-content">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
              Recognition
            </p>
            <h2
              className="heading-card"
              style={{ color: 'white', fontFamily: 'var(--font-serif)' }}
            >
              Awards & Press
            </h2>
          </div>

          {/* Awards list */}
          <div className="flex flex-wrap justify-center md:justify-end gap-8">
            {awards?.length > 0
              ? awards.slice(0, 4).map((item) => (
                  <div key={item._id} className="text-center">
                    <p
                      className="font-serif text-3xl mb-1"
                      style={{ color: 'var(--color-brand-gold)' }}
                    >
                      ★
                    </p>
                    <p
                      className="font-sans text-xs text-center max-w-24"
                      style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}
                    >
                      {item.awardOrganization ?? item.publication ?? item.title}
                    </p>
                  </div>
                ))
              : // Placeholder awards before real content exists
                ['Decanter', 'Wine Spectator', 'Robert Parker', 'Vivino'].map((name) => (
                  <div key={name} className="text-center">
                    <p
                      className="font-serif text-3xl mb-1"
                      style={{ color: 'var(--color-brand-gold)' }}
                    >
                      ★
                    </p>
                    <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {name}
                    </p>
                  </div>
                ))}
          </div>

          <Link
            href="/news/awards"
            className="btn-secondary"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            View Awards
          </Link>
        </div>
      </div>
    </section>
  )
}
