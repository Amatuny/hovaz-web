// src/app/wines/page.tsx
import type { Metadata } from 'next'
import { getAllWines } from '@/lib/sanity/queries'
import { WineCard } from '@/components/ui/WineCard'

export const metadata: Metadata = {
  title: 'Our Wines',
  description:
    'Discover the HOVAZ wine collection — six expressions of Armenian terroir crafted from indigenous grape varieties.',
  openGraph: {
    title: 'Our Wines — HOVAZ',
    description: 'Discover the HOVAZ wine collection.',
    url: 'https://hovazwines.com/wines',
  },
}

export const revalidate = 3600

export default async function WinesPage() {
  const wines = await getAllWines()

  // Group by wine type for filtering display
  const redWines = wines.filter((w) => w.wineType === 'red')
  const whiteWines = wines.filter((w) => w.wineType === 'white')
  const otherWines = wines.filter((w) => !['red', 'white'].includes(w.wineType ?? ''))

  return (
    <>
      {/* Page header */}
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content text-center">
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
            The Collection
          </p>
          <h1 className="heading-display mb-6">Our Wines</h1>
          <p
            className="text-body max-w-prose mx-auto"
            style={{ color: 'var(--color-brand-stone)' }}
          >
            Ten expressions of Armenian terroir, crafted from indigenous grape varieties grown in
            the ancient highlands of Vayots Dzor and the Ararat Valley.
          </p>
        </div>
      </div>

      {/* Wine grid */}
      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content">
          {wines.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
                Our wine collection is coming soon.
              </p>
            </div>
          ) : (
            <>
              {/* All wines grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wines.map((wine) => (
                  <WineCard key={wine._id} wine={wine} />
                ))}
              </div>

              {/* Wine type breakdown */}
              {(redWines.length > 0 || whiteWines.length > 0) && (
                <div className="mt-20 pt-16 divider-cream grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <p
                      className="font-serif text-4xl mb-2"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {redWines.length}
                    </p>
                    <p className="text-label">Red Wines</p>
                  </div>
                  <div>
                    <p
                      className="font-serif text-4xl mb-2"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {whiteWines.length}
                    </p>
                    <p className="text-label">White Wines</p>
                  </div>
                  <div>
                    <p
                      className="font-serif text-4xl mb-2"
                      style={{ color: 'var(--color-brand-burgundy)' }}
                    >
                      {otherWines.length}
                    </p>
                    <p className="text-label">Rosé & Sparkling</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Book a tasting CTA — Flow 2 */}
      <div
        className="section-padding-sm"
        style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
      >
        <div className="container-content text-center">
          <p className="text-label mb-4" style={{ color: 'rgba(184,146,74,0.8)' }}>
            Experience them in person
          </p>
          <h2 className="heading-section mb-6" style={{ color: 'white' }}>
            Book a Wine Tasting
          </h2>
          <p className="text-body max-w-md mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Taste our collection with an expert guide at our Wine Rooms in Dilijan or Proshyan.
          </p>
          <a href="/events/guided-tasting" className="btn-white">
            Reserve a Tasting
          </a>
        </div>
      </div>
    </>
  )
}
