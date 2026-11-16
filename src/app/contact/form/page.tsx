import type { Metadata } from 'next'
import { getContactPage, getSiteSettings } from '@/lib/sanity/queries'
import { ContactUs } from '@/components/sections/ContactUs'
import { CONTACT_DEFAULTS } from '@/content/defaults'
import { currentLocale, resolveContactContent, seoToMetadata } from '@/lib/sanity/pageContent'

// Texts and SEO are edited in Studio → Pages → Contact Page
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getContactPage(), currentLocale()])
  return seoToMetadata(doc?.seo, locale, {
    title: CONTACT_DEFAULTS.seo.contact.metaTitle,
    description: CONTACT_DEFAULTS.seo.contact.metaDescription,
    url: 'https://hovazwines.com/contact/form',
  })
}

export const revalidate = 3600

export default async function ContactFormPage() {
  const [settings, doc, locale] = await Promise.all([
    getSiteSettings(),
    getContactPage(),
    currentLocale(),
  ])
  return <ContactUs settings={settings} content={resolveContactContent(doc, locale)} />
}
