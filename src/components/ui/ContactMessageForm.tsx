// src/components/ui/ContactMessageForm.tsx
// "Send a Message" card on the Contact page (Figma node 722:13322).
'use client'

import { useState, type CSSProperties } from 'react'
import { TurnstileWidget } from '@/components/ui/TurnstileWidget'
import { trackEvent } from '@/lib/analytics'
import { fig } from '@/lib/figmaScale'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const CREAM = '#fdfcf8'

const fieldStyle: CSSProperties = {
  width: '100%',
  borderRadius: fig(12),
  paddingInline: fig(18),
  paddingBlock: fig(15),
  backgroundColor: 'rgba(255,255,255,0.06)',
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(16),
  letterSpacing: fig(0.5),
  color: '#f2eddd',
  outline: 'none',
}

const errorStyle: CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(13),
  color: '#f0a58c',
}

export function ContactMessageForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setErrorMessage('')
    if (!turnstileToken) {
      setErrorMessage('Security check is still loading — please try again in a moment.')
      return
    }
    setFormState('loading')
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      turnstileToken,
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        if (data.issues) {
          const errors: Record<string, string> = {}
          data.issues.forEach((issue: { field: string; message: string }) => {
            errors[issue.field] = issue.message
          })
          setFieldErrors(errors)
          setFormState('idle')
          return
        }
        throw new Error(data.error ?? 'Something went wrong')
      }
      setFormState('success')
      trackEvent('contact_form_submitted')
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setFormState('error')
    }
  }

  const isLoading = formState === 'loading'

  return (
    <div
      className="flex w-full flex-col"
      style={{ backgroundColor: '#2b1713', borderRadius: fig(24), padding: fig(44), gap: fig(16) }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 600,
          fontSize: fig(24),
          lineHeight: 1.33,
          color: CREAM,
        }}
      >
        Send a Message
      </h2>

      {formState === 'success' ? (
        <p
          role="status"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: fig(16),
            lineHeight: 1.6,
            color: '#f2eddd',
          }}
        >
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: fig(16) }} noValidate>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <label htmlFor="contact-name" className="sr-only">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(fieldErrors.name)}
              className="placeholder:text-[#f2eddd] focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
              style={{ ...fieldStyle, height: fig(50) }}
            />
            {fieldErrors.name && <p style={errorStyle}>{fieldErrors.name}</p>}
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <label htmlFor="contact-email" className="sr-only">
              Email address
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              aria-invalid={Boolean(fieldErrors.email)}
              className="placeholder:text-[#f2eddd] focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
              style={{ ...fieldStyle, height: fig(50) }}
            />
            {fieldErrors.email && <p style={errorStyle}>{fieldErrors.email}</p>}
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <label htmlFor="contact-message" className="sr-only">
              How can we help?
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              placeholder="How can we help?"
              aria-invalid={Boolean(fieldErrors.message)}
              className="resize-none placeholder:text-[#f2eddd] focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
              style={{ ...fieldStyle, height: fig(110) }}
            />
            {fieldErrors.message && <p style={errorStyle}>{fieldErrors.message}</p>}
          </div>

          {errorMessage && (
            <p role="alert" style={errorStyle}>
              {errorMessage}
            </p>
          )}

          <div style={{ paddingTop: fig(6) }}>
            {/* Kept inside this wrapper so the invisible widget doesn't add a flex gap */}
            <TurnstileWidget
              size="invisible"
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken('')}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-full bg-[#fdfcf8] text-[#1a1d17] transition-colors hover:bg-[var(--color-brand-gold)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                height: fig(52),
                padding: fig(16),
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: fig(15),
              }}
            >
              {isLoading ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
