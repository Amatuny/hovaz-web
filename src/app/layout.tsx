import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/sanity/queries'

const serif = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'HOVAZ Wine Rooms — Premium Armenian Wine Experience',
    template: '%s — HOVAZ',
  },
  description:
    'Experience Armenian wine at its finest. Book wine tastings, tours and events at HOVAZ Wine Rooms in Armenia.',
  keywords: [
    'Armenian wines',
    'wine tours Armenia',
    'winery Armenia',
    'wine tasting Armenia',
    'quality Armenian wines',
    'HOVAZ',
    'wine rooms Armenia',
  ],
  authors: [{ name: 'HOVAZ Wine Rooms' }],
  creator: 'HOVAZ Wine Rooms',
  metadataBase: new URL('https://hovazwines.com'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      hy: '/hy',
      ru: '/ru',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hovazwines.com',
    siteName: 'HOVAZ Wine Rooms',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'HOVAZ Wine Rooms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOVAZ Wine Rooms',
    description: 'Premium Armenian winery and hospitality experience.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Navigation settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
