import type { Metadata } from 'next'
import { getFaqByCategory } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about HOVAZ Wine Rooms.',
}

export const revalidate = 3600

const categoryLabels: Record<string, string> = {
  bookings: 'Bookings',
  wine_tours: 'Wine Experiences',
  getting_here: 'Getting Here',
  wine: 'Wine',
  general: 'General',
}

export default async function FaqPage() {
  const faqs = await getFaqByCategory()

  const byCategory = faqs.reduce((acc: Record<string, typeof faqs>, faq) => {
    const cat = faq.category ?? 'general'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Help
          </p>
          <h1 className="heading-display">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {faqs.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              FAQ coming soon.
            </p>
          ) : (
            Object.entries(byCategory).map(([category, items]) => (
              <div key={category} className="mb-12">
                <p
                  className="text-label mb-6 pb-3 divider-gold"
                  style={{ color: 'var(--color-brand-gold)' }}
                >
                  {categoryLabels[category] ?? category}
                </p>
                <div className="flex flex-col gap-4">
                  {items.map((faq) => (
                    <details key={faq._id} className="card-wine p-6 group">
                      <summary
                        className="font-serif text-lg cursor-pointer list-none flex justify-between items-center"
                        style={{ color: 'var(--color-brand-charcoal)' }}
                      >
                        {faq.question}
                        <span
                          className="text-label ml-4 shrink-0 transition-transform group-open:rotate-180"
                          style={{ color: 'var(--color-brand-gold)' }}
                        >
                          ↓
                        </span>
                      </summary>
                      <p
                        className="text-body mt-4 pt-4 divider-cream"
                        style={{ color: 'var(--color-brand-stone)' }}
                      >
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
