import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For Tour Agencies',
  description:
    'Partner with HOVAZ Wine Rooms — group bookings, pricing and media kit for tour agencies.',
}

export default function AgenciesPage() {
  const specs = [
    { label: 'Minimum group', value: '8 guests' },
    { label: 'Maximum group', value: '40 guests' },
    { label: 'Languages', value: 'EN · HY · RU' },
    { label: 'Private venue hire', value: 'Available' },
    { label: 'Custom menus', value: 'On request' },
    { label: 'Invoice billing', value: 'Available' },
    { label: 'Commission', value: '10%' },
    { label: 'Lead time', value: '48 hours min' },
  ]

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-dark)' }}>
        <div className="container-content">
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
            Partners
          </p>
          <h1
            className="heading-display"
            style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            For Tour Agencies
          </h1>
          <p className="text-body text-lg mt-4 max-w-xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            We work with tour operators and travel agencies to create memorable wine experiences for
            groups visiting Armenia.
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Specs */}
            <div>
              <p className="text-label mb-6" style={{ color: 'var(--color-brand-gold)' }}>
                Operational Specs
              </p>
              <div className="p-8" style={{ backgroundColor: 'white' }}>
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
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
                What We Offer
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  {
                    title: 'Guided Wine Tastings',
                    desc: 'Led by our sommelier — covers HOVAZ wines and Armenian wine history.',
                  },
                  {
                    title: 'Vineyard & Cellar Tours',
                    desc: 'Behind-the-scenes access to our winemaking process.',
                  },
                  {
                    title: 'Food & Wine Pairings',
                    desc: 'Traditional Armenian cuisine paired with our wines.',
                  },
                  {
                    title: 'Private Events',
                    desc: 'Full venue hire for exclusive group experiences.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-6" style={{ backgroundColor: 'white' }}>
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
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Group inquiry CTA */}
              <Link
                href="/contact/form?type=agency"
                className="btn-primary w-full text-center block"
              >
                Send a Group Inquiry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
