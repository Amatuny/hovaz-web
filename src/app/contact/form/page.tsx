'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TurnstileWidget } from '@/components/ui/TurnstileWidget'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactFormPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileExpired, setTurnstileExpired] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setErrorMessage('')
    if (!turnstileToken || turnstileExpired) {
      setErrorMessage('Please complete the security check')
      return
    }
    setFormState('loading')
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || undefined,
      subject: (formData.get('subject') as string) || undefined,
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
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '6rem',
          backgroundColor: 'var(--color-brand-cream)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '0 1.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '5rem',
              color: 'var(--color-brand-gold)',
              marginBottom: '1rem',
            }}
          >
            checkmark
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'var(--color-brand-burgundy)',
              marginBottom: '1rem',
            }}
          >
            Message Sent
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-brand-stone)',
              lineHeight: '1.7',
              marginBottom: '2rem',
            }}
          >
            Thank you for reaching out. We will get back to you within 24 hours.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isLoading = formState === 'loading'

  return (
    <>
      <div
        style={{
          paddingTop: '8rem',
          paddingBottom: '4rem',
          backgroundColor: 'var(--color-brand-cream)',
        }}
      >
        <div className="container-content">
          <p
            className="text-label"
            style={{ color: 'var(--color-brand-gold)', marginBottom: '0.75rem' }}
          >
            Get in touch
          </p>
          <h1 className="heading-display">Contact Us</h1>
        </div>
      </div>
      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content" style={{ maxWidth: '480px' }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-field" htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isLoading}
                  className="input-field"
                  placeholder="Your name"
                />
                {fieldErrors.name && <p className="error-field">{fieldErrors.name}</p>}
              </div>
              <div>
                <label className="label-field" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  className="input-field"
                  placeholder="your@email.com"
                />
                {fieldErrors.email && <p className="error-field">{fieldErrors.email}</p>}
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                disabled={isLoading}
                className="input-field"
                placeholder="+374 77 000 000"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                disabled={isLoading}
                className="input-field"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                disabled={isLoading}
                className="textarea-field"
                placeholder="Tell us more..."
              />
              {fieldErrors.message && <p className="error-field">{fieldErrors.message}</p>}
            </div>
            <TurnstileWidget
              onSuccess={(token) => {
                setTurnstileToken(token)
                setTurnstileExpired(false)
              }}
              onError={() =>
                setErrorMessage('Security check failed. Please refresh and try again.')
              }
              onExpire={() => {
                setTurnstileExpired(true)
                setTurnstileToken('')
              }}
            />
            {(errorMessage || formState === 'error') && (
              <div
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  backgroundColor: '#FFF0F0',
                  border: '1px solid #dc2626',
                }}
              >
                <p style={{ color: '#dc2626', fontSize: '0.75rem', margin: 0 }}>
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || !turnstileToken || turnstileExpired}
              className="btn-primary"
              style={{
                opacity: isLoading || !turnstileToken ? 0.7 : 1,
                cursor: isLoading || !turnstileToken ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--color-brand-stone)',
                textAlign: 'center',
              }}
            >
              We respond within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
