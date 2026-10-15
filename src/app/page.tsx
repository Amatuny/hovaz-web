import type { Metadata } from 'next'
import {
  getSiteSettings,
  getAllWines,
  getAllTours,
  getJournalEvents,
  getAllNews,
  getAllEstates,
  getPageBySlug,
} from '@/lib/sanity/queries'
import { HeroSection } from '@/components/sections/HeroSection'
import { EstatesSection } from '@/components/sections/EstatesSection'
import { WineTourSection } from '@/components/sections/WineTourSection'
import { EventsStrip } from '@/components/sections/EventsStrip'
import { WinePreview } from '@/components/sections/WinePreview'
import { StorySection } from '@/components/sections/StorySection'
import { AwardsStrip } from '@/components/sections/AwardsStrip'
import { MascotSection } from '@/components/sections/MascotSection'
import { JournalPreview } from '@/components/sections/JournalPreview'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { SectionDivider } from '@/components/ui/SectionDivider'
import type { NewsItem } from '@/types/sanity'
import { JsonLd } from '@/components/sanity/JsonLd'

export const metadata: Metadata = {
  title: 'HOVAZ Wine Rooms — Premium Armenian Wine Experience',
  description:
    'Experience Armenian wine at its finest. Book wine tastings, experiences and events at HOVAZ Wine Rooms in Armenia.',
  openGraph: {
    title: 'HOVAZ Wine Rooms',
    description: 'Premium Armenian winery and hospitality experience.',
    url: 'https://hovazwines.com',
  },
}

export const revalidate = 3600

export default async function HomePage() {
  const [settings, wines, tours, events, news, estates, storyPage] = await Promise.all([
    getSiteSettings(),
    getAllWines(),
    getAllTours(),
    getJournalEvents(),
    getAllNews(),
    getAllEstates(),
    getPageBySlug('our-story'),
  ])

  const awards = ((news as NewsItem[]) ?? []).filter((item: NewsItem) => item.category === 'award')

  return (
    <div className="home-sections">
      <HeroSection
        headline={settings?.heroHeadline}
        subheadline={settings?.heroSubheadline}
        location={settings?.heroLocation}
        ctaText={settings?.heroCtaText}
        gallery={settings?.heroGallery}
      />
      <EstatesSection estates={estates ?? []} />
      <SectionDivider variant="vine" />
      <WineTourSection images={settings?.wineTourGallery ?? []} />
      <WinePreview wines={wines ?? []} />
      <SectionDivider variant="symbol" />
      <StorySection page={storyPage} />
      <AwardsStrip awards={awards} />
      <EventsStrip tours={tours ?? []} events={events ?? []} />
      <SectionDivider variant="symbol" />
      <MascotSection mascot={settings?.mascot} />
      <JournalPreview news={news ?? []} />
      <NewsletterSection />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Winery',
          name: 'HOVAZ Wine Rooms',
          url: 'https://hovazwines.com',
          description: 'Premium Armenian winery and hospitality experience.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'AM',
            addressLocality: 'Armenia',
          },
          sameAs: [
            'https://www.instagram.com/hovazwinerooms/',
            'https://www.instagram.com/hovaz_wines/',
          ],
        }}
      />
    </div>
  )
}
