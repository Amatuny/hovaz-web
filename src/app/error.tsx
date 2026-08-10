// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logger } from '@/lib/logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error('Page error', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content text-center max-w-narrow mx-auto">
        <p className="font-serif text-6xl mb-4" style={{ color: 'var(--color-brand-burgundy)' }}>
          !
        </p>
        <h1 className="heading-section mb-4">Something went wrong</h1>
        <p className="text-body mb-8" style={{ color: 'var(--color-brand-stone)' }}>
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
