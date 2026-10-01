import type { Metadata } from 'next'
import { getAllEstates, getAllTours } from '@/lib/sanity/queries'
import { ExperiencesEstateSwitcher } from '@/components/sections/ExperiencesEstateSwitcher'

export const metadata: Metadata = {
  title: 'Experiences',
  description:
    'Choose your HOVAZ estate — Proshyan or Dilijan — and pick the tasting that suits you.',
  openGraph: {
    title: 'Experiences — HOVAZ',
    description: 'Choose your HOVAZ estate and pick the tasting that suits you.',
    url: 'https://hovazwines.com/experiences',
  },
}

export const revalidate = 3600

export default async function ExperiencesPage() {
  const [estates, tours] = await Promise.all([getAllEstates(), getAllTours()])

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col pt-12 pb-12">
        {estates.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '12px',
              color: 'var(--color-brand-stone)',
            }}
          >
            Experiences coming soon.
          </p>
        ) : (
          <ExperiencesEstateSwitcher estates={estates} tours={tours} />
        )}
      </div>
    </div>
  )
}
