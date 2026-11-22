import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig, mfig } from '@/lib/figmaScale'
import type { SanityImage } from '@/types/sanity'
import { HOME_DEFAULTS } from '@/content/defaults'
import { SectionHead } from '@/components/ui/SectionHead'

interface WineTourSectionProps {
  images: SanityImage[]
  texts?: typeof HOME_DEFAULTS.wineTour
}

// Figma "tour section" (wine--reserve 3179:4643): one large photo (788×814 at
// 1600) beside a 2×2 grid of 382×395 photos, 24px gaps, 24px radius, each with
// a dark bottom gradient.
const LARGE_GRADIENT =
  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 66.8%, rgba(0,0,0,1) 100%)'
const SMALL_GRADIENT =
  'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.39) 45%, rgba(0,0,0,0.86) 100%)'

function Photo({
  image,
  gradient,
  aspectClass,
  width,
  height,
  sizes,
}: {
  image: SanityImage
  gradient: string
  aspectClass: string
  width: number
  height: number
  sizes: string
}) {
  return (
    <div
      className={`relative overflow-hidden ${aspectClass}`}
      style={{ borderRadius: `max(16px, ${fig(24)})` }}
    >
      <Image
        src={urlFor(image).width(width).height(height).url()}
        alt={image.alt ?? 'Wine experience'}
        fill
        className="object-cover"
        sizes={sizes}
      />
      <div className="absolute inset-0" style={{ background: gradient }} />
    </div>
  )
}

export function WineTourSection({ images, texts = HOME_DEFAULTS.wineTour }: WineTourSectionProps) {
  if (!images?.length) return null

  const [large, ...rest] = images
  const gridImages = rest.slice(0, 4)

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col" style={{ gap: mfig(32, 48) }}>
        <SectionHead eyebrow={texts.eyebrow} title={texts.heading} text={texts.text} />

        {/* Mobile Figma: a sideways strip of 320 x 361 cards, 24px apart,
            running off the right edge */}
        <div className="-mr-4 flex snap-x snap-mandatory gap-6 overflow-x-auto pr-4 [scrollbar-width:none] sm:-mr-6 sm:pr-6 lg:hidden [&::-webkit-scrollbar]:hidden">
          {images.slice(0, 5).map((image, i) => (
            <div
              key={i}
              className="relative h-[361px] w-[min(320px,calc(100vw-48px))] shrink-0 snap-start overflow-hidden rounded-[24px]"
            >
              <Image
                src={urlFor(image).width(640).height(722).url()}
                alt={image.alt ?? 'Wine experience'}
                fill
                className="object-cover"
                sizes="320px"
              />
              <div className="absolute inset-0" style={{ background: SMALL_GRADIENT }} />
            </div>
          ))}
        </div>

        {/* Tablet (1024-1279, Figma 1027 frame): the large photo full width
            (878 x 814), the 2x2 grid below. Desktop: side by side. */}
        <div className="hidden grid-cols-1 lg:grid xl:grid-cols-2" style={{ gap: fig(24) }}>
          <Photo
            image={large}
            gradient={LARGE_GRADIENT}
            aspectClass="aspect-[878/814] xl:aspect-[788/814]"
            width={1000}
            height={1033}
            sizes="(min-width: 1280px) 50vw, 100vw"
          />

          {gridImages.length > 0 && (
            <div className="grid grid-cols-2" style={{ gap: fig(24) }}>
              {gridImages.map((image, i) => (
                <Photo
                  key={i}
                  image={image}
                  gradient={SMALL_GRADIENT}
                  aspectClass="aspect-[428.5/395] xl:aspect-[382/395]"
                  width={600}
                  height={620}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
