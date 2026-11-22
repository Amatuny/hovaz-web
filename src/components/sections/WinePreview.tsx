import { WineCard } from '@/components/ui/WineCard'
import type { Wine } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'
import { SectionHead } from '@/components/ui/SectionHead'
import { StripEndCard } from '@/components/ui/StripEndCard'
import { TextLink } from '@/components/ui/TextLink'
import { mfig } from '@/lib/figmaScale'
import { HOME_DEFAULTS, type WineCardLabels } from '@/content/defaults'

interface WinePreviewProps {
  wines: Wine[]
  texts?: typeof HOME_DEFAULTS.wines
  cardLabels?: WineCardLabels
}

// Figma "wine" (3179:4672): section head, a strip of 350px wine cards 32px
// apart ending in a "Browse all wines" card, then the text link.
export function WinePreview({ wines, texts = HOME_DEFAULTS.wines, cardLabels }: WinePreviewProps) {
  if (!wines?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead eyebrow={texts.eyebrow} title={texts.heading} text={texts.text} />

        {/* Figma "event card sec": 32px between cards, scaled like the cards */}
        <DragScroll arrows className="flex snap-x snap-mandatory" style={{ gap: mfig(32, 32, 16) }}>
          {wines.map((wine) => (
            <div key={wine._id} className="shrink-0 snap-start">
              <WineCard wine={wine} labels={cardLabels} />
            </div>
          ))}
          <StripEndCard
            href="/wines"
            variant="wines"
            heading={texts.endHeading}
            button={texts.endButton}
          />
        </DragScroll>

        <TextLink href="/wines">{texts.linkText}</TextLink>
      </div>
    </section>
  )
}
