import type { Metadata } from 'next'
import Link from 'next/link'
import { getContactPage } from '@/lib/sanity/queries'
import { CONTACT_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveContactContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts, specs, offers and SEO are edited in Studio → Pages → Contact Page → Agencies Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getContactPage(), currentLocale()])
  return seoToMetadata(doc?.agenciesSeo, locale, {
    title: CONTACT_DEFAULTS.seo.agencies.metaTitle,
    description: CONTACT_DEFAULTS.seo.agencies.metaDescription,
    url: 'https://hovazwines.com/contact/agencies',
  })
}

export const revalidate = 3600

export default async function AgenciesPage() {
  const [doc, locale] = await Promise.all([getContactPage(), currentLocale()])
  const t = resolveContactContent(doc, locale)
  const specs = t.agencySpecs

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-dark)' }}>
        <div className="container-content">
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
            {t.agencies.eyebrow}
          </p>
          <h1
            className="heading-display"
            style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t.agencies.heading}
          </h1>
          <p className="text-body text-lg mt-4 max-w-xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t.agencies.text}
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Specs */}
            <div>
              <p className="text-label mb-6" style={{ color: 'var(--color-brand-gold)' }}>
                {t.agencies.specsLabel}
              </p>
              <div className="p-8" style={{ backgroundColor: 'white' }}>
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-4 ${i < specs.length - 1 ? 'divider-cream' : ''}`}
                  >
                    <p className="text-label">{spec.label}</p>
                    <p
                      className="font-serif text-lg"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What we offer */}
            <div>
              <p className="text-label mb-6" style={{ color: 'var(--color-brand-gold)' }}>
                {t.agencies.offersLabel}
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {t.agencyOffers.map((item, i) => (
                  <div key={i} className="p-6" style={{ backgroundColor: 'white' }}>
                    <h3
                      className="font-serif text-lg mb-2"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-body"
                      style={{ fontSize: '0.875rem', color: 'var(--color-brand-stone)' }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Group inquiry CTA */}
              <Link
                href="/contact/form?type=agency"
                className="btn-primary w-full text-center block"
              >
                {t.agencies.button}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
