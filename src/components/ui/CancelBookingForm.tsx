// src/components/ui/CancelBookingForm.tsx
// Two-step card on /booking/cancel:
//   1. find the booking by confirmation number + email
//   2. review it and confirm the cancellation
'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { fig } from '@/lib/figmaScale'
import { ResultModal } from '@/components/ui/Alerts'
import type { PublicBookingSummary } from '@/lib/bookingCancellation'
import { CANCELLATION_REASONS, type CancellationReason } from '@/lib/validations/cancellation'

const INK = '#1a1d17'
const BODY = '#4f4542'
const ERROR_COLOR = '#b3261e'
const CANCEL_RED = '#8c2219'
const TOTAL_STEPS = 2

type Step = 1 | 2 | 'done'
type FormState = 'idle' | 'loading'

const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: fig(11),
  letterSpacing: fig(2),
  color: '#a8a290',
}

const inputStyle: CSSProperties = {
  width: '100%',
  height: fig(48),
  borderRadius: fig(12),
  paddingInline: fig(18),
  backgroundColor: 'white',
  boxShadow: 'inset 0 0 0 1.5px rgba(26,29,23,0.12)',
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(15),
  color: INK,
  outline: 'none',
}

const invalidShell: CSSProperties = { boxShadow: `inset 0 0 0 1.5px ${ERROR_COLOR}` }

const errorStyle: CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(13),
  color: ERROR_COLOR,
}

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: fig(15),
  lineHeight: 1.6,
  color: BODY,
}

const primaryButtonClass =
  'flex w-full items-center justify-center rounded-full bg-[var(--color-brand-olive)] text-white transition-colors hover:bg-[var(--color-brand-gold)] disabled:cursor-not-allowed disabled:opacity-60'

const buttonStyle: CSSProperties = {
  height: fig(48),
  fontFamily: 'var(--font-hanken)',
  fontWeight: 600,
  fontSize: fig(16),
  letterSpacing: fig(2),
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_RE = /^(HVZ)?-?\s*\d{5}$/i

function validate(confirmation: string, email: string) {
  const errors: Record<string, string> = {}
  if (!confirmation) errors.confirmationCode = 'Enter your confirmation number.'
  else if (!CODE_RE.test(confirmation))
    errors.confirmationCode = 'Confirmation numbers look like HVZ-48213.'
  if (!email) errors.email = 'Enter the email you booked with.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  return errors
}

// "Sat, 21 Nov 2026 · 14:00"
function formatWhen(date: string, time: string | null) {
  const day = new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return time ? `${day} · ${time}` : day
}

const formatAmd = (amount: number) => `${amount.toLocaleString('en-US')} AMD`

const experienceLabel = (type: string) =>
  type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

function refundLabel(booking: PublicBookingSummary, refund: 'full' | 'none') {
  if (refund === 'none') return booking.depositAmd ? `${formatAmd(0)} · none` : 'No refund'
  return booking.depositAmd ? `${formatAmd(booking.depositAmd)} · full` : 'Full refund'
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-playfair)',
        fontWeight: 600,
        fontSize: fig(28),
        lineHeight: 1.2,
        color: INK,
      }}
    >
      {children}
    </h2>
  )
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  const cell: CSSProperties = {
    fontFamily: 'var(--font-hanken)',
    fontSize: fig(15),
    fontWeight: strong ? 600 : 400,
    color: strong ? INK : '#6e6660',
  }
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b border-[rgba(26,29,23,0.08)] last:border-b-0"
      style={{ paddingBlock: fig(14) }}
    >
      <dt style={cell}>{label}</dt>
      <dd className="text-right" style={{ ...cell, fontWeight: strong ? 600 : 500, color: INK }}>
        {value}
      </dd>
    </div>
  )
}

const pillButtonStyle: CSSProperties = {
  height: fig(52),
  paddingInline: fig(64),
  fontFamily: 'var(--font-hanken)',
  fontWeight: 600,
  fontSize: fig(16),
  letterSpacing: fig(2),
}

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  return { ok: response.ok, data }
}

