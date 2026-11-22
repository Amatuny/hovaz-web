import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig, mfig } from '@/lib/figmaScale'
import type { MascotSettings } from '@/types/sanity'
import { HOME_DEFAULTS } from '@/content/defaults'
import { SectionHead } from '@/components/ui/SectionHead'
import { DarkPanelEmblem, darkPanelLabelStyle, darkPanelTextStyle } from '@/components/ui/DarkPanel'

interface MascotSectionProps {
  mascot?: MascotSettings
}

// Figma "Hovaz" (3179:4896): section head, then a 4-column grid with rows of
// 320 and 220px (24px gaps): the main photo spans 2×2, the dark story panel
// spans the top-right two columns, two small photos sit under it.
// Content comes from Site Settings → Mascot.
export function MascotSection({ mascot }: MascotSectionProps) {
  const heading = mascot?.heading
  if (!mascot || !heading) return null

  const paragraphs = (mascot.story ?? []).filter(Boolean).slice(0, 3)
  const gallery = (mascot.gallery ?? []).slice(0, 2)
  const radius = `max(16px, ${fig(24)})`

  return (
    <section
      id="leopard"
      className="section-padding scroll-mt-24"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead
          eyebrow={mascot.eyebrow || HOME_DEFAULTS.mascot.eyebrow}
          title={heading}
          text={mascot.subtitle}
        />

        <div className="relative overflow-hidden">
          <div
            className="mascot-grid relative grid grid-cols-1 lg:grid-cols-4"
            style={{ gap: mfig(16, 24) }}
          >
            {/* Main photo — 2×2 */}
            <div
              className="relative aspect-[396/564] overflow-hidden lg:col-span-2 lg:row-span-2 lg:aspect-auto"
              style={{ borderRadius: radius }}
            >
              {mascot.image?.asset?._ref ? (
                <Image
                  src={urlFor(mascot.image).width(1600).height(1134).url()}
                  alt={mascot.image.alt ?? heading}
                  fill
                  className="object-cover"
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

              {(mascot.imageBadgeTitle || mascot.imageBadgeSubtitle) && (
                <div
                  className="absolute flex flex-col"
                  style={{
                    left: fig(24),
                    right: fig(24),
                    bottom: `max(16px, ${fig(22)})`,
                    gap: fig(4),
                  }}
                >
                  {mascot.imageBadgeTitle && (
                    <h3
                      style={{
                        // Figma: Fraunces SemiBold, SOFT 0 / WONK 1 (Latin only —
                        // Armenian/Russian fall back to Noto Sans Armenian / Playfair)
                        fontFamily:
                          'var(--font-fraunces), var(--font-armenian), var(--font-playfair), serif',
                        fontWeight: 600,
                        fontVariationSettings: '"SOFT" 0, "WONK" 1',
                        fontSize: `max(22px, ${fig(28)})`,
                        color: '#fbf8f5',
                      }}
                    >
                      {mascot.imageBadgeTitle}
                    </h3>
                  )}
                  {mascot.imageBadgeSubtitle && (
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: `max(13px, ${fig(15)})`,
                        color: '#eae3de',
                      }}
                    >
                      {mascot.imageBadgeSubtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Story panel — top right, 2 columns */}
            <div
              className="relative flex min-h-[320px] flex-col justify-center overflow-y-auto lg:col-span-2 lg:min-h-0"
              style={{ borderRadius: radius, backgroundColor: '#231814' }}
            >
              <div
                className="flex flex-col"
                style={{ padding: mfig(32, 48, 28), gap: mfig(14, 14) }}
              >
                <p className="uppercase" style={darkPanelLabelStyle}>
                  {mascot.storyLabel || HOME_DEFAULTS.mascot.storyLabel}
                </p>
                <div className="flex flex-col">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} style={darkPanelTextStyle}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Two small photos */}
            {gallery.map((image, i) => (
              <div
                key={i}
                className="relative aspect-[396/220] overflow-hidden lg:aspect-auto"
                style={{ borderRadius: radius }}
              >
                {image?.asset?._ref ? (
                  <Image
                    src={urlFor(image).width(800).height(460).url()}
                    alt={image.alt ?? heading}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, 100vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'var(--color-brand-stone)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Emblem watermark over the right of the grid, as in Figma
              (desktop only - hidden in the mobile design) */}
          <div className="hidden lg:contents">
            <DarkPanelEmblem src="/home/emblem-mascot.svg" inset="-2.02% -15% -45.73% 68%" />
          </div>
        </div>
      </div>
    </section>
  )
}
