// src/components/ui/TurnstileWidget.tsx
'use client'

import { useEffect } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  size?: 'normal' | 'compact' | 'invisible'
}

export function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  size = 'normal',
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const devBypass = !siteKey && size === 'invisible'

  // Invisible mode has no UI even in dev — auto-bypass on mount so forms stay usable
  useEffect(() => {
    if (devBypass) onSuccess('dev-bypass')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devBypass])

  if (devBypass) return null

  // Development fallback — no real Turnstile in dev
  if (!siteKey) {
    return (
      <div
        className="p-3 text-center"
        style={{
          backgroundColor: 'var(--color-brand-blush)',
          border: '1px solid color-mix(in srgb, var(--color-brand-gold) 30%, transparent)',
        }}
      >
        <p className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
          Security check (dev mode)
        </p>
        <button
          type="button"
          onClick={() => onSuccess('dev-bypass')}
          className="text-label mt-2 block mx-auto"
          style={{ color: 'var(--color-brand-burgundy)' }}
        >
          Bypass for testing →
        </button>
      </div>
    )
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: 'light',
        size,
      }}
    />
  )
}
