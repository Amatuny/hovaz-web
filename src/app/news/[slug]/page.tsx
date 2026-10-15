import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllNews, getAllNewsSlugs, getNewsBySlug } from '@/lib/sanity/queries'
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
  const item = await getNewsBySlug(slug)
  if (!item) return {}

  return {
    title: item.seo?.metaTitle ?? item.title,
    description: item.seo?.metaDescription ?? item.excerpt,
    openGraph: {
      title: `${item.title} — HOVAZ`,
      description: item.excerpt ?? '',
      url: `https://hovazwines.com/news/${slug}`,
      images: item.featuredImage?.asset?._ref
        ? [urlFor(item.featuredImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export const revalidate = 3600

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params

  const [item, news] = await Promise.all([getNewsBySlug(slug), getAllNews()])
  if (!item) notFound()

  // "Up Next" is the next-older story (newest-first list), wrapping around to the newest.
  const others = (news ?? []).filter((story) => story._id !== item._id)
  const index = (news ?? []).findIndex((story) => story._id === item._id)
  const upNext = others.length > 0 ? (news[index + 1] ?? others[0]) : null
  const moreStories = others.filter((story) => story._id !== upNext?._id)

  return (
    <>
      <NewsArticle item={item} upNext={upNext} moreStories={moreStories} />
      <PageTracker
        eventName="news_viewed"
        parameters={{ news_title: item.title, news_category: item.category }}
      />
    </>
  )
}
