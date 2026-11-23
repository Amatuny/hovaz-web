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
// sits in column 3 with one small photo under it, and the WWF adoption
// certificate fills column 4 across both rows (382 × 564).
// Content comes from Site Settings → Mascot.
export function MascotSection({ mascot }: MascotSectionProps) {
  const heading = mascot?.heading
  if (!mascot || !heading) return null

  const paragraphs = (mascot.story ?? []).filter(Boolean).slice(0, 3)
  const smallPhoto = mascot.gallery?.[0]
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

            {/* Story panel — column 3, top row */}
            <div
              className="relative flex min-h-[320px] flex-col justify-center overflow-y-auto lg:col-start-3 lg:row-start-1 lg:min-h-0"
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

            {/* Small photo — column 3, under the story panel */}
            {smallPhoto && (
              <div
                className="relative aspect-[382/220] overflow-hidden lg:col-start-3 lg:row-start-2 lg:aspect-auto"
                style={{ borderRadius: radius }}
              >
                {smallPhoto.asset?._ref ? (
                  <Image
                    src={urlFor(smallPhoto).width(800).height(460).url()}
                    alt={smallPhoto.alt ?? heading}
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
            )}

            {/* Certificate — column 4, full height of both rows (382 × 564).
                From Studio when set; otherwise the scan from the design,
                cropped as in Figma (scaled 118% × 115%, so the scan's edges
                fall outside the card). */}
            <div
              className="relative aspect-[382/564] overflow-hidden lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:aspect-auto"
              style={{ borderRadius: radius, backgroundColor: '#f2eddd' }}
            >
              {mascot.certificate?.asset?._ref ? (
                <Image
                  src={urlFor(mascot.certificate).width(764).height(1128).url()}
                  alt={mascot.certificate.alt ?? heading}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
              ) : (
                <Image
                  src="/home/mascot-certificate.jpg"
                  alt="WWF leopard adoption certificate for Hovaz"
                  width={779}
                  height={1123}
                  className="absolute max-w-none"
                  style={{ width: '118%', height: '115.21%', left: '-9%', top: '-7.61%' }}
                  sizes="(min-width: 1024px) 30vw, 118vw"
                />
              )}
            </div>
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
