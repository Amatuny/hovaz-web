import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllWines } from '@/lib/sanity/queries'
import { WineCard } from '@/components/ui/WineCard'

export const metadata: Metadata = {
  title: 'Our Wines',
  description:
    'Discover the HOVAZ wine collection — expressions of Armenian terroir crafted from indigenous grape varieties, across the Hovaz and Gooneh lines.',
  openGraph: {
    title: 'Our Wines — HOVAZ',
    description: 'Discover the HOVAZ wine collection.',
    url: 'https://hovazwines.com/wines',
  },
}

export const revalidate = 3600

interface SectionHeaderProps {
  as?: 'h1' | 'h2'
  eyebrow: string
  eyebrowColor: string
  heading: string
  paragraph: string
  paragraphSize?: string
  paragraphLineHeight?: string
  headingTracking?: string
}

function SectionHeader({
  as: Heading = 'h2',
  eyebrow,
  eyebrowColor,
  heading,
  paragraph,
  paragraphSize = '12px',
  paragraphLineHeight = '19px',
  headingTracking = '0px',
}: SectionHeaderProps) {
  return (
    <div className="flex max-w-[860px] flex-col gap-2">
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: eyebrowColor,
        }}
      >
        {eyebrow}
      </p>
      <Heading
        className="capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: '26px',
          color: '#1a1d17',
          letterSpacing: headingTracking,
          lineHeight: 1.15,
        }}
      >
        {heading}
      </Heading>
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 400,
          fontSize: paragraphSize,
          lineHeight: paragraphLineHeight,
          color: '#4f4542',
        }}
      >
        {paragraph}
      </p>
    </div>
  )
}

function ComingSoon() {
  return (
    <p
      style={{
        fontFamily: 'var(--font-hanken)',
        fontWeight: 400,
        fontSize: '12px',
        color: 'var(--color-brand-stone)',
      }}
    >
      Coming soon.
    </p>
  )
}

export default async function WinesPage() {
  const wines = await getAllWines()

  const hovazWines = wines.filter((w) => (w.collection ?? 'hovaz') === 'hovaz')
  const goonehWines = wines.filter((w) => w.collection === 'gooneh')

  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content flex flex-col gap-10 pt-12 pb-12 lg:gap-[82px] lg:pb-[82px]">
        <SectionHeader
          as="h1"
          eyebrow="The Cellar"
          eyebrowColor="rgba(93,110,82,0.92)"
          heading="Wines of the Valley"
          paragraph="Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made slowly."
          paragraphSize="13px"
          paragraphLineHeight="20px"
          headingTracking="0.3px"
        />

        {wines.length === 0 ? (
          <ComingSoon />
        ) : (
          <>
            {/* Hovaz Collection */}
            <div className="flex flex-col gap-8 lg:gap-12">
              <SectionHeader
                eyebrow="Elegant · Characterful · Structured"
                eyebrowColor="#8a9572"
                heading="Hovaz Collection"
                paragraph="Our signature wines, made from Armenian grape varieties and created for discovery, good food and special moments."
              />

              {hovazWines.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {hovazWines.map((wine) => (
                    <WineCard key={wine._id} wine={wine} />
                  ))}
                </div>
              ) : (
                <ComingSoon />
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center overflow-hidden">
              <Image
                src="/wines/vine-divider.svg"
                alt=""
                width={677}
                height={78}
                className="h-auto w-full max-w-[420px]"
              />
            </div>

            {/* Gooneh Collection */}
            <div className="flex flex-col gap-8 lg:gap-12">
              <SectionHeader
                eyebrow="Fresh · Fruity · Playful"
                eyebrowColor="#8a9572"
                heading="Gooneh Collection"
                paragraph="Easy-going wines made for relaxed moments, parties, picnics and spontaneous gatherings."
              />

              {goonehWines.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {goonehWines.map((wine) => (
                    <WineCard key={wine._id} wine={wine} />
                  ))}
                </div>
              ) : (
                <ComingSoon />
              )}
            </div>

            {/* Closing symbol */}
            <div className="flex items-center justify-center overflow-hidden">
              <Image
                src="/wines/collection-symbol.svg"
                alt=""
                width={667}
                height={83}
                className="h-auto w-full max-w-[380px]"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
