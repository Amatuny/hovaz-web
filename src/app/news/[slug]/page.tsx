import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllNews, getAllNewsSlugs, getNewsBySlug, getNewsPage } from '@/lib/sanity/queries'
import { currentLocale, resolveNewsContent, seoToMetadata } from '@/lib/sanity/pageContent'
import type { TextSource } from '@/lib/sanity/localize'
import { urlFor } from '@/lib/sanity/image'
import { NewsArticle } from '@/components/sections/NewsArticle'
import { PageTracker } from '@/components/analytics/PageTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [item, locale] = await Promise.all([getNewsBySlug(slug), currentLocale()])
  if (!item) return {}

  // The article's own SEO fields win; otherwise its title + excerpt
  return seoToMetadata(item.seo as TextSource | undefined, locale, {
    title: item.title,
    description: item.excerpt,
    url: `https://hovazwines.com/news/${slug}`,
    image: item.featuredImage?.asset?._ref
      ? urlFor(item.featuredImage).width(1200).height(630).url()
      : undefined,
  })
}

export const revalidate = 3600

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params

  const [item, news, doc, locale] = await Promise.all([
    getNewsBySlug(slug),
    getAllNews(),
    getNewsPage(),
    currentLocale(),
  ])
  if (!item) notFound()

  // "Up Next" is the next-older story (newest-first list), wrapping around to the newest.
  const others = (news ?? []).filter((story) => story._id !== item._id)
  const index = (news ?? []).findIndex((story) => story._id === item._id)
  const upNext = others.length > 0 ? (news[index + 1] ?? others[0]) : null
  const moreStories = others.filter((story) => story._id !== upNext?._id)

  return (
    <>
      <NewsArticle
        item={item}
        upNext={upNext}
        moreStories={moreStories}
        content={resolveNewsContent(doc, locale)}
      />
      <PageTracker
        eventName="news_viewed"
        parameters={{ news_title: item.title, news_category: item.category }}
      />
    </>
  )
}
