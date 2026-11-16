import type { Metadata } from 'next'
import { OurStory } from '@/components/sections/OurStory'
import { getOurStoryPage } from '@/lib/sanity/queries'
import { OUR_STORY_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveOurStoryContent, seoToMetadata } from '@/lib/sanity/pageContent'

export const revalidate = 3600

// Everything on this page is edited in Studio → Pages → Our Story Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getOurStoryPage(), currentLocale()])
  return seoToMetadata(doc?.seo, locale, {
    title: OUR_STORY_DEFAULTS.seo.metaTitle,
    description: OUR_STORY_DEFAULTS.seo.metaDescription,
    url: 'https://hovazwines.com/about/our-story',
  })
}

export default async function OurStoryPage() {
  const [doc, locale] = await Promise.all([getOurStoryPage(), currentLocale()])
  return <OurStory content={resolveOurStoryContent(doc, locale)} />
}
