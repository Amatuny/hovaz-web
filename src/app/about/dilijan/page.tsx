import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'

export const revalidate = 3600

export default async function DilijanPage() {
  const page = await getPageBySlug('dilijan')
  return (
    <PageLayout
      label="Our Locations"
      title={page?.title ?? 'Dilijan Wine Rooms'}
      subtitle={page?.subtitle}
      featuredImage={page?.featuredImage}
      body={page?.body}
      ctaText="Book an Experience"
      ctaLink="/events"
    />
  )
}
