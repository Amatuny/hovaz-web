import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/types/sanity'

interface HeroSectionProps {
  headline?: string
  subheadline?: string
  ctaText?: string
  heroImage?: SanityImage
}

export function HeroSection({
  headline = 'Experience Armenian Wine at Its Finest',
  subheadline = 'Discover HOVAZ Wine Rooms — where ancient tradition meets modern hospitality',
  ctaText = 'Explore Our Experiences',
  heroImage,
}: HeroSectionProps) {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      {/* Background image */}
      {heroImage?.asset?._ref ? (
        <Image
          src={urlFor(heroImage).width(1920).height(1080).url()}
          alt={heroImage.alt ?? 'HOVAZ Wine Rooms'}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-brand-dark)' }} />
      )}

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="container-content relative z-10 text-center">
        <p className="text-label mb-6" style={{ color: 'rgba(184, 146, 74, 0.9)' }}>
          HOVAZ Wine Rooms · Armenia
        </p>

        <h1
          className="heading-hero mb-6 max-w-4xl mx-auto"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          {headline}
        </h1>

        <p
          className="font-sans text-lg max-w-xl mx-auto mb-10"
          style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.7' }}
        >
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/events" className="btn-white">
            {ctaText}
          </Link>
          <Link
            href="/wines"
            className="btn-ghost"
            style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(184,146,74,0.6)' }}
          >
            Our Wines
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        <span
          className="text-label"
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, rgba(184,146,74,0.6), transparent)',
          }}
        />
      </div>
    </section>
  )
}
