// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content text-center max-w-narrow mx-auto">
        <p className="font-serif text-8xl mb-4" style={{ color: 'var(--color-brand-gold)' }}>
          404
        </p>
        <h1 className="heading-section mb-4">Page Not Found</h1>
        <p className="text-body mb-8" style={{ color: 'var(--color-brand-stone)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/events" className="btn-secondary">
            Book an Experience
          </Link>
        </div>
      </div>
    </div>
  )
}
