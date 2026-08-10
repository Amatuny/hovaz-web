import type { Metadata } from 'next'
import Link from 'next/link'
import { getNewsByCategory } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Press & Media',
  description: 'HOVAZ Wine Rooms in the press.',
}

export const revalidate = 3600

export default async function PressPage() {
  const pressItems = await getNewsByCategory('press')

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="flex gap-6 mb-12">
            <Link
              href="/news/awards"
              className="text-label"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              Awards
            </Link>
            <Link
              href="/news/press"
              className="text-label"
              style={{
                color: 'var(--color-brand-burgundy)',
                borderBottom: '1px solid var(--color-brand-gold)',
                paddingBottom: '4px',
              }}
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
            Coverage
          </p>
          <h1 className="heading-display">Press & Media</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content">
          {pressItems.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              Press coverage coming soon.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {pressItems.map((item) => (
                <div key={item._id} className="card-wine p-6 flex items-start gap-6">
                  <div
                    className="shrink-0 w-16 h-16 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-brand-blush)' }}
                  >
                    <p
                      className="font-serif text-2xl"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {item.publication?.charAt(0) ?? 'P'}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-label mb-1" style={{ color: 'var(--color-brand-gold)' }}>
                      {item.publication}
                      {item.date &&
                        ` · ${new Date(item.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
                    </p>
                    <h3 className="heading-card mb-2" style={{ fontSize: '1.1rem' }}>
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p
                        className="text-body"
                        style={{ fontSize: '0.875rem', color: 'var(--color-brand-stone)' }}
                      >
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost shrink-0"
                    >
                      Read →
                    </a>
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
