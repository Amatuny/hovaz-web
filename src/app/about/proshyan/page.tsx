import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'Proshyan Wine Rooms',
  description: 'HOVAZ Wine Rooms in Proshyan — set in the historic village close to the vineyards.',
}

export const revalidate = 3600

export default async function ProshyanPage() {
  const page = await getPageBySlug('proshyan')

  return (
    <PageLayout
      label="Our Locations"
      title={page?.title ?? 'Proshyan Wine Rooms'}
      subtitle={page?.subtitle}
      featuredImage={page?.featuredImage}
      body={page?.body}
      ctaText="Book an Experience"
      ctaLink="/events"
      backHref="/about/our-story"
      backLabel="About"
    />
  )
}
