import type { Metadata } from 'next'
import {
  getSiteSettings,
  getAllWines,
  getAllTours,
  getJournalEvents,
  getAllNews,
  getAllEstates,
  getWinesPage,
  getEventsPage,
  getNewsPage,
} from '@/lib/sanity/queries'
import {
  resolveEventCardLabels,
  resolveNewsCardLabels,
  resolveWineCardLabels,
} from '@/lib/sanity/pageContent'
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
import { getLocale } from 'next-intl/server'
import { defaultLocale, isLocale } from '@/i18n/config'
import { resolveHomeContent } from '@/lib/sanity/siteContent'

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
  const [
    settings,
    wines,
    tours,
    events,
    news,
    estates,
    winesPage,
    eventsPage,
    newsPage,
    rawLocale,
  ] = await Promise.all([
    getSiteSettings(),
    getAllWines(),
    getAllTours(),
    getJournalEvents(),
    getAllNews(),
    getAllEstates(),
    getWinesPage(),
    getEventsPage(),
    getNewsPage(),
    getLocale(),
  ])

  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale
  // All section texts, in the visitor's language — editable in Site Settings → Homepage
  const content = resolveHomeContent(settings, locale)

  const awards = ((news as NewsItem[]) ?? []).filter((item: NewsItem) => item.category === 'award')

  return (
    <div className="home-sections">
      <HeroSection
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        location={content.hero.location}
        ctaText={content.hero.ctaText}
        secondaryCtaText={content.hero.secondaryCtaText}
        gallery={settings?.heroGallery}
      />
      <EstatesSection estates={estates ?? []} texts={content.estates} />
      <SectionDivider variant="vine" />
      <WineTourSection images={settings?.wineTourGallery ?? []} texts={content.wineTour} />
      <WinePreview
        wines={wines ?? []}
        texts={content.wines}
        cardLabels={resolveWineCardLabels(winesPage, locale)}
      />
      <SectionDivider variant="symbol" />
      <StorySection texts={content.story} image={content.storyImage} />
      <AwardsStrip awards={awards} texts={content.awards} />
      <EventsStrip
        tours={tours ?? []}
        events={events ?? []}
        texts={content.events}
        cardLabels={resolveEventCardLabels(eventsPage, locale)}
      />
      <SectionDivider variant="symbol" />
      <MascotSection mascot={content.mascot} />
      <JournalPreview
        news={news ?? []}
        texts={content.journal}
        cardLabels={resolveNewsCardLabels(newsPage, locale)}
      />
      <NewsletterSection texts={content.newsletter} />
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
