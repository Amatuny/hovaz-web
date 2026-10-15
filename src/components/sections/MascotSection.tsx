import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { MascotSettings } from '@/types/sanity'

interface MascotSectionProps {
  mascot?: MascotSettings
}

// Content comes from Site Settings → Mascot.
export function MascotSection({ mascot }: MascotSectionProps) {
  const heading = mascot?.heading
  if (!mascot || !heading) return null

  const paragraphs = (mascot.story ?? []).filter(Boolean).slice(0, 3)
  const gallery = (mascot.gallery ?? []).slice(0, 2)

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p
          className="mb-4 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '2.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          Meet The Mascot
        </p>
        <h2
          className="mb-4 max-w-[870px] capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: 'clamp(26px, 2.6vw, 36px)',
            color: '#1a1d17',
            letterSpacing: '0.5px',
            lineHeight: 1.15,
          }}
        >
          {heading}
        </h2>
        {mascot.subtitle && (
          <p
            className="mb-10 max-w-[860px]"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '26px',
              color: '#4f4542',
            }}
          >
            {mascot.subtitle}
          </p>
        )}

        <div
          className="flex flex-col gap-4 md:flex-row"
          style={{ height: 'clamp(480px, 66vh, 620px)' }}
        >
          {/* Main photo */}
          <div
            className="relative overflow-hidden rounded-2xl lg:rounded-3xl"
            style={{ flex: '1.4 1 0%', minWidth: 0 }}
          >
            {mascot.image?.asset?._ref ? (
              <Image
                src={urlFor(mascot.image).width(1000).height(1300).url()}
                alt={mascot.image.alt ?? heading}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
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
                background:
                  'linear-gradient(to top, rgba(26,10,13,0.75) 0%, rgba(26,10,13,0.05) 40%, rgba(26,10,13,0.1) 100%)',
              }}
            />

            {(mascot.imageBadgeTitle || mascot.imageBadgeSubtitle) && (
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
                {mascot.imageBadgeTitle && (
                  <h3
                    className="mb-1 text-white"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontWeight: 600,
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                    }}
                  >
                    {mascot.imageBadgeTitle}
                  </h3>
                )}
                {mascot.imageBadgeSubtitle && (
                  <p
                    className="text-white/80"
                    style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px' }}
                  >
                    {mascot.imageBadgeSubtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Story + gallery */}
          <div className="flex flex-col gap-4" style={{ flex: '1 1 0%', minWidth: 0 }}>
            <div
              className="flex flex-col overflow-y-auto rounded-2xl p-6 lg:rounded-3xl lg:p-9"
              style={{ backgroundColor: 'var(--color-brand-dark)', flex: '1.6 1 0%' }}
            >
              <p
                className="mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '1.5px',
                  color: 'var(--color-brand-gold)',
                }}
              >
                His Story
              </p>
              <div className="flex flex-col gap-3">
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-white/80"
                    style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', lineHeight: 1.75 }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 gap-4" style={{ flex: '1 1 0%' }}>
                {gallery.map((image, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
                    {image?.asset?._ref ? (
                      <Image
                        src={urlFor(image).width(500).height(500).url()}
                        alt={image.alt ?? heading}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 20vw, 50vw"
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
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
