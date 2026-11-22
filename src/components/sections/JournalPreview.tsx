// src/components/sections/JournalPreview.tsx
// Homepage "The Journal" strip — latest news cards linking to /news/[slug].
// Figma "Section news" (3179:4900): section head (Medium title), 400×280 news
// cards 37px apart ending in a "View the full journal" card, then the link.
import type { NewsItem } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'
import { NewsCard } from '@/components/ui/NewsCard'
import { SectionHead } from '@/components/ui/SectionHead'
import { StripEndCard } from '@/components/ui/StripEndCard'
import { TextLink } from '@/components/ui/TextLink'
import { fig } from '@/lib/figmaScale'
import { HOME_DEFAULTS, type NewsCardLabels } from '@/content/defaults'

interface JournalPreviewProps {
  news: NewsItem[]
  texts?: typeof HOME_DEFAULTS.journal
  cardLabels?: NewsCardLabels
}

export function JournalPreview({
  news,
  texts = HOME_DEFAULTS.journal,
  cardLabels,
}: JournalPreviewProps) {
  if (!news?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col" style={{ gap: fig(48) }}>
        <SectionHead
          eyebrow={texts.eyebrow}
          title={texts.heading}
          text={texts.text}
          weight="medium"
        />

        <DragScroll
          arrows
          className="flex snap-x snap-mandatory"
          style={{ gap: `max(16px, ${fig(37)})` }}
        >
          {news.map((item) => (
            <NewsCard key={item._id} item={item} labels={cardLabels} />
          ))}
          <StripEndCard
            href="/news"
            variant="news"
            heading={texts.endHeading}
            button={texts.endButton}
          />
        </DragScroll>

        <TextLink href="/news">{texts.linkText}</TextLink>
      </div>
    </section>
  )
}
