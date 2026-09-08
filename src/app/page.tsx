import type { Metadata } from 'next'
import {
  getSiteSettings,
  getAllWines,
  getAllTours,
  getJournalEvents,
  getAllNews,
  getAllBlogPosts,
  getAllEstates,
  getPageBySlug,
} from '@/lib/sanity/queries'
import { HeroSection } from '@/components/sections/HeroSection'
import { EstatesSection } from '@/components/sections/EstatesSection'
import { EventsStrip } from '@/components/sections/EventsStrip'
import { WinePreview } from '@/components/sections/WinePreview'
import { StorySection } from '@/components/sections/StorySection'
import { AwardsStrip } from '@/components/sections/AwardsStrip'
import { MascotSection } from '@/components/sections/MascotSection'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import type { NewsItem } from '@/types/sanity'
import { JsonLd } from '@/components/sanity/JsonLd'

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
  const [settings, wines, tours, events, news, posts, estates, storyPage, leopardPage] =
    await Promise.all([
      getSiteSettings(),
      getAllWines(),
      getAllTours(),
      getJournalEvents(),
      getAllNews(),
      getAllBlogPosts(),
      getAllEstates(),
      getPageBySlug('our-story'),
      getPageBySlug('the-leopard'),
    ])

  const awards = ((news as NewsItem[]) ?? []).filter((item: NewsItem) => item.category === 'award')

  return (
    <>
      <HeroSection
        headline={settings?.heroHeadline}
        subheadline={settings?.heroSubheadline}
        location={settings?.heroLocation}
        ctaText={settings?.heroCtaText}
        gallery={settings?.heroGallery}
      />
      <EstatesSection estates={estates ?? []} />
      <WinePreview wines={wines ?? []} />
      <StorySection page={storyPage} />
      <AwardsStrip awards={awards} />
      <EventsStrip tours={tours ?? []} events={events ?? []} />
      <MascotSection page={leopardPage} />
      <BlogPreview posts={posts ?? []} />
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
    </>
  )
}
