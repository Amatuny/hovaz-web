// src/components/ui/TestimonialCard.tsx
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { fig } from '@/lib/figmaScale'
import type { Testimonial } from '@/types/sanity'

interface TestimonialCardProps {
  testimonial: Testimonial
}

// Figma "star_filled": 16px, solid #b37d09; empty stars use a faint outline
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width={fig(16)} height={fig(16)} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.88333 14.6667L4.96667 9.98333L1.33333 6.83333L6.13333 6.41667L8 2L9.86667 6.41667L14.6667 6.83333L11.0333 9.98333L12.1167 14.6667L8 12.1833L3.88333 14.6667Z"
        fill={filled ? '#b37d09' : 'none'}
        stroke={filled ? 'none' : 'rgba(35,24,20,0.3)'}
        strokeWidth="0.8"
      />
    </svg>
  )
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const rating = testimonial.rating ?? 5

  return (
    // Figma "review": 376x272, white, 1px rgba(35,24,20,.25) border, radius 24,
    // 32px padding, 16px gaps; the quote is clipped to two lines
    <div
      className="flex flex-col overflow-hidden rounded-[24px] border bg-white"
      style={{
        height: `max(200px, ${fig(272)})`,
        gap: fig(16),
        padding: fig(32),
        borderColor: 'rgba(35,24,20,0.25)',
      }}
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

      <div className="flex items-center" style={{ gap: fig(10) }}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>

      <p
        className="line-clamp-2 italic"
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
          // Figma: Work Sans Regular 14, line height 1.224 (Latin only — other
          // scripts fall back to Noto Sans Armenian / Inter)
          style={{
            fontFamily: 'var(--font-work-sans), var(--font-armenian), var(--font-sans), sans-serif',
            fontWeight: 400,
            fontSize: fig(14),
            lineHeight: 1.224,
            color: '#4a4e44',
          }}
        >
          {testimonial.context}
        </p>
      )}
    </div>
  )
}
