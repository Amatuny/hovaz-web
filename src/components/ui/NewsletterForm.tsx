// src/components/ui/NewsletterForm.tsx
'use client'

import { useState } from 'react'
import { TurnstileWidget } from './TurnstileWidget'
import { trackEvent } from '@/lib/analytics'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface NewsletterFormProps {
  source?: string
}

export function NewsletterForm({ source = 'homepage' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!turnstileToken) {
      setMessage('Please try again in a moment.')
      setFormState('error')
      return
    }

    setFormState('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, turnstileToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.issues?.[0]?.message ?? data.error ?? 'Something went wrong')
      }

      setFormState('success')
      setMessage(data.message ?? "You're subscribed.")
      trackEvent('newsletter_subscribed', { source })
    } catch (err) {
      setFormState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (formState === 'success') {
    return (
      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontSize: '14px',
          color: 'var(--color-brand-forest)',
        }}
      >
        {message}
      </p>
    )
  }

  const isLoading = formState === 'loading'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between gap-4 pb-2"
        style={{
          borderBottom: '1px solid color-mix(in srgb, var(--color-brand-stone) 40%, transparent)',
        }}
      >
        <input
          type="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email address"
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: '14px',
            color: 'var(--color-brand-charcoal)',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="shrink-0 uppercase transition-colors hover:text-[var(--color-brand-gold)]"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: '10px',
            letterSpacing: '1.5px',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      <TurnstileWidget
        size="invisible"
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
      />

      {formState === 'error' && message && (
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: '12px', color: '#dc2626' }}>
          {message}
        </p>
      )}
    </form>
  )
}
