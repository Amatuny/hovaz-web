// src/components/ui/TastingBookingForm.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiCalendar } from 'react-icons/fi'
import { MdSchedule } from 'react-icons/md'
import { TurnstileWidget } from './TurnstileWidget'
import { fig } from '@/lib/figmaScale'
import { trackEvent } from '@/lib/analytics'
import type { BookingInput } from '@/lib/validations/booking'
import type { FoodOption } from '@/types/sanity'

export interface TastingOption {
  value: string
  label: string
  experienceType: BookingInput['experienceType']
}

interface TastingBookingFormProps {
  estateName: string
  options: TastingOption[]
  defaultValue?: string
  foodOptions?: FoodOption[]
  minGuests?: number
  maxGuests?: number
  ctaText?: string
  // Raw Figma px width of the panel.
  width?: number
}

const formatAmd = (amount: number) => `${amount.toLocaleString('en-US')} AMD`

function Stepper({
  label,
  count,
  onChange,
}: {
  label: string
  count: number
  onChange: (next: number) => void
}) {
  const buttonStyle: React.CSSProperties = {
    width: fig(30),
    height: fig(30),
    borderRadius: fig(15),
    backgroundColor: '#f2eddd',
    fontSize: fig(16),
    color: '#1a1d17',
  }
  return (
    <div className="flex items-center" style={{ gap: fig(6) }}>
      <button
        type="button"
        aria-label={`Remove one ${label}`}
        disabled={count === 0}
        onClick={() => onChange(count - 1)}
        className="flex cursor-pointer items-center justify-center disabled:cursor-not-allowed"
        style={buttonStyle}
      >
        −
      </button>
      <p
        aria-live="polite"
        className="text-center"
        style={{
          width: fig(24),
          fontFamily: 'var(--font-hanken)',
          fontWeight: 600,
          fontSize: fig(15),
          color: '#1a1d17',
        }}
      >
        {count}
      </p>
      <button
        type="button"
        aria-label={`Add one ${label}`}
        disabled={count >= 99}
        onClick={() => onChange(count + 1)}
        className="flex cursor-pointer items-center justify-center disabled:cursor-not-allowed"
        style={buttonStyle}
      >
        +
      </button>
    </div>
  )
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

const CUSTOM_VALUE = '__custom'

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block uppercase"
      style={{
        fontFamily: 'var(--font-montserrat)',
        fontWeight: 600,
        fontSize: fig(11),
        letterSpacing: fig(1.5),
        color: '#a8a290',
      }}
    >
      {children}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#dc2626' }}>
      {message}
    </p>
  )
}

const shellStyle: React.CSSProperties = {
  borderRadius: fig(12),
  backgroundColor: 'white',
  boxShadow: 'inset 0 0 0 1.5px rgba(26,29,23,0.12)',
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(15),
  color: '#1a1d17',
  width: '100%',
}

const inputStyle: React.CSSProperties = {
  ...shellStyle,
  paddingInline: fig(16),
  paddingBlock: fig(14),
}

