import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'Sustainability',
  description: 'Our commitment to sustainable winemaking and Armenian land.',
}

export const revalidate = 3600

export default async function SustainabilityPage() {
  const page = await getPageBySlug('sustainability')

  return (
    <PageLayout
      label="Our Values"
      title={page?.title ?? 'Sustainability'}
      subtitle={page?.subtitle}
      featuredImage={page?.featuredImage}
      body={page?.body}
      ctaText={page?.ctaText ?? 'Book an Experience'}
      ctaLink={page?.ctaLink ?? '/events'}
      backHref="/about/our-story"
      backLabel="About"
    />
  )
}
