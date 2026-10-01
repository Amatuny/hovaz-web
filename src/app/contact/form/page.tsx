import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity/queries'
import { ContactUs } from '@/components/sections/ContactUs'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Questions about a visit, a booking, or the wines — get in touch with HOVAZ.',
  openGraph: {
    title: 'Contact Us — HOVAZ',
    description: 'Questions about a visit, a booking, or the wines — get in touch with HOVAZ.',
    url: 'https://hovazwines.com/contact/form',
  },
}

export const revalidate = 3600

export default async function ContactFormPage() {
  const settings = await getSiteSettings()
  return <ContactUs settings={settings} />
}
