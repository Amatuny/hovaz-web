// src/components/sections/NewsArticle.tsx
// The /news/[slug] page body (Figma "article" frame, node 722:12901).
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import { formatNewsMonthLong, newsCategoryLabel } from '@/lib/news'
import { Ornament } from '@/components/ui/Ornament'
import { NewsStoryCard } from '@/components/ui/NewsStoryCard'
import { MoreStoriesCarousel } from '@/components/sections/MoreStoriesCarousel'
import type { NewsItem, SanityImage } from '@/types/sanity'

interface NewsArticleProps {
  item: NewsItem
  upNext: NewsItem | null
  moreStories: NewsItem[]
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: fig(11),
  letterSpacing: fig(2.5),
  color: 'rgba(93,110,82,0.92)',
}

const paragraphStyle: CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(16),
  lineHeight: fig(29.7),
  color: '#4f4542',
}

// Plain-text fields hold paragraphs separated by blank lines.
function toParagraphs(text?: string) {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function Paragraphs({ text }: { text?: string }) {
  return (
    <div className="flex flex-col" style={{ gap: fig(29.7) }}>
      {toParagraphs(text).map((paragraph, i) => (
        <p key={i} style={paragraphStyle}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function GridImage({ image, height, alt }: { image: SanityImage; height: number; alt: string }) {
  return (
    <div
      className="relative min-h-[260px] overflow-hidden"
      style={{ height: fig(height), borderRadius: fig(24), backgroundColor: '#b5adad' }}
    >
      <Image
        src={urlFor(image).width(1200).url()}
        alt={image.alt ?? alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 600px"
      />
    </div>
  )
}

function HighlightCard({ label, text, height }: { label: string; text: string; height: number }) {
  return (
    <div
      className="flex flex-col justify-center"
      style={{
        minHeight: fig(height),
        padding: fig(64),
        gap: fig(16),
        borderRadius: fig(24),
        backgroundColor: '#231b18',
      }}
    >
      <p className="uppercase" style={{ ...eyebrowStyle, color: '#e0a07a' }}>
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontSize: fig(15),
          lineHeight: fig(26),
          color: 'rgba(255,255,255,0.88)',
        }}
      >
        {text}
      </p>
    </div>
  )
}

// Figma: left column = photo over the 2nd card, right column = 1st card over a photo.
function PhotoGrid({ item }: { item: NewsItem }) {
  const images = (item.gallery ?? []).filter((image) => image?.asset?._ref)
  const highlights = item.highlights ?? []
  if (images.length === 0 && highlights.length === 0) return null

  const left: ReactNode[] = []
  const right: ReactNode[] = []
  if (images[0]) left.push(<GridImage key="img0" image={images[0]} height={564} alt={item.title} />)
  if (highlights[1]) left.push(<HighlightCard key="hl1" {...highlights[1]} height={260} />)
  if (highlights[0]) right.push(<HighlightCard key="hl0" {...highlights[0]} height={320} />)
  if (images[1])
    right.push(<GridImage key="img1" image={images[1]} height={504} alt={item.title} />)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: fig(24) }}>
      {[left, right]
        .filter((column) => column.length > 0)
        .map((column, i) => (
          <div key={i} className="flex flex-col" style={{ gap: fig(24) }}>
            {column}
          </div>
        ))}
    </div>
  )
}

export function NewsArticle({ item, upNext, moreStories }: NewsArticleProps) {
  const month = formatNewsMonthLong(item.date)
  const meta = [month, item.place].filter(Boolean).join(' · ')
  const hasDetails = item.detailsTitle || toParagraphs(item.detailsText).length > 0

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col pt-12 pb-12" style={{ gap: fig(82) }}>
        {/* Header */}
        <header className="flex flex-col" style={{ gap: fig(16), maxWidth: fig(860) }}>
          <p
            className="uppercase"
            style={{ ...eyebrowStyle, fontSize: fig(12), letterSpacing: fig(3) }}
          >
            {newsCategoryLabel(item)}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: fig(44),
              letterSpacing: fig(0.5),
              lineHeight: 1.2,
              color: '#1a1d17',
            }}
          >
            {item.title}
          </h1>
          {meta && (
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(16), color: '#4f4542' }}>
              {meta}
            </p>
          )}
        </header>

        <div className="mx-auto flex w-full flex-col" style={{ maxWidth: fig(1200), gap: fig(82) }}>
          {item.featuredImage?.asset?._ref && (
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: '1200 / 568', borderRadius: fig(24) }}
            >
              <Image
                src={urlFor(item.featuredImage).width(2400).url()}
                alt={item.featuredImage.alt ?? item.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
          )}

          <Ornament variant="vine" />

          {item.intro && (
            <div style={{ maxWidth: fig(1051) }}>
              <Paragraphs text={item.intro} />
            </div>
          )}

          <PhotoGrid item={item} />

          {item.body && item.body.length > 0 && (
            <div className="flex flex-col" style={{ gap: fig(29.7) }}>
              <PortableText
                value={item.body}
                components={{
                  block: { normal: ({ children }) => <p style={paragraphStyle}>{children}</p> },
                  marks: {
                    strong: ({ children }) => (
                      <strong style={{ fontWeight: 600, color: '#1a1d17' }}>{children}</strong>
                    ),
                    link: ({ children, value }) => (
                      <a
                        href={value?.href}
                        className="underline"
                        style={{ color: 'var(--color-brand-burgundy)' }}
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            </div>
          )}

          {item.quote && (
            <blockquote
              style={{
                paddingInline: fig(31),
                paddingBlock: fig(24),
                borderLeft: `${fig(3)} solid #a8a290`,
                borderTopRightRadius: fig(16),
                borderBottomRightRadius: fig(16),
                backgroundColor: '#f2ecdd',
              }}
            >
              <p
                className="italic"
                style={{
                  maxWidth: fig(640),
                  fontFamily: 'var(--font-playfair)',
                  fontSize: fig(20),
                  lineHeight: fig(28.5),
                  color: '#1a1d17',
                }}
              >
                {item.quote}
              </p>
            </blockquote>
          )}

          {hasDetails && (
            <section className="flex flex-col" style={{ gap: fig(24) }}>
              {item.detailsTitle && (
                <h2 className="uppercase" style={eyebrowStyle}>
                  {item.detailsTitle}
                </h2>
              )}
              <Paragraphs text={item.detailsText} />
            </section>
          )}

          {upNext && (
            <section className="flex flex-col" style={{ gap: fig(20) }}>
              <p className="uppercase" style={eyebrowStyle}>
                Up Next
              </p>
              <NewsStoryCard item={upNext} />
            </section>
          )}
        </div>

        {moreStories.length > 0 && <MoreStoriesCarousel items={moreStories} />}

        <Ornament variant="symbol" />
      </div>
    </div>
  )
}
