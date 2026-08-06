// src/components/sections/WinePreview.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Wine } from '@/types/sanity'

interface WinePreviewProps {
  wines: Wine[]
}

export function WinePreview({ wines }: WinePreviewProps) {
  if (!wines?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'white' }}>
      <div className="container-content">
        {/* Header */}
        <div className="section-header">
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            The Collection
          </p>
          <h2 className="heading-section mb-4">Our Wines</h2>
          <p
            className="text-body max-w-prose mx-auto"
            style={{ color: 'var(--color-brand-stone)' }}
          >
            Six expressions of Armenian terroir, crafted from indigenous grape varieties grown in
            the ancient highlands.
          </p>
        </div>

        {/* Wine grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {wines.map((wine) => (
            <Link
              key={wine._id}
              href={`/wines/${wine.slug.current}`}
              className="card-wine group block text-center p-4"
            >
              {/* Bottle image */}
              <div className="relative h-48 mb-4 flex items-center justify-center">
                {wine.mainImage?.asset?._ref ? (
                  <Image
                    src={urlFor(wine.mainImage).width(200).height(400).url()}
                    alt={wine.mainImage.alt ?? wine.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                ) : (
                  <div
                    className="w-16 h-40 rounded-sm"
                    style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
                  />
                )}
              </div>

              {/* Wine info */}
              <p className="text-label mb-1" style={{ color: 'var(--color-brand-gold)' }}>
                {wine.vintage}
              </p>
              <h3 className="font-serif text-base" style={{ color: 'var(--color-brand-charcoal)' }}>
                {wine.name}
              </h3>
              <p className="text-caption mt-1">{wine.grapeVariety}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/wines" className="btn-secondary">
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
