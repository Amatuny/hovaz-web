import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Page, SanityBlock } from '@/types/sanity'

interface StorySectionProps {
  page: Page | null
}

function blockText(block: SanityBlock) {
  return block.children?.map((child) => child.text).join('') ?? ''
}

export function StorySection({ page }: StorySectionProps) {
  if (!page) return null

  const paragraphs = (page.body ?? [])
    .filter((block) => block._type === 'block' && block.children?.length)
    .slice(0, 2)
    .map(blockText)

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
          Our Story
        </p>
        <h2 className="heading-section mb-4 max-w-2xl">{page.title}</h2>
        {page.subtitle && (
          <p className="mb-10 max-w-2xl text-base" style={{ color: 'var(--color-brand-stone)' }}>
            {page.subtitle}
          </p>
        )}

        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          style={{ height: 'clamp(360px, 48vh, 460px)' }}
        >
          {/* Photo */}
          <div className="relative h-full overflow-hidden rounded-2xl lg:rounded-3xl">
            {page.featuredImage?.asset?._ref ? (
              <Image
                src={urlFor(page.featuredImage).width(900).height(700).url()}
                alt={page.featuredImage.alt ?? page.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
              />
            )}
          </div>

          {/* Narrative panel */}
          <div
            className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl p-8 lg:rounded-3xl lg:p-12"
            style={{ backgroundColor: 'var(--color-brand-dark)' }}
          >
            <p className="text-label mb-5" style={{ color: 'var(--color-brand-gold)' }}>
              Our Story
            </p>
            <div className="flex flex-col gap-4">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="text-sm text-white/80" style={{ lineHeight: 1.75 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/about/our-story"
            className="group inline-flex items-center gap-2 font-sans text-base"
            style={{ color: 'var(--color-brand-charcoal)' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Read Our Story
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