export function TastingBookingForm({
  estateName,
  options,
  defaultValue,
  foodOptions = [],
  minGuests = 1,
  maxGuests = 12,
  ctaText = 'Book This Experience',
  width = 539,
}: TastingBookingFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileExpired, setTurnstileExpired] = useState(false)

  const [experience, setExperience] = useState(defaultValue ?? '')
  const [customRequest, setCustomRequest] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guestCount, setGuestCount] = useState(Math.max(minGuests, Math.min(2, maxGuests)))
  // Portions per food option, keyed by the option's _key.
  const [food, setFood] = useState<Record<string, number>>({})

  const selected = options.find((o) => o.value === experience)
  const isLoading = formState === 'loading'

  function handleContinue() {
    const errors: Record<string, string> = {}
    if (!experience) errors.experience = 'Please choose an experience'
    if (experience === CUSTOM_VALUE && !customRequest.trim()) {
      errors.customRequest = 'Please describe your request'
    }
    if (!date) errors.preferredDate = 'Please select a date'
    setFieldErrors(errors)
    if (Object.keys(errors).length === 0) setStep(2)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (step === 1) {
      handleContinue()
      return
    }

    setFieldErrors({})
    setErrorMessage('')

    if (!turnstileToken || turnstileExpired) {
      setErrorMessage('Please complete the security check')
      return
    }

    setFormState('loading')

    const formData = new FormData(e.currentTarget)
    const foodLines = foodOptions
      .filter((option) => (food[option._key] ?? 0) > 0)
      .map((option) => {
        const count = food[option._key]
        return `- ${count} × ${option.name} (${formatAmd(count * option.priceAmd)})`
      })

    // The booking API has no dedicated fields for the chosen tasting, time,
    // food or custom request, so they travel in notes for the manager to read.
    const notes = [
      selected ? `Experience: ${selected.label}` : null,
      time ? `Preferred time: ${time}` : null,
      foodLines.length ? `Food:\n${foodLines.join('\n')}` : null,
      customRequest.trim() ? `Custom request: ${customRequest.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const payload: BookingInput = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      experienceType: selected?.experienceType ?? 'custom',
      preferredDate: date,
      groupSize: guestCount,
      notes: notes || undefined,
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
          // Date/size problems are fixed on the first step.
          if (errors.preferredDate || errors.groupSize) setStep(1)
          setFormState('idle')
          return
        }
        throw new Error(data.error ?? 'Something went wrong')
      }

      setFormState('success')
      trackEvent('booking_inquiry_submitted', {
        experience_type: payload.experienceType,
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
    borderRadius: fig(28),
    padding: fig(48),
    width: fig(width),
    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
  }

  if (formState === 'success') {
    return (
      <div
        className="flex shrink-0 flex-col items-center text-center"
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
          Thank you for your interest in <strong>{selected?.label ?? estateName}</strong>.
          We&apos;ll confirm availability by email within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={step === 1}
      className="flex max-w-full shrink-0 flex-col items-stretch"
      style={{ ...panelStyle, gap: fig(18) }}
    >
      <div className="flex flex-col" style={{ gap: fig(6) }}>
        <p
          className="uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: fig(11),
            letterSpacing: fig(2),
            color: '#8a9572',
          }}
        >
          Book a Tasting
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: fig(26),
            color: '#1a1d17',
          }}
        >
          {estateName}
        </h2>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 700,
          fontSize: fig(12),
          letterSpacing: fig(0.96),
          color: '#7c8b68',
        }}
      >
        {step === 1 ? 'STEP 1 OF 2 — YOUR VISIT' : 'STEP 2 OF 2 — YOUR DETAILS'}
      </p>

      {step === 1 ? (
        <>
          {/* Experience type */}
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <label
              htmlFor="booking-experience"
              className="uppercase"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: fig(16),
                letterSpacing: fig(1.5),
                color: '#3d4a38',
              }}
            >
              Choose Your Experience
            </label>
            <div className="relative">
              <select
                id="booking-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full cursor-pointer appearance-none"
                style={{
                  ...shellStyle,
                  height: fig(50),
                  paddingLeft: fig(16),
                  paddingRight: fig(50),
                  color: experience ? '#1a1d17' : '#757575',
                }}
              >
                <option value="" disabled>
                  Choose your Experience
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value={CUSTOM_VALUE}>Custom request</option>
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center"
                style={{ width: fig(50) }}
              >
                <Image
                  src="/experiences/select-chevron.svg"
                  alt=""
                  width={10}
                  height={6}
                  style={{ width: fig(10), height: fig(6) }}
                />
              </span>
            </div>
            <FieldError message={fieldErrors.experience} />
          </div>

          {/* Add food */}
          {foodOptions.length > 0 && (
            <div className="flex flex-col">
              <div className="flex flex-col" style={{ gap: fig(8) }}>
                <FieldLabel>Add Food</FieldLabel>
                <p
                  style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(13), color: '#4f4542' }}
                >
                  Mix and match — order any number of each.
                </p>
              </div>
              {foodOptions.map((option) => (
                <div
                  key={option._key}
                  className="flex items-center justify-between"
                  style={{ paddingInline: fig(16), paddingBlock: fig(14), gap: fig(12) }}
                >
                  <div className="flex flex-col" style={{ gap: fig(2) }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontSize: fig(15),
                        color: '#1a1d17',
                      }}
                    >
                      {option.name}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 600,
                        fontSize: fig(13),
                        color: '#8a9572',
                      }}
                    >
                      {formatAmd(option.priceAmd)} each
                    </p>
                  </div>
                  <Stepper
                    label={option.name}
                    count={food[option._key] ?? 0}
                    onChange={(next) => setFood((prev) => ({ ...prev, [option._key]: next }))}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Custom request */}
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-custom">Custom Request</FieldLabel>
            <textarea
              id="booking-custom"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              rows={2}
              maxLength={800}
              placeholder="Something else in mind? Describe it — our manager will confirm pricing and availability with you directly."
              className="placeholder:text-[#757575]"
              style={{ ...inputStyle, height: fig(68), resize: 'none' }}
            />
            <FieldError message={fieldErrors.customRequest} />
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#a8a290' }}>
              Custom requests are confirmed by our manager, not priced automatically.
            </p>
          </div>

          {/* Date + time */}
          <div className="flex" style={{ gap: fig(8) }}>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-date">Date</FieldLabel>
              <div className="relative">
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="booking-picker w-full"
                  style={{
                    ...shellStyle,
                    padding: fig(10),
                    paddingRight: fig(40),
                    color: date ? '#1a1d17' : '#757575',
                  }}
                />
                <FiCalendar
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                  style={{ right: fig(10), width: fig(20), height: fig(20), color: '#1a1d17' }}
                />
              </div>
              <FieldError message={fieldErrors.preferredDate} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-time">Time</FieldLabel>
              <div className="relative">
                <input
                  id="booking-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="booking-picker w-full"
                  style={{
                    ...shellStyle,
                    padding: fig(10),
                    paddingRight: fig(40),
                    color: time ? '#1a1d17' : '#757575',
                  }}
                />
                <MdSchedule
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                  style={{ right: fig(10), width: fig(20), height: fig(20), color: '#1a1d17' }}
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel>Number of Guests</FieldLabel>
            <div
              className="flex items-center justify-between"
              style={{
                borderRadius: fig(999),
                paddingLeft: fig(18),
                paddingRight: fig(8),
                paddingBlock: fig(8),
              }}
            >
              <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(15), color: '#1a1d17' }}>
                {guestCount} guest{guestCount === 1 ? '' : 's'}
              </p>
              <div className="flex items-center">
                <button
                  type="button"
                  aria-label="Decrease guests"
                  disabled={guestCount <= minGuests}
                  onClick={() => setGuestCount((c) => Math.max(minGuests, c - 1))}
                  className="flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
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
                  disabled={guestCount >= maxGuests}
                  onClick={() => setGuestCount((c) => Math.min(maxGuests, c + 1))}
                  className="flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
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
            <FieldError message={fieldErrors.groupSize} />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-name">Full Name</FieldLabel>
            <input
              id="booking-name"
              type="text"
              name="name"
              required
              disabled={isLoading}
              placeholder="Your name"
              style={inputStyle}
            />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-email">Email for Confirmation</FieldLabel>
            <input
              id="booking-email"
              type="email"
              name="email"
              required
              disabled={isLoading}
              placeholder="you@example.com"
              style={inputStyle}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-phone">Phone Number</FieldLabel>
            <input
              id="booking-phone"
              type="tel"
              name="phone"
              required
              disabled={isLoading}
              placeholder="+374 77 000 000"
              style={inputStyle}
            />
            <FieldError message={fieldErrors.phone} />
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
        </>
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
          lineHeight: fig(24),
          letterSpacing: fig(2),
        }}
      >
        {isLoading ? 'Sending…' : ctaText}
      </button>

      {step === 2 && (
        <button
          type="button"
          disabled={isLoading}
          onClick={() => setStep(1)}
          className="cursor-pointer self-center disabled:opacity-50"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontSize: fig(13),
            color: '#4f4542',
            textDecoration: 'underline',
          }}
        >
          ← Back to your visit
        </button>
      )}
    </form>
  )
}
