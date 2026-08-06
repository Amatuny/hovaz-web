import type { Metadata } from 'next'
import { getSiteSettings, getAllWines, getUpcomingEvents, getAllNews } from '@/lib/sanity/queries'
import { HeroSection } from '@/components/sections/HeroSection'
import { EventsStrip } from '@/components/sections/EventsStrip'
import { WinePreview } from '@/components/sections/WinePreview'
import { WineRoomsBlock } from '@/components/sections/WineRoomsBlock'
import { AwardsStrip } from '@/components/sections/AwardsStrip'
import type { NewsItem } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'HOVAZ Wine Rooms — Premium Armenian Wine Experience',
  description:
    'Experience Armenian wine at its finest. Book wine tastings, tours and events at HOVAZ Wine Rooms in Armenia.',
  openGraph: {
    title: 'HOVAZ Wine Rooms',
    description: 'Premium Armenian winery and hospitality experience.',
    url: 'https://hovazwines.com',
  },
}

export const revalidate = 3600

export default async function HomePage() {
  const [settings, wines, events, news] = await Promise.all([
    getSiteSettings(),
    getAllWines(),
    getUpcomingEvents(),
    getAllNews(),
  ])

  const awards = ((news as NewsItem[]) ?? []).filter((item: NewsItem) => item.category === 'award')

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline}
        subheadline={settings?.heroSubheadline}
        ctaText={settings?.heroCtaText}
        heroImage={settings?.heroImage}
      />
      <EventsStrip events={events ?? []} />
      <WinePreview wines={wines ?? []} />
      <WineRoomsBlock />
      <AwardsStrip awards={awards} />
    </>
  )
}
