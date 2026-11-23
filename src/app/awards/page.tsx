import type { Metadata } from 'next'
import { getAllAwards, getNewsPage } from '@/lib/sanity/queries'
import { AwardsList } from '@/components/sections/AwardsList'
import { currentLocale, resolveNewsContent } from '@/lib/sanity/pageContent'

// Texts are edited in Studio → Pages → News & Awards Page → Awards Page;
// the rows are News & Awards items with category "Award".
export async function generateMetadata(): Promise<Metadata> {
  const [doc, locale] = await Promise.all([getNewsPage(), currentLocale()])
  const t = resolveNewsContent(doc, locale).awardsPage
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: 'https://hovazwines.com/awards' },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: 'https://hovazwines.com/awards',
    },
  }
}

export const revalidate = 3600

export default async function AwardsPage() {
  const [awards, doc, locale] = await Promise.all([getAllAwards(), getNewsPage(), currentLocale()])
  return (
    <AwardsList
      awards={awards ?? []}
      texts={resolveNewsContent(doc, locale).awardsPage}
      locale={locale}
    />
  )
}
