import type { Metadata } from 'next'
import ExperiencesPage from '@/app/experiences/page'

// "Two Estates" shows the same estate switcher as /experiences, under its own URL
// so each nav link highlights independently.
export const metadata: Metadata = {
  title: 'Two Estates',
  description:
    'Discover our two HOVAZ estates — Proshyan and Dilijan — and the tastings each one offers.',
  openGraph: {
    title: 'Two Estates — HOVAZ',
    description: 'Discover our two HOVAZ estates and the tastings each one offers.',
    url: 'https://hovazwines.com/estates',
  },
}

export const revalidate = 3600

export default ExperiencesPage
