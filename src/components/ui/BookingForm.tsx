// src/components/ui/BookingForm.tsx
'use client'

import { useState } from 'react'
import { TurnstileWidget } from './TurnstileWidget'
import type { BookingInput } from '@/lib/validations/booking'

interface BookingFormProps {
  experienceTitle: string
  experienceType: string
  pricePerPerson?: number
  priceNote?: string
  duration?: string
  minGroupSize?: number
  maxGroupSize?: number
  privateAvailable?: boolean
  ctaText?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function BookingForm({
  experienceTitle,
  experienceType,
  pricePerPerson,
  priceNote,
  duration,
  minGroupSize,
  maxGroupSize,
  privateAvailable,
  ctaText = 'Book This Experience',
}: BookingFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState<string>('')
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

    const payload: BookingInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      experienceType: experienceType as BookingInput['experienceType'],
      preferredDate: formData.get('preferredDate') as string,
      groupSize: Number(formData.get('groupSize')),
      notes: (formData.get('notes') as string) || undefined,
      turnstileToken,
    }

    try {
      const response = await fetch('/api/bookings', {
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

  // Success state
  if (formState === 'success') {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: 'white' }}>
        <p className="font-serif text-5xl mb-4" style={{ color: 'var(--color-brand-gold)' }}>
          ✓
        </p>
        <h3 className="font-serif text-xl mb-3" style={{ color: 'var(--color-brand-burgundy)' }}>
          Inquiry Received
        </h3>
        <p
          className="text-body"
          style={{ color: 'var(--color-brand-stone)', fontSize: '0.875rem' }}
        >
          Thank you for your interest in <strong>{experienceTitle}</strong>. We will confirm
          availability within 24 hours.
        </p>
      </div>
    )
  }

  const isLoading = formState === 'loading'

  return (
    <div style={{ backgroundColor: 'white' }}>
      {/* Price header */}
      <div
        className="p-6 pb-0"
        style={{
          borderBottom: '1px solid color-mix(in srgb, var(--color-brand-stone) 15%, transparent)',
        }}
      >
        {pricePerPerson ? (
          <>
            <p className="text-label mb-1">From</p>
            <p
              className="font-serif text-4xl mb-1"
              style={{ color: 'var(--color-brand-burgundy)' }}
            >
              ${pricePerPerson}
              <span className="text-label text-base ml-1">/ person</span>
            </p>
            {priceNote && <p className="text-caption pb-4">{priceNote}</p>}
          </>
        ) : (
          <p className="font-serif text-xl pb-4" style={{ color: 'var(--color-brand-burgundy)' }}>
            Price on request
          </p>
        )}

        {/* Quick info */}
        <div className="flex flex-col gap-2 py-4">
          {duration && (
            <div className="flex justify-between">
              <p className="text-label">Duration</p>
              <p className="text-caption">{duration}</p>
            </div>
          )}
          {minGroupSize && maxGroupSize && (
            <div className="flex justify-between">
              <p className="text-label">Group size</p>
              <p className="text-caption">
                {minGroupSize}–{maxGroupSize} guests
              </p>
            </div>
          )}
          {privateAvailable && (
            <div className="flex justify-between">
              <p className="text-label">Private booking</p>
              <p className="text-caption" style={{ color: 'var(--color-brand-gold)' }}>
                Available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
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

        <div>
          <label className="label-field" htmlFor="phone">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={isLoading}
            className="input-field"
            placeholder="+374 77 000 000"
          />
          {fieldErrors.phone && <p className="error-field">{fieldErrors.phone}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="preferredDate">
            Preferred Date *
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            required
            disabled={isLoading}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
          {fieldErrors.preferredDate && <p className="error-field">{fieldErrors.preferredDate}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="groupSize">
            Group Size *
          </label>
          <input
            id="groupSize"
            name="groupSize"
            type="number"
            required
            disabled={isLoading}
            className="input-field"
            min={minGroupSize ?? 1}
            max={maxGroupSize ?? 100}
            defaultValue={minGroupSize ?? 2}
            placeholder="Number of guests"
          />
          {fieldErrors.groupSize && <p className="error-field">{fieldErrors.groupSize}</p>}
        </div>

        <div>
          <label className="label-field" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            disabled={isLoading}
            className="textarea-field"
            placeholder="Dietary requirements, special occasions, questions..."
          />
        </div>

        {/* Turnstile */}
        <TurnstileWidget
          onSuccess={(token) => {
            setTurnstileToken(token)
            setTurnstileExpired(false)
          }}
          onError={() => setErrorMessage('Security check failed. Please refresh and try again.')}
          onExpire={() => {
            setTurnstileExpired(true)
            setTurnstileToken('')
          }}
        />

        {/* Error message */}
        {(errorMessage || formState === 'error') && (
          <div
            className="p-3 text-center"
            style={{
              backgroundColor: '#FFF0F0',
              border: '1px solid #dc2626',
            }}
          >
            <p className="text-caption" style={{ color: '#dc2626' }}>
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !turnstileToken || turnstileExpired}
          className="btn-primary w-full"
          style={{
            opacity: isLoading || !turnstileToken ? 0.7 : 1,
            cursor: isLoading || !turnstileToken ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Sending...' : ctaText}
        </button>

        <p className="text-caption text-center" style={{ color: 'var(--color-brand-stone)' }}>
          We confirm within 24 hours. No payment required now.
        </p>
      </form>
    </div>
  )
}
