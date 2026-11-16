import type { Metadata } from 'next'
import { getAllNews, getNewsPage } from '@/lib/sanity/queries'
import { NewsAwards } from '@/components/sections/NewsAwards'
import { NEWS_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveNewsContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts and SEO are edited in Studio → Pages → News & Awards Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getNewsPage(), currentLocale()])
  return seoToMetadata(doc?.seo, locale, {
    title: NEWS_DEFAULTS.seo.metaTitle,
    description: NEWS_DEFAULTS.seo.metaDescription,
    url: 'https://hovazwines.com/news',
  })
}

export const revalidate = 3600

export default async function NewsPage() {
  const [news, doc, locale] = await Promise.all([getAllNews(), getNewsPage(), currentLocale()])
  return <NewsAwards news={news ?? []} content={resolveNewsContent(doc, locale)} />
}
