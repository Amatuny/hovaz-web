// src/components/ui/TestimonialCard.tsx
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import type { Testimonial } from '@/types/sanity'

interface TestimonialCardProps {
  testimonial: Testimonial
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width={fig(16)}
      height={fig(16)}
      viewBox="0 0 24 24"
      fill={filled ? 'var(--color-brand-gold)' : 'none'}
    >
      <path
        d="M12 2.5l2.9 6.4 6.9.6-5.3 4.7 1.6 6.8-6.1-3.7-6.1 3.7 1.6-6.8-5.3-4.7 6.9-.6L12 2.5z"
        stroke={filled ? 'var(--color-brand-gold)' : 'rgba(35,24,20,0.3)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const rating = testimonial.rating ?? 5

  return (
    <div
      className="flex h-full flex-col rounded-[24px] border bg-white"
      style={{ gap: fig(16), padding: fig(32), borderColor: 'rgba(35,24,20,0.25)' }}
    >
      <div className="flex items-center" style={{ gap: fig(24) }}>
        <div
          className="relative shrink-0 overflow-hidden rounded-full"
          style={{ width: fig(80), height: fig(80) }}
        >
          {testimonial.avatar?.asset?._ref ? (
            <Image
              src={urlFor(testimonial.avatar).width(160).height(160).url()}
              alt={testimonial.avatar.alt ?? testimonial.guestName}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="size-full" style={{ backgroundColor: 'var(--color-brand-sand)' }} />
          )}
        </div>
        <p
          className="capitalize"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 500,
            fontSize: fig(16),
            color: '#1a1d17',
          }}
        >
          {testimonial.guestName}
        </p>
      </div>

      <div className="flex items-center" style={{ gap: fig(6) }}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>

      <p
        className="italic"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 500,
          fontSize: fig(16),
          lineHeight: 1.5,
          color: 'rgba(26,29,23,0.82)',
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {testimonial.context && (
        <p
          className="mt-auto capitalize"
          style={{ fontFamily: 'var(--font-sans)', fontSize: fig(14), color: '#4a4e44' }}
        >
          {testimonial.context}
        </p>
      )}
    </div>
  )
}
