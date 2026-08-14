import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/sanity/queries'
import Script from 'next/script'

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
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Navigation settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
