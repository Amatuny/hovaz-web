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
          Our Story
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
          {page.title}
        </h2>
        {page.subtitle && (
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
            <p
              className="mb-5 uppercase"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: 'var(--color-brand-gold)',
              }}
            >
              Our Story
            </p>
            <div className="flex flex-col gap-4">
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
        </div>

        <div className="mt-8">
          <Link
            href="/about/our-story"
            className="group inline-flex items-center gap-2 border-b-2 border-[#1a1d17] px-2 pb-1 transition-colors hover:border-[var(--color-brand-gold)]"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '1px',
              color: '#1a1d17',
            }}
          >
            <span className="transition-colors group-hover:text-[var(--color-brand-gold)]">
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
