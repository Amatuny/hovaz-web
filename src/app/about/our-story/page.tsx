import type { Metadata } from 'next'
import { OurStory } from '@/components/sections/OurStory'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind HOVAZ Wine Rooms — passion for Armenian wine and hospitality.',
  openGraph: {
    title: 'Our Story — HOVAZ',
    description: 'The story behind HOVAZ Wine Rooms — passion for Armenian wine and hospitality.',
    url: 'https://hovazwines.com/about/our-story',
  },
}

export default function OurStoryPage() {
  return <OurStory />
}
