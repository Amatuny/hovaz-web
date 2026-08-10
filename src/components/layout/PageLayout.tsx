// src/components/layout/PageLayout.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { PortableText } from '@/components/sanity/PortableText'
import type { SanityImage, SanityBlock } from '@/types/sanity'

interface PageLayoutProps {
  label?: string
  title: string
  subtitle?: string
  featuredImage?: SanityImage
  body?: SanityBlock[]
  ctaText?: string
  ctaLink?: string
  backLabel?: string
  backHref?: string
  children?: React.ReactNode
}

export function PageLayout({
  label,
  title,
  subtitle,
  featuredImage,
  body,
  ctaText,
  ctaLink,
  backLabel,
  backHref,
  children,
}: PageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <div
        className="relative pt-24 overflow-hidden"
        style={{
          minHeight: '50vh',
          backgroundColor: 'var(--color-brand-dark)',
        }}
      >
        {featuredImage?.asset?._ref && (
          <>
            <Image
              src={urlFor(featuredImage).width(1920).height(800).url()}
              alt={featuredImage.alt ?? title}
              fill
              className="object-cover opacity-50"
              priority
              sizes="100vw"
            />
            <div className="hero-overlay" />
          </>
        )}

        <div className="container-content relative z-10 py-20">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 mb-8 text-caption transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              ← {backLabel ?? 'Back'}
            </Link>
          )}
          {label && (
            <p className="text-label mb-4" style={{ color: 'var(--color-brand-gold)' }}>
              {label}
            </p>
          )}
          <h1
            className="heading-display max-w-2xl"
            style={{
              color: 'white',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-body text-lg mt-4 max-w-xl"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto">
          {body && body.length > 0 && <PortableText value={body} />}
          {children}
        </div>
      </div>

      {/* CTA */}
      {ctaText && ctaLink && (
        <div
          className="section-padding-sm"
          style={{ backgroundColor: 'var(--color-brand-burgundy)' }}
        >
          <div className="container-content text-center">
            <Link href={ctaLink} className="btn-white">
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