export function CancelBookingForm() {
  const [step, setStep] = useState<Step>(1)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [credentials, setCredentials] = useState({ confirmationCode: '', email: '' })
  const [booking, setBooking] = useState<PublicBookingSummary | null>(null)
  const [refund, setRefund] = useState<'full' | 'none'>('none')
  const [reason, setReason] = useState<CancellationReason | null>(null)
  // The cancelled booking while the success dialog is open; step 2 stays
  // behind it (as in the design) until the dialog is dismissed.
  const [cancelledBooking, setCancelledBooking] = useState<PublicBookingSummary | null>(null)

  async function handleFind(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage('')
    const formData = new FormData(e.currentTarget)
    const confirmationCode = String(formData.get('confirmationCode') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()

    const errors = validate(confirmationCode, email)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setFormState('loading')
    try {
      const { ok, data } = await postJson('/api/bookings/cancel/lookup', {
        confirmationCode,
        email,
      })
      if (!ok) {
        if (data.issues) {
          const issues: Record<string, string> = {}
          data.issues.forEach((issue: { field: string; message: string }) => {
            issues[issue.field] = issue.message
          })
          setFieldErrors(issues)
        } else {
          setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
        }
        return
      }
      setCredentials({ confirmationCode, email })
      setBooking(data.booking)
      setStep(2)
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setFormState('idle')
    }
  }

  async function handleCancel() {
    setErrorMessage('')
    setFormState('loading')
    try {
      const { ok, data } = await postJson('/api/bookings/cancel', {
        ...credentials,
        reason: reason ?? undefined,
      })
      if (!ok) {
        if (data.booking) setBooking(data.booking)
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setRefund(data.refund)
      setCancelledBooking(data.booking)
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setFormState('idle')
    }
  }

  function closeCancelledModal() {
    if (cancelledBooking) setBooking(cancelledBooking)
    setCancelledBooking(null)
    setStep('done')
  }

  function cancelledMessage(summary: PublicBookingSummary) {
    const refundText =
      refund === 'full'
        ? summary.depositAmd
          ? ' Your full refund will reach the original payment method within 5-7 business days.'
          : ''
        : summary.depositAmd
          ? ' As you cancelled less than 24 hours before your visit, the deposit is not refundable.'
          : ''
    return `Booking ${summary.confirmationCode} has been cancelled. A confirmation is on its way to ${credentials.email}.${refundText}`
  }

  function backToSearch() {
    setStep(1)
    setBooking(null)
    setReason(null)
    setErrorMessage('')
  }

  const isLoading = formState === 'loading'
  const progress = step === 'done' ? TOTAL_STEPS : step
  const stepLabel =
    step === 1
      ? 'Step 1 of 2 — Find your booking'
      : step === 2
        ? 'Step 2 of 2 — Review'
        : 'Cancelled'

  const errorAlert = errorMessage && (
    <p role="alert" style={errorStyle}>
      {errorMessage}
    </p>
  )

  return (
    <div
      className="flex w-full flex-col bg-white"
      style={{
        borderRadius: fig(24),
        padding: fig(48),
        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.05))',
      }}
    >
      {/* Progress */}
      <div
        className="flex"
        style={{ gap: fig(6) }}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={progress}
        aria-label={`Step ${progress} of ${TOTAL_STEPS}`}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className="flex-1 rounded-full transition-colors"
            style={{
              height: fig(4),
              backgroundColor: i < progress ? 'var(--color-brand-olive)' : '#e8e6e1',
            }}
          />
        ))}
      </div>

      <p
        className="uppercase"
        aria-live="polite"
        style={{
          marginTop: fig(52),
          fontFamily: 'var(--font-hanken)',
          fontWeight: 600,
          fontSize: fig(12),
          color: INK,
        }}
      >
        {stepLabel}
      </p>

      {step === 1 && (
        <>
          <div style={{ marginTop: fig(52) }}>
            <Heading>Find your booking</Heading>
          </div>
          <form
            onSubmit={handleFind}
            noValidate
            className="flex flex-col"
            style={{ marginTop: fig(20), gap: fig(18) }}
          >
            <div className="flex flex-col" style={{ gap: fig(8) }}>
              <label htmlFor="cancel-confirmation" className="uppercase" style={labelStyle}>
                Confirmation number
              </label>
              <input
                id="cancel-confirmation"
                name="confirmationCode"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                defaultValue={credentials.confirmationCode}
                placeholder="HVZ-48213"
                aria-invalid={Boolean(fieldErrors.confirmationCode)}
                aria-describedby={
                  fieldErrors.confirmationCode ? 'cancel-confirmation-error' : undefined
                }
                className="placeholder:text-[#a8a290] focus:shadow-[inset_0_0_0_1.5px_rgba(26,29,23,0.4)]"
                style={{
                  ...inputStyle,
                  letterSpacing: fig(2),
                  ...(fieldErrors.confirmationCode ? invalidShell : {}),
                }}
              />
              {fieldErrors.confirmationCode && (
                <p id="cancel-confirmation-error" style={errorStyle}>
                  {fieldErrors.confirmationCode}
                </p>
              )}
            </div>

            <div className="flex flex-col" style={{ gap: fig(8) }}>
              <label htmlFor="cancel-email" className="uppercase" style={labelStyle}>
                Booking email
              </label>
              <input
                id="cancel-email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={credentials.email}
                placeholder="you@example.com"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'cancel-email-error' : undefined}
                className="placeholder:text-[#a8a290] focus:shadow-[inset_0_0_0_1.5px_rgba(26,29,23,0.4)]"
                style={{ ...inputStyle, ...(fieldErrors.email ? invalidShell : {}) }}
              />
              {fieldErrors.email && (
                <p id="cancel-email-error" style={errorStyle}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {errorAlert}

            <button
              type="submit"
              disabled={isLoading}
              className={primaryButtonClass}
              style={buttonStyle}
            >
              {isLoading ? 'Searching…' : 'Find Your Booking'}
            </button>
          </form>
        </>
      )}

      {step !== 1 && booking && (
        <>
          <div
            className="flex flex-wrap items-baseline justify-between"
            style={{ marginTop: fig(52), columnGap: fig(16), rowGap: fig(4) }}
          >
            <Heading>
              {step === 'done'
                ? 'Booking cancelled'
                : (booking.experienceName ?? experienceLabel(booking.experienceType))}
            </Heading>
            <span
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: fig(12),
                letterSpacing: fig(2),
                color: '#8a9572',
              }}
            >
              {booking.confirmationCode}
            </span>
          </div>

          <dl
            className="flex flex-col"
            style={{
              marginTop: fig(20),
              paddingInline: fig(18),
              paddingBlock: fig(4),
              borderRadius: fig(16),
              backgroundColor: '#f7f3ea',
            }}
          >
            {booking.estate && <SummaryRow label="Estate" value={booking.estate} />}
            <SummaryRow label="Date" value={formatWhen(booking.date, booking.time)} />
            <SummaryRow
              label="Guests"
              value={`${booking.groupSize} ${booking.groupSize === 1 ? 'guest' : 'guests'}`}
            />
            {booking.addOns.length > 0 && (
              <SummaryRow
                label="Added"
                value={booking.addOns.map((a) => `${a.quantity}× ${a.name}`).join(', ')}
              />
            )}
            {booking.depositAmd != null && (
              <SummaryRow label="Deposit paid" value={formatAmd(booking.depositAmd)} />
            )}
            {step === 2 && booking.cancellation.cancellable && (
              <SummaryRow
                label="Refund"
                value={refundLabel(booking, booking.cancellation.refund)}
                strong
              />
            )}
            {step === 'done' && (
              <SummaryRow label="Refund" value={refundLabel(booking, refund)} strong />
            )}
          </dl>

          {step === 2 && booking.cancellation.cancellable && (
            <>
              <div style={{ marginTop: fig(24) }}>
                <p className="uppercase" style={labelStyle} id="cancel-reason-label">
                  Reason (optional)
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="cancel-reason-label"
                  className="flex flex-wrap"
                  style={{ marginTop: fig(10), gap: fig(8) }}
                >
                  {(Object.keys(CANCELLATION_REASONS) as CancellationReason[]).map((key) => {
                    const selected = reason === key
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setReason(selected ? null : key)}
                        className="cursor-pointer rounded-full transition-colors"
                        style={{
                          paddingInline: fig(16),
                          paddingBlock: fig(10),
                          fontFamily: 'var(--font-hanken)',
                          fontWeight: 500,
                          fontSize: fig(14),
                          backgroundColor: selected ? 'var(--color-brand-olive)' : '#f0e9d8',
                          color: selected ? '#fdfcf8' : INK,
                        }}
                      >
                        {CANCELLATION_REASONS[key]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {errorMessage && (
                <p role="alert" style={{ ...errorStyle, marginTop: fig(18) }}>
                  {errorMessage}
                </p>
              )}

              <div
                className="flex flex-col items-stretch sm:items-start"
                style={{ marginTop: fig(32), gap: fig(16) }}
              >
                <Link
                  href="/"
                  aria-disabled={isLoading}
                  className={`flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-brand-olive)] hover:text-white ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
                  style={{ ...pillButtonStyle, color: INK, boxShadow: `inset 0 0 0 1.5px ${INK}` }}
                >
                  Keep Booking
                </Link>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ ...pillButtonStyle, backgroundColor: CANCEL_RED }}
                >
                  {isLoading ? 'Cancelling…' : 'Cancel Booking'}
                </button>
              </div>
            </>
          )}

          {step === 2 && !booking.cancellation.cancellable && (
            <div className="flex flex-col" style={{ marginTop: fig(20), gap: fig(18) }}>
              <p role="alert" style={bodyStyle}>
                {errorMessage ||
                  (booking.cancellation.reason === 'already_cancelled'
                    ? 'This booking has already been cancelled.'
                    : booking.cancellation.reason === 'completed'
                      ? 'This visit has already taken place.'
                      : 'This visit has already started, so it can no longer be cancelled online. Please contact us.')}
              </p>
              <button
                type="button"
                onClick={backToSearch}
                className="self-start border-b border-current transition-colors hover:text-[var(--color-brand-gold)]"
                style={{ ...bodyStyle, fontSize: fig(14), color: INK }}
              >
                Look up another booking
              </button>
            </div>
          )}

          {step === 'done' && (
            <p role="status" style={{ ...bodyStyle, marginTop: fig(20) }}>
              {refund === 'full'
                ? 'Your booking is cancelled and your full refund will reach the original payment method within 5-7 business days. '
                : 'Your booking is cancelled. As your visit was less than 24 hours away, the deposit is not refundable. '}
              We&apos;ve sent a confirmation to your email.
            </p>
          )}
        </>
      )}

      <ResultModal
        open={cancelledBooking !== null}
        title="Your reservation is cancelled."
        message={cancelledBooking ? cancelledMessage(cancelledBooking) : ''}
        action={{ label: 'Book Another Date', href: '/experiences' }}
        onClose={closeCancelledModal}
      />
    </div>
  )
}
