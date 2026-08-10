import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind HOVAZ Wine Rooms — passion for Armenian wine and hospitality.',
}

export const revalidate = 3600

export default async function OurStoryPage() {
  const page = await getPageBySlug('our-story')

  return (
    <PageLayout
      label="About HOVAZ"
      title={page?.title ?? 'Our Story'}
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
