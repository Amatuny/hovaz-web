// src/components/ui/ReservationForm.tsx
'use client'

import { useState } from 'react'
import { TurnstileWidget } from './TurnstileWidget'
import { fig } from '@/lib/figmaScale'
import { trackEvent } from '@/lib/analytics'
import type { BookingInput } from '@/lib/validations/booking'

interface ReservationFormProps {
  experienceTitle: string
  experienceType: BookingInput['experienceType']
  location: string
  duration?: string
  // Scheduled events have a fixed date/time (shown as static text, submitted
  // as-is). Flexible tours have no fixed date, so the guest picks one instead.
  dateTimeLabel?: string
  fixedDate?: string
  minGuests?: number
  maxGuests?: number
  ctaText?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="uppercase"
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontWeight: 600,
        fontSize: fig(11),
        letterSpacing: fig(1.5),
        color: '#a8a290',
      }}
    >
      {children}
    </p>
  )
}

const inputShellStyle: React.CSSProperties = {
  borderRadius: fig(12),
  paddingInline: fig(16),
  paddingBlock: fig(14),
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(15),
  color: '#1a1d17',
  backgroundColor: 'white',
  boxShadow: 'inset 0 0 0 1.5px rgba(26,29,23,0.12)',
  width: '100%',
}

export function ReservationForm({
  experienceTitle,
  experienceType,
  location,
  duration,
  dateTimeLabel,
  fixedDate,
  minGuests = 1,
  maxGuests = 12,
  ctaText = 'Reserve Your Seat',
}: ReservationFormProps) {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileExpired, setTurnstileExpired] = useState(false)
  const [guestCount, setGuestCount] = useState(Math.min(2, maxGuests))

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
    const preferredDate = fixedDate ?? (formData.get('preferredDate') as string)

    const payload: BookingInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      experienceType,
      preferredDate,
      groupSize: guestCount,
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
      trackEvent('booking_inquiry_submitted', {
        experience_type: experienceType,
        group_size: guestCount,
      })
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setFormState('error')
    }
  }

  const panelStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: fig(24),
    padding: fig(64),
    width: fig(520),
    boxShadow: '0px 8px 16px rgba(26,29,23,0.08)',
  }

  if (formState === 'success') {
    return (
      <div
        className="flex flex-col items-center text-center"
        style={{ ...panelStyle, gap: fig(16) }}
      >
        <p
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: fig(32),
            color: 'var(--color-brand-olive)',
          }}
        >
          ✓
        </p>
        <p
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(20),
            color: '#1a1d17',
          }}
        >
          Reservation Requested
        </p>
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(14), color: '#4f4542' }}>
          Thank you for your interest in <strong>{experienceTitle}</strong>. We&apos;ll confirm
          availability by email within 24 hours.
        </p>
      </div>
    )
  }

  const isLoading = formState === 'loading'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full shrink-0 flex-col items-stretch"
      style={{ ...panelStyle, gap: fig(32) }}
    >
      {/* Date & Time */}
      <div className="flex flex-col" style={{ gap: fig(4) }}>
        <FieldLabel>Date &amp; Time</FieldLabel>
        {fixedDate ? (
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 500,
              fontSize: fig(18),
              color: '#1a1d17',
            }}
          >
            {dateTimeLabel}
          </p>
        ) : (
          <input
            type="date"
            name="preferredDate"
            required
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 500,
              fontSize: fig(18),
              color: '#1a1d17',
              border: 'none',
              background: 'transparent',
              padding: 0,
            }}
          />
        )}
        {fieldErrors.preferredDate && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
            {fieldErrors.preferredDate}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="flex flex-col" style={{ gap: fig(4) }}>
        <FieldLabel>Location</FieldLabel>
        <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(15), color: '#1a1d17' }}>
          {location}
        </p>
      </div>

      {/* Duration */}
      {duration && (
        <div className="flex flex-col" style={{ gap: fig(4) }}>
          <FieldLabel>Duration</FieldLabel>
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(15), color: '#1a1d17' }}>
            {duration}
          </p>
        </div>
      )}

      <div style={{ height: '1px', backgroundColor: 'rgba(26,29,23,0.08)' }} />

      {/* Guests */}
      <div className="flex flex-col" style={{ gap: fig(2) }}>
        <FieldLabel>Number of Guests</FieldLabel>
        <div className="flex flex-col" style={{ paddingTop: fig(8) }}>
          <div
            className="flex items-center justify-between"
            style={{
              borderRadius: fig(999),
              paddingLeft: fig(18),
              paddingRight: fig(8),
              paddingBlock: fig(8),
              boxShadow: 'inset 0 0 0 1px rgba(26,29,23,0.12)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(15), color: '#1a1d17' }}>
              {guestCount} guest{guestCount === 1 ? '' : 's'}
            </p>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Decrease guests"
                disabled={isLoading || guestCount <= minGuests}
                onClick={() => setGuestCount((c) => Math.max(minGuests, c - 1))}
                className="flex items-center justify-center disabled:opacity-30"
                style={{
                  width: fig(32),
                  height: fig(32),
                  borderRadius: fig(16),
                  fontSize: fig(16),
                  color: '#1a1d17',
                }}
              >
                −
              </button>
              <button
                type="button"
                aria-label="Increase guests"
                disabled={isLoading || guestCount >= maxGuests}
                onClick={() => setGuestCount((c) => Math.min(maxGuests, c + 1))}
                className="flex items-center justify-center disabled:opacity-30"
                style={{
                  width: fig(32),
                  height: fig(32),
                  borderRadius: fig(16),
                  fontSize: fig(16),
                  color: '#1a1d17',
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        {fieldErrors.groupSize && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
            {fieldErrors.groupSize}
          </p>
        )}
      </div>

      {/* Name — required to confirm the reservation; not shown in the Figma
          mockup, which only shows email, but the booking backend needs a name
          to address the confirmation to. */}
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <FieldLabel>Full Name</FieldLabel>
        <input
          type="text"
          name="name"
          required
          disabled={isLoading}
          placeholder="Your name"
          style={inputShellStyle}
        />
        {fieldErrors.name && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <FieldLabel>Email for Confirmation</FieldLabel>
        <input
          type="email"
          name="email"
          required
          disabled={isLoading}
          placeholder="you@example.com"
          style={inputShellStyle}
        />
        {fieldErrors.email && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Phone — also required by the booking backend, not shown in Figma. */}
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <FieldLabel>Phone Number</FieldLabel>
        <input
          type="tel"
          name="phone"
          required
          disabled={isLoading}
          placeholder="+374 77 000 000"
          style={inputShellStyle}
        />
        {fieldErrors.phone && (
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
            {fieldErrors.phone}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <FieldLabel>Allergies or Special Requests</FieldLabel>
        <textarea
          name="notes"
          rows={3}
          disabled={isLoading}
          placeholder="e.g. nut allergy, dietary restrictions, accessibility needs"
          style={{ ...inputShellStyle, minHeight: fig(88), resize: 'none' }}
        />
      </div>

      <TurnstileWidget
        size="invisible"
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

      {(errorMessage || formState === 'error') && (
        <div
          className="text-center"
          style={{
            padding: fig(12),
            backgroundColor: '#FFF0F0',
            border: '1px solid #dc2626',
            borderRadius: fig(12),
          }}
        >
          <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#dc2626' }}>
            {errorMessage || 'Something went wrong. Please try again.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer capitalize text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          backgroundColor: '#2e3a28',
          borderRadius: fig(60),
          paddingInline: fig(64),
          paddingBlock: fig(12),
          fontFamily: 'var(--font-hanken)',
          fontWeight: 600,
          fontSize: fig(16),
          letterSpacing: fig(2),
        }}
      >
        {isLoading ? 'Sending…' : ctaText}
      </button>

      <p
        className="w-full text-center"
        style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#a8a290' }}
      >
        Free cancellation up to 48 hours before
      </p>
    </form>
  )
}
