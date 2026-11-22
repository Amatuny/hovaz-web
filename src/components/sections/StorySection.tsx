import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { mfig } from '@/lib/figmaScale'
import type { SanityImage } from '@/types/sanity'
import { HOME_DEFAULTS } from '@/content/defaults'
import { SectionHead } from '@/components/ui/SectionHead'
import { TextLink } from '@/components/ui/TextLink'
import { DarkPanelEmblem, darkPanelLabelStyle, darkPanelTextStyle } from '@/components/ui/DarkPanel'

interface StorySectionProps {
  /** Site Settings → Homepage → Our Story Section */
  texts?: typeof HOME_DEFAULTS.story
  image?: SanityImage
}

// Figma "about Us" (3179:4749): section head, then a photo and a dark story
// panel side by side (each half, 560px tall, 24px gap), then the text link.
export function StorySection({ texts = HOME_DEFAULTS.story, image }: StorySectionProps) {
  // Paragraphs are separated by an empty line in Studio
  const paragraphs = texts.panelText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const radius = mfig(24, 24, 16)

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead eyebrow={texts.eyebrow} title={texts.heading} text={texts.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: mfig(8, 24) }}>
          {/* Photo */}
          <div
            className="relative overflow-hidden"
            // --story-h: the tablet frame uses 460 (set in globals.css)
            style={{ height: `var(--story-h, ${mfig(470, 560, 320)})`, borderRadius: radius }}
          >
            {image?.asset?._ref ? (
              <Image
                src={urlFor(image).width(1000).height(710).url()}
                alt={image.alt ?? texts.heading}
                fill
                className="object-cover object-bottom"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(18,8,5,0.75) 0%, rgba(18,8,5,0) 55%)',
              }}
            />
          </div>

          {/* Narrative panel */}
          <div
            className="relative flex flex-col justify-center overflow-hidden"
            style={{
              minHeight: `var(--story-h, ${mfig(470, 560, 320)})`,
              borderRadius: radius,
              backgroundColor: '#231814',
            }}
          >
            <div
              className="relative flex flex-col"
              style={{ padding: mfig(24, 48, 28), gap: mfig(24, 24) }}
            >
              <p className="uppercase" style={darkPanelLabelStyle}>
                {texts.panelLabel}
              </p>
              <div className="flex flex-col">
                {paragraphs.map((paragraph, i) => (
                  <p key={i} style={darkPanelTextStyle}>
                    {paragraph}
                  </p>
                ))}
              </div>
              <DarkPanelEmblem
                src="/home/emblem-story.svg"
                inset="-20.98% -28.16% -40.85% 51.52%"
              />
            </div>
          </div>
        </div>

        <TextLink href="/about/our-story">{texts.linkText}</TextLink>
      </div>
    </section>
  )
}
