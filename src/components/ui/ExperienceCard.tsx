// src/components/ui/ExperienceCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { Tour } from '@/types/sanity'

interface ExperienceCardProps {
  tour: Tour
}

export function ExperienceCard({ tour }: ExperienceCardProps) {
  return (
    <Link
      href={`/experiences/${tour.slug.current}`}
      className="card-experience group block"
      style={{ backgroundColor: 'var(--color-brand-dark)' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '260px' }}>
        {tour.mainImage?.asset?._ref ? (
          <Image
            src={urlFor(tour.mainImage).width(600).height(400).url()}
            alt={tour.mainImage.alt ?? tour.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(26,10,13,0.9) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-label mb-2" style={{ color: 'var(--color-brand-gold)' }}>
          {tour.duration}
          {tour.pricePerPerson && ` · From $${tour.pricePerPerson}`}
        </p>
        <h3 className="heading-card mb-3" style={{ color: 'white', fontSize: '1.25rem' }}>
          {tour.title}
        </h3>
        {tour.description && (
          <p className="text-caption mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {tour.description}
          </p>
        )}

        {/* Included services */}
        {tour.includedServices && tour.includedServices.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.includedServices.slice(0, 3).map((service) => (
              <span
                key={service}
                className="text-label px-2 py-1"
                style={{
                  fontSize: '0.6rem',
                  backgroundColor: 'rgba(184,146,74,0.15)',
                  color: 'var(--color-brand-gold)',
                  border: '1px solid rgba(184,146,74,0.3)',
                }}
              >
                {service}
              </span>
            ))}
          </div>
        )}

        <span
          className="text-label transition-colors group-hover:text-white"
          style={{ color: 'var(--color-brand-gold)' }}
        >
          Book this experience →
        </span>
      </div>
    </Link>
  )
}
