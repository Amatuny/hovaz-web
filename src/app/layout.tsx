import type { Metadata } from 'next'
import {
  EB_Garamond,
  Fraunces,
  Inter,
  Hanken_Grotesk,
  Montserrat,
  Noto_Sans_Armenian,
  Playfair_Display,
  Work_Sans,
} from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/sanity/queries'
import { resolveFooterContent } from '@/lib/sanity/siteContent'
import { defaultLocale, isLocale } from '@/i18n/config'
import Script from 'next/script'
import { cookies } from 'next/headers'
import { AgeGate } from '@/components/layout/AgeGate'
import { AGE_COOKIE } from '@/lib/ageGate'
import { urlFor } from '@/lib/sanity/image'

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Figma uses Medium, SemiBold and Bold (+ Italic, Medium Italic, Bold Italic)
const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '500', '600', '700'],
  display: 'swap',
})

// Three fonts used by single spots in the Figma design. One weight each to
// keep the download small. None of them has Armenian letters, so every use
// falls back to Noto Sans Armenian for hy (see the font stacks in components).

/** "View all" cards: Regular on the wines card, Medium on the others */
const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
})

/** Leopard photo caption ("Rescued 2021") — Fraunces SemiBold, SOFT 0 / WONK 1.
 *  Loaded as the variable font so those two axes are available. Latin only. */
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['SOFT', 'WONK'],
  display: 'swap',
})

/** Line under each review ("Guided Tasting, Dilijan") — Work Sans Regular. Latin only. */
const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

const notoSansArmenian = Noto_Sans_Armenian({
  variable: '--font-armenian',
  subsets: ['armenian'],
  weight: ['500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'HOVAZ Wine Rooms — Premium Armenian Wine Experience',
    template: '%s — HOVAZ',
  },
  description:
    'Experience Armenian wine at its finest. Book wine tastings, experiences and events at HOVAZ Wine Rooms in Armenia.',
  keywords: [
    'Armenian wines',
    'wine experiences Armenia',
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
  const [settings, locale, cookieStore] = await Promise.all([
    getSiteSettings(),
    getLocale(),
    cookies(),
  ])
  const footerContent = resolveFooterContent(settings, isLocale(locale) ? locale : defaultLocale)
  const ageVerified = cookieStore.get(AGE_COOKIE)?.value === '1'
  const ageGateImage = settings?.ageGateImage?.asset
    ? settings.ageGateImage
    : settings?.heroGallery?.[0]
  const ageGateImageUrl = ageGateImage?.asset
    ? urlFor(ageGateImage).width(920).height(1100).url()
    : undefined
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${hankenGrotesk.variable} ${montserrat.variable} ${notoSansArmenian.variable} ${playfairDisplay.variable} ${ebGaramond.variable} ${fraunces.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
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
        <NextIntlClientProvider>
          <Navigation settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} content={footerContent} />
          <AgeGate verified={ageVerified} imageUrl={ageGateImageUrl} imageAlt={ageGateImage?.alt} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
