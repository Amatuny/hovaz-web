import type { Metadata } from 'next'
import Link from 'next/link'
import { getNewsByCategory } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Awards',
  description: 'HOVAZ Wine Rooms award recognition and accolades.',
}

export const revalidate = 3600

export default async function AwardsPage() {
  const awards = await getNewsByCategory('award')

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="flex gap-6 mb-12">
            <Link
              href="/news/awards"
              className="text-label"
              style={{
                color: 'var(--color-brand-burgundy)',
                borderBottom: '1px solid var(--color-brand-gold)',
                paddingBottom: '4px',
              }}
            >
              Awards
            </Link>
            <Link
              href="/news/press"
              className="text-label"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              Press & Media
            </Link>
            <Link
              href="/news/brand-news"
              className="text-label"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              Brand News
            </Link>
          </div>
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Recognition
          </p>
          <h1 className="heading-display">Awards</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content">
          {awards.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              Awards coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award) => (
                <div key={award._id} className="card-wine p-8 text-center">
                  <p
                    className="font-serif text-5xl mb-4"
                    style={{ color: 'var(--color-brand-gold)' }}
                  >
                    ★
                  </p>
                  <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
                    {award.awardOrganization}
                    {award.awardYear && ` · ${award.awardYear}`}
                  </p>
                  <h3 className="heading-card mb-3" style={{ fontSize: '1.1rem' }}>
                    {award.title}
                  </h3>
                  {award.excerpt && (
                    <p
                      className="text-body"
                      style={{ fontSize: '0.875rem', color: 'var(--color-brand-stone)' }}
                    >
                      {award.excerpt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
