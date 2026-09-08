import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Page, SanityBlock } from '@/types/sanity'

interface MascotSectionProps {
  page: Page | null
}

function blockText(block: SanityBlock) {
  return block.children?.map((child) => child.text).join('') ?? ''
}

export function MascotSection({ page }: MascotSectionProps) {
  if (!page) return null

  const paragraphs = (page.body ?? [])
    .filter((block) => block._type === 'block' && block.children?.length)
    .slice(0, 3)
    .map(blockText)

  const gallery = page.gallery ?? []

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p className="text-label mb-3" style={{ color: 'var(--color-brand-stone)' }}>
          Meet The Mascot
        </p>
        <h2 className="heading-section mb-4 max-w-2xl">{page.title}</h2>
        {page.subtitle && (
          <p className="mb-10 max-w-2xl text-base" style={{ color: 'var(--color-brand-stone)' }}>
            {page.subtitle}
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
            {page.featuredImage?.asset?._ref ? (
              <Image
                src={urlFor(page.featuredImage).width(1000).height(1300).url()}
                alt={page.featuredImage.alt ?? page.title}
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

            {(page.imageBadgeTitle || page.imageBadgeSubtitle) && (
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
                {page.imageBadgeTitle && (
                  <h3
                    className="mb-1 font-serif text-white"
                    style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                  >
                    {page.imageBadgeTitle}
                  </h3>
                )}
                {page.imageBadgeSubtitle && (
                  <p className="text-sm text-white/80">{page.imageBadgeSubtitle}</p>
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
              <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
                His Story
              </p>
              <div className="flex flex-col gap-3">
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-sm text-white/80" style={{ lineHeight: 1.75 }}>
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
                        alt={image.alt ?? page.title}
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

        <div className="mt-10">
          <Link
            href="/about/the-leopard"
            className="group inline-flex items-center gap-2 font-sans text-base"
            style={{ color: 'var(--color-brand-charcoal)' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Meet Hovaz
            </span>
            <span
              aria-hidden="true"
              className="transition-colors group-hover:text-[var(--color-brand-gold)]"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
