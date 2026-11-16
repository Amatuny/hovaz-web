import type { Metadata } from 'next'
import { getContactPage, getFaqByCategory } from '@/lib/sanity/queries'
import { CONTACT_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveContactContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts and SEO are edited in Studio → Pages → Contact Page → FAQ Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getContactPage(), currentLocale()])
  return seoToMetadata(doc?.faqSeo, locale, {
    title: CONTACT_DEFAULTS.seo.faq.metaTitle,
    description: CONTACT_DEFAULTS.seo.faq.metaDescription,
    url: 'https://hovazwines.com/contact/faq',
  })
}

export const revalidate = 3600

export default async function FaqPage() {
  const [faqs, doc, locale] = await Promise.all([
    getFaqByCategory(),
    getContactPage(),
    currentLocale(),
  ])
  const t = resolveContactContent(doc, locale)
  const categoryLabels: Record<string, string> = t.faqCategories

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
            {t.faq.eyebrow}
          </p>
          <h1 className="heading-display">{t.faq.heading}</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {faqs.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
              {t.faq.empty}
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
