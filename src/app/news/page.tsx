import type { Metadata } from 'next'
import { getAllNews } from '@/lib/sanity/queries'
import { NewsAwards } from '@/components/sections/NewsAwards'

export const metadata: Metadata = {
  title: 'News & Awards',
  description: 'Awards, new releases, press features and estate news from HOVAZ.',
  openGraph: {
    title: 'News & Awards — HOVAZ',
    description: 'Awards, new releases, press features and estate news from HOVAZ.',
    url: 'https://hovazwines.com/news',
  },
}

export const revalidate = 3600

export default async function NewsPage() {
  const news = await getAllNews()
  return <NewsAwards news={news ?? []} />
}
