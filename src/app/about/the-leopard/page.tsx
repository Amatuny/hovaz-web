import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/sanity/queries'
import { PageLayout } from '@/components/layout/PageLayout'

export const metadata: Metadata = {
  title: 'The Leopard',
  description: 'The story of the Caucasian leopard — the symbol of HOVAZ.',
}

export const revalidate = 3600

export default async function TheLeopardPage() {
  const page = await getPageBySlug('the-leopard')

  return (
    <PageLayout
      label="Our Symbol"
      title={page?.title ?? 'The Leopard'}
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
