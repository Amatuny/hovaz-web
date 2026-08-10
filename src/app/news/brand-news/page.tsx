import type { Metadata } from 'next'
import Link from 'next/link'
import { getNewsByCategory } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'Brand News',
  description: 'Latest news and updates from HOVAZ Wine Rooms.',
}

export const revalidate = 3600

export default async function BrandNewsPage() {
  const newsItems = await getNewsByCategory('brand_news')

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
              style={{ color: 'var(--color-brand-stone)' }}
            >
              Press & Media
            </Link>
            <Link
              href="/news/brand-news"
              className="text-label"
              style={{
                color: 'var(--color-brand-burgundy)',
                borderBottom: '1px solid var(--color-brand-gold)',
                paddingBottom: '4px',
              }}
            >
              Brand News
            </Link>
          </div>
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Updates
          </p>
          <h1 className="heading-display">Brand News</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {newsItems.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              News coming soon.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {newsItems.map((item) => (
                <article key={item._id} className="pb-8 divider-cream">
                  <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
                    {item.date &&
                      new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                  </p>
                  <h3 className="heading-card mb-3">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
                      {item.excerpt}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
