// src/components/ui/TastingBookingForm.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { TurnstileWidget } from './TurnstileWidget'
import { DatePicker, TimePicker } from './BookingPickers'
import { AlertBanner, AlertModal, StatusOverlay } from './Alerts'
import { fig } from '@/lib/figmaScale'
import { trackEvent } from '@/lib/analytics'
import type { BookingInput } from '@/lib/validations/booking'
import type { FoodOption } from '@/types/sanity'

export interface TastingOption {
  value: string
  label: string
  experienceType: BookingInput['experienceType']
  pricePerPerson?: number
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

type Step = 1 | 2 | 3

const STEP_TITLES: Record<Step, string> = {
  1: 'Your Visit',
  2: 'Your Details',
  3: 'Payment',
}

// Share of the total charged online; the rest is paid at the winery.
const DEPOSIT_RATE = 0.1

const formatAmd = (amount: number) => `${amount.toLocaleString('en-US')} AMD`

// "2026-10-24" → "Saturday 24 October", parsed as a local date.
function formatVisitDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return value
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// "1234567812345678" → "1234 5678 1234 5678"
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

// "1228" → "12 / 28"
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

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

type FormState = 'idle' | 'paying' | 'confirming' | 'success' | 'error'

// Each "please wait" card stays up at least this long so it reads as a step
// rather than a flicker.
const MIN_STATUS_MS = 900
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// The table is held for the guest from the moment they leave step 1; they're
// warned when 2 minutes are left. The hold only lives in the browser — the
// booking API doesn't reserve anything until the booking is submitted.
const HOLD_MS = 10 * 60_000
const HOLD_WARNING_MS = 2 * 60_000

// Everything but the card is saved in the browser so a guest who reloads or
// comes back later can pick up where they left off.
const DRAFT_PREFIX = 'hovaz-booking-draft:'
const DRAFT_MAX_AGE_MS = 24 * 60 * 60_000

type HoldPhase = 'none' | 'active' | 'warning' | 'expired'

// What the payment provider can tell us about the deposit charge.
type PaymentResult =
  | { status: 'paid' }
  | { status: 'declined'; message?: string }
  // 3-D Secure: the bank wants to check the guest on its own page first.
  | { status: 'requires_action'; redirectUrl: string }

const DECLINED_MESSAGE =
  'Your bank turned this one down. It happens — try another card, or give them a quick call.'

// No payment provider is connected yet, so the deposit always "succeeds" and
// nothing is charged. Swap this for the provider's call and map its answer
// onto PaymentResult — the alerts below already handle every outcome.
async function chargeDeposit(amountAmd: number): Promise<PaymentResult> {
  void amountAmd
  await wait(MIN_STATUS_MS)
  return { status: 'paid' }
}

// Slot conflicts the booking API answers with a 409 (D1/D2).
type Conflict =
  | { kind: 'slot_full'; time: string; nextTimes: string[] }
  | { kind: 'duplicate'; date: string; time?: string }

const formatDayMonth = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

const joinTimes = (times: string[]) =>
  times.length > 1 ? `${times.slice(0, -1).join(', ')} and ${times.at(-1)}` : (times[0] ?? '')

function conflictMessage(conflict: Conflict) {
  if (conflict.kind === 'slot_full') {
    return conflict.nextTimes.length > 0
      ? `${conflict.time} has filled up. The next free ${conflict.nextTimes.length === 1 ? 'time that day is' : 'times that day are'} ${joinTimes(conflict.nextTimes)}.`
      : `${conflict.time} has filled up, and that day is now fully booked. Try another date.`
  }
  const when = conflict.time
    ? `at ${conflict.time} on ${formatDayMonth(conflict.date)}`
    : `on ${formatDayMonth(conflict.date)}`
  return `You have a booking ${when}. Check your email, or choose a different time.`
}

// fetch() rejects with a TypeError when the request never got an answer
// (offline, connection dropped) rather than when the server said no.
const isConnectionError = (err: unknown) =>
  err instanceof TypeError || (typeof navigator !== 'undefined' && !navigator.onLine)

interface BookingDraft {
  savedAt: number
  holdEndsAt: number
  step: Step
  experience: string
  customRequest: string
  date: string
  time: string
  guestCount: number
  food: Record<string, number>
  name: string
  email: string
  phone: string
  comments: string
}

function readDraft(key: string): BookingDraft | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const draft = JSON.parse(raw) as BookingDraft
    if (Date.now() - draft.savedAt > DRAFT_MAX_AGE_MS) {
      window.localStorage.removeItem(key)
      return null
    }
    return draft
  } catch {
    return null
  }
}

function writeDraft(key: string, draft: BookingDraft | null) {
  try {
    if (draft) window.localStorage.setItem(key, JSON.stringify(draft))
    else window.localStorage.removeItem(key)
  } catch {
    // Private mode or storage full — the form still works, just without resume.
  }
}

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

const ERROR_COLOR = '#8f1d1d'

// Online booking cap message contact.
const GROUP_EMAIL = 'hello@hovaz.am'

// Guests can step past the tour's max to see the "contact us" message,
// up to the booking API's own limit.
const MAX_GROUP_SIZE = 100

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null
  return (
    <p
      id={id}
      role="alert"
      className="flex"
      style={{
        gap: fig(8),
        fontFamily: 'var(--font-hanken)',
        fontSize: fig(12),
        lineHeight: fig(18),
        color: ERROR_COLOR,
      }}
    >
      <span aria-hidden style={{ fontWeight: 700 }}>
        !
      </span>
      <span>{message}</span>
    </p>
  )
}

function SummaryRow({
  left,
  right,
  strong,
}: {
  left: React.ReactNode
  right: React.ReactNode
  strong?: boolean
}) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{
        gap: fig(12),
        fontFamily: 'var(--font-hanken)',
        fontWeight: strong ? 600 : 400,
        fontSize: fig(13),
        color: '#1a1d17',
      }}
    >
      <span>{left}</span>
      <span className="text-right">{right}</span>
    </div>
  )
}

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex" style={{ gap: fig(6) }} aria-hidden>
      {([1, 2, 3] as const).map((n) => (
        <span
          key={n}
          className="flex-1 transition-colors"
          style={{
            height: fig(3),
            borderRadius: fig(2),
            backgroundColor: n <= step ? '#2e3a28' : '#e6e3da',
          }}
        />
      ))}
    </div>
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

const invalidShell: React.CSSProperties = {
  boxShadow: `inset 0 0 0 1.5px ${ERROR_COLOR}`,
}

const noteBoxStyle: React.CSSProperties = {
  backgroundColor: '#f2eddd',
  borderRadius: fig(12),
  padding: fig(14),
}

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#2e3a28',
  borderRadius: fig(60),
  paddingInline: fig(64),
  paddingBlock: fig(12),
  fontFamily: 'var(--font-hanken)',
  fontWeight: 600,
  fontSize: fig(16),
  lineHeight: fig(24),
  letterSpacing: fig(2),
}

export function TastingBookingForm({
  estateName,
  options,
  defaultValue,
  foodOptions = [],
  minGuests = 1,
  maxGuests = 12,
  ctaText = 'Pay Deposit And Confirm',
  width = 539,
}: TastingBookingFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileExpired, setTurnstileExpired] = useState(false)
  // Set synchronously on the first click so a double click can't charge the
  // deposit twice — state updates land too late to stop the second submit.
  const submittingRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Payment alerts (C1–C3).
  const [paymentError, setPaymentError] = useState('')
  const [connectionLostOpen, setConnectionLostOpen] = useState(false)
  const [bankCheckUrl, setBankCheckUrl] = useState<string | null>(null)
  const [conflict, setConflict] = useState<Conflict | null>(null)

  // Hold timer (B1/B2) and saved-session prompt (B3).
  const [holdEndsAt, setHoldEndsAt] = useState<number | null>(null)
  const [holdPhase, setHoldPhase] = useState<HoldPhase>('none')
  const [holdBannerDismissed, setHoldBannerDismissed] = useState(false)
  const [holdModalOpen, setHoldModalOpen] = useState(false)
  const [savedDraft, setSavedDraft] = useState<BookingDraft | null>(null)
  const draftKey = DRAFT_PREFIX + estateName

  // Step 1 — visit
  const [experience, setExperience] = useState(defaultValue ?? '')
  const [customRequest, setCustomRequest] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guestCount, setGuestCount] = useState(Math.max(minGuests, Math.min(2, maxGuests)))
  // Portions per food option, keyed by the option's _key.
  const [food, setFood] = useState<Record<string, number>>({})

  // Step 2 — details
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [comments, setComments] = useState('')

  // Step 3 — card. Kept only in component state and never sent to our API.
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  const selected = options.find((o) => o.value === experience)
  const isLoading = formState === 'paying' || formState === 'confirming'
  const tooManyGuests = guestCount > maxGuests

  function restoreDraft(draft: BookingDraft) {
    setExperience(draft.experience)
    setCustomRequest(draft.customRequest)
    setDate(draft.date)
    setTime(draft.time)
    setGuestCount(draft.guestCount)
    setFood(draft.food)
    setName(draft.name)
    setEmail(draft.email)
    setPhone(draft.phone)
    setComments(draft.comments)
  }

  // On load: a draft whose hold is still running just carries on (the guest
  // reloaded); an expired one asks before restoring (B3).
  useEffect(() => {
    const draft = readDraft(draftKey)
    if (!draft) return
    // localStorage only exists in the browser, so this can't run before mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (draft.holdEndsAt > Date.now()) {
      restoreDraft(draft)
      setStep(draft.step)
      setHoldEndsAt(draft.holdEndsAt)
      setHoldPhase('active')
    } else {
      setSavedDraft(draft)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [draftKey])

  // Keep the draft up to date while a hold is running.
  useEffect(() => {
    if (!holdEndsAt || formState === 'success') return
    writeDraft(draftKey, {
      savedAt: Date.now(),
      holdEndsAt,
      step,
      experience,
      customRequest,
      date,
      time,
      guestCount,
      food,
      name,
      email,
      phone,
      comments,
    })
  }, [
    draftKey,
    holdEndsAt,
    formState,
    step,
    experience,
    customRequest,
    date,
    time,
    guestCount,
    food,
    name,
    email,
    phone,
    comments,
  ])

  // Warn at 2 minutes left, end the hold at 0. Paused while a payment is in
  // flight so the hold can't end mid-charge.
  useEffect(() => {
    if (!holdEndsAt || isLoading || formState === 'success') return
    const left = holdEndsAt - Date.now()
    const warn = setTimeout(
      () => setHoldPhase((phase) => (phase === 'active' ? 'warning' : phase)),
      Math.max(0, left - HOLD_WARNING_MS)
    )
    const expire = setTimeout(
      () => {
        setHoldPhase('expired')
        setHoldModalOpen(true)
      },
      Math.max(0, left)
    )
    return () => {
      clearTimeout(warn)
      clearTimeout(expire)
    }
  }, [holdEndsAt, isLoading, formState])

  function startHold() {
    // Only ever called from the submit handler, never during render.
    // eslint-disable-next-line react-hooks/purity
    setHoldEndsAt(Date.now() + HOLD_MS)
    setHoldPhase('active')
    setHoldBannerDismissed(false)
    setHoldModalOpen(false)
  }

  // B2 "Check availability" — back to step 1 with everything kept; continuing
  // from there starts a fresh hold.
  function checkAvailabilityAgain() {
    setHoldModalOpen(false)
    setHoldEndsAt(null)
    setHoldPhase('none')
    goTo(1)
  }

  // B3 "Start again" — refill the form from the saved draft at step 1.
  function startAgainFromDraft() {
    if (savedDraft) restoreDraft(savedDraft)
    setSavedDraft(null)
    goTo(1)
  }

  function discardDraft() {
    writeDraft(draftKey, null)
    setSavedDraft(null)
  }

  // Red outline + accessible wiring for a field with an error.
  function errorProps(key: string) {
    const invalid = Boolean(fieldErrors[key])
    return {
      'aria-invalid': invalid || undefined,
      'aria-describedby': invalid ? `booking-${key}-error` : undefined,
    }
  }
  const errorShell = (key: string) => (fieldErrors[key] ? invalidShell : undefined)

  // Wraps a setter so editing a field clears its error.
  function edit<T>(key: string, setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setFieldErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const experienceTotal = (selected?.pricePerPerson ?? 0) * guestCount
  const foodLines = foodOptions
    .filter((option) => (food[option._key] ?? 0) > 0)
    .map((option) => {
      const count = food[option._key]
      return { key: option._key, name: option.name, count, total: count * option.priceAmd }
    })
  const total = experienceTotal + foodLines.reduce((sum, line) => sum + line.total, 0)
  const deposit = Math.round(total * DEPOSIT_RATE)

  function validate(current: Step) {
    const errors: Record<string, string> = {}
    if (current === 1) {
      if (!experience) errors.experience = 'Choose an experience to continue.'
      if (experience === CUSTOM_VALUE && !customRequest.trim()) {
        errors.customRequest = 'Describe your request to continue.'
      }
      if (!date) errors.preferredDate = 'Choose a date to continue.'
      if (!time) errors.time = 'Choose a time to continue.'
    }
    if (current === 2) {
      if (name.trim().length < 2) errors.name = 'Enter a name so we know who to expect.'
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        errors.email = 'Enter a valid email — we’ll send your booking there.'
      }
      if (phone.replace(/\D/g, '').length < 6) {
        errors.phone = 'Enter a phone number we can reach you on.'
      }
    }
    if (current === 3) {
      if (cardNumber.replace(/\D/g, '').length !== 16) {
        errors.cardNumber = 'Card numbers contain 16 digits. Check and try again.'
      }
      const [mm, yy] = cardExpiry.split(' / ').map(Number)
      const now = new Date()
      const expired =
        2000 + yy < now.getFullYear() ||
        (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1)
      if (!mm || mm > 12 || cardExpiry.length !== 7 || expired) {
        errors.cardExpiry = 'Enter the expiry as MM/YY.'
      }
      if (!/^\d{3}$/.test(cardCvc)) errors.cardCvc = 'Check the 3 digits on the back.'
      if (cardName.trim().length < 2) {
        errors.cardName = 'Enter the name exactly as it appears on your card.'
      }
    }
    setFieldErrors(errors)
    // The guest limit message shows live, but it still blocks the step.
    return Object.keys(errors).length === 0 && !(current === 1 && tooManyGuests)
  }

  function goTo(next: Step) {
    setFieldErrors({})
    setErrorMessage('')
    setStep(next)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Once the hold has ended nothing goes further until availability is rechecked.
    if (step > 1 && holdPhase === 'expired') {
      setHoldModalOpen(true)
      return
    }
    if (step < 3) {
      if (validate(step)) {
        if (step === 1) startHold()
        goTo((step + 1) as Step)
      }
      return
    }
    if (!validate(3)) return

    setErrorMessage('')

    if (!turnstileToken || turnstileExpired) {
      setErrorMessage('Please complete the security check')
      return
    }

    if (submittingRef.current) return
    submittingRef.current = true
    setPaymentError('')
    setFormState('paying')

    // The booking API has no dedicated fields for the chosen tasting, time,
    // food, pricing or requests, so they travel in notes for the manager to read.
    const notes = [
      selected ? `Experience: ${selected.label}` : null,
      time ? `Preferred time: ${time}` : null,
      foodLines.length
        ? `Food:\n${foodLines
            .map((line) => `- ${line.count} × ${line.name} (${formatAmd(line.total)})`)
            .join('\n')}`
        : null,
      customRequest.trim() ? `Custom request: ${customRequest.trim()}` : null,
      comments.trim() ? `Comments: ${comments.trim()}` : null,
      `Total: ${formatAmd(total)} (deposit ${formatAmd(deposit)})`,
    ]
      .filter(Boolean)
      .join('\n')

    const payload: BookingInput = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      experienceType: selected?.experienceType ?? 'custom',
      preferredDate: date,
      preferredTime: time || undefined,
      groupSize: guestCount,
      notes,
      turnstileToken,
    }

    try {
      const payment = await chargeDeposit(deposit)
      if (payment.status !== 'paid') {
        if (payment.status === 'declined') setPaymentError(payment.message ?? DECLINED_MESSAGE)
        else setBankCheckUrl(payment.redirectUrl)
        setFormState('idle')
        submittingRef.current = false
        return
      }

      setFormState('confirming')
      const [response] = await Promise.all([
        fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
        wait(MIN_STATUS_MS),
      ])

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409 && data.code === 'slot_full') {
          setConflict({
            kind: 'slot_full',
            time: data.preferredTime ?? time,
            nextTimes: Array.isArray(data.nextTimes) ? data.nextTimes : [],
          })
        } else if (response.status === 409 && data.code === 'duplicate_booking') {
          setConflict({
            kind: 'duplicate',
            date: data.preferredDate ?? date,
            time: data.preferredTime ?? (time || undefined),
          })
        }
        if (
          response.status === 409 &&
          (data.code === 'slot_full' || data.code === 'duplicate_booking')
        ) {
          setFormState('idle')
          submittingRef.current = false
          return
        }
        if (data.issues) {
          const errors: Record<string, string> = {}
          data.issues.forEach((issue: { field: string; message: string }) => {
            errors[issue.field] = issue.message
          })
          setFieldErrors(errors)
          // Send the guest back to the step that owns the failing field.
          if (errors.preferredDate || errors.groupSize) setStep(1)
          else if (errors.name || errors.email || errors.phone) setStep(2)
          setFormState('idle')
          submittingRef.current = false
          return
        }
        throw new Error(data.error ?? 'Something went wrong')
      }

      setFormState('success')
      writeDraft(draftKey, null)
      trackEvent('booking_inquiry_submitted', {
        experience_type: payload.experienceType,
        group_size: guestCount,
      })
    } catch (err) {
      submittingRef.current = false
      // "Nothing has been charged" is only true while no provider is connected
      // (or when the provider confirms the charge didn't go through). Once a
      // real charge happens before this request, a drop here means the guest
      // may have paid — tell them to check their email instead.
      if (isConnectionError(err)) {
        setFormState('idle')
        setConnectionLostOpen(true)
        return
      }
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setFormState('error')
    }
  }

  // D1/D2 action — back to step 1 with the date kept and the time cleared, so
  // continuing starts a fresh hold for the new slot.
  function pickAnotherTime() {
    setConflict(null)
    setTime('')
    setHoldEndsAt(null)
    setHoldPhase('none')
    goTo(1)
    setFieldErrors({ time: 'Choose another time to continue.' })
  }

  function tryAgain() {
    setConnectionLostOpen(false)
    formRef.current?.requestSubmit()
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

  const totalRow = (
    <div
      className="flex items-baseline justify-between"
      style={{ borderTop: '1px solid rgba(26,29,23,0.1)', paddingTop: fig(18) }}
    >
      <FieldLabel>Total</FieldLabel>
      <p
        aria-live="polite"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 500,
          fontSize: fig(22),
          color: '#1a1d17',
        }}
      >
        {formatAmd(total)}
      </p>
    </div>
  )

  const backLink = (target: Step, label: string) => (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => goTo(target)}
      className="cursor-pointer self-start capitalize disabled:opacity-50"
      style={{
        paddingInline: fig(6),
        paddingBottom: fig(4),
        borderBottom: '1.5px solid #2e3a28',
        fontFamily: 'var(--font-hanken)',
        fontWeight: 500,
        fontSize: fig(14),
        letterSpacing: fig(1.5),
        color: '#1a1d17',
      }}
    >
      {label} →
    </button>
  )

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
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

      {step > 1 && holdPhase === 'warning' && !holdBannerDismissed && (
        <AlertBanner onDismiss={() => setHoldBannerDismissed(true)}>
          2 minutes left to complete your booking.
        </AlertBanner>
      )}

      <ProgressBar step={step} />

      <p
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 700,
          fontSize: fig(12),
          letterSpacing: fig(0.96),
          color: '#7c8b68',
        }}
      >
        STEP {step} OF 3 — {STEP_TITLES[step].toUpperCase()}
      </p>

      {step === 1 && (
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
                onChange={(e) => edit('experience', setExperience)(e.target.value)}
                {...errorProps('experience')}
                className="w-full cursor-pointer appearance-none"
                style={{
                  ...shellStyle,
                  height: fig(50),
                  paddingLeft: fig(16),
                  paddingRight: fig(50),
                  color: experience ? '#1a1d17' : '#757575',
                  ...errorShell('experience'),
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
            <FieldError id="booking-experience-error" message={fieldErrors.experience} />
          </div>

          {/* Add from menu */}
          {foodOptions.length > 0 && (
            <div className="flex flex-col">
              <div className="flex flex-col" style={{ gap: fig(8) }}>
                <FieldLabel>Add From Menu</FieldLabel>
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
                      {formatAmd(option.priceAmd)} per person
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
              onChange={(e) => edit('customRequest', setCustomRequest)(e.target.value)}
              {...errorProps('customRequest')}
              rows={2}
              maxLength={800}
              placeholder="A note for our team — anything else you'd like us to know."
              className="placeholder:text-[#757575]"
              style={{
                ...inputStyle,
                height: fig(68),
                resize: 'none',
                ...errorShell('customRequest'),
              }}
            />
            <FieldError id="booking-customRequest-error" message={fieldErrors.customRequest} />
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#a8a290' }}>
              Notes don&apos;t change your total.
            </p>
          </div>

          {/* Date + time */}
          <div className="flex" style={{ gap: fig(8) }}>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-date">Date</FieldLabel>
              <DatePicker
                id="booking-date"
                value={date}
                onChange={edit('preferredDate', setDate)}
                style={{ ...shellStyle, ...errorShell('preferredDate') }}
                describedBy={errorProps('preferredDate')['aria-describedby']}
              />
              <FieldError id="booking-preferredDate-error" message={fieldErrors.preferredDate} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-time">Time</FieldLabel>
              <TimePicker
                id="booking-time"
                value={time}
                onChange={edit('time', setTime)}
                style={{ ...shellStyle, ...errorShell('time') }}
                describedBy={errorProps('time')['aria-describedby']}
              />
              <FieldError id="booking-time-error" message={fieldErrors.time} />
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
                  disabled={guestCount >= MAX_GROUP_SIZE}
                  onClick={() => setGuestCount((c) => Math.min(MAX_GROUP_SIZE, c + 1))}
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
            <FieldError
              message={
                tooManyGuests
                  ? `We can seat up to ${maxGuests} online. For larger groups, email ${GROUP_EMAIL} and we’ll arrange it.`
                  : fieldErrors.groupSize
              }
            />
          </div>

          {totalRow}

          <button
            type="submit"
            className="w-full cursor-pointer capitalize text-white"
            style={primaryButtonStyle}
          >
            Continue To Your Details
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-name">Full Name</FieldLabel>
            <input
              id="booking-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => edit('name', setName)(e.target.value)}
              {...errorProps('name')}
              placeholder="First and last name"
              style={{ ...inputStyle, ...errorShell('name') }}
            />
            <FieldError id="booking-name-error" message={fieldErrors.name} />
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-email">Email</FieldLabel>
            <input
              id="booking-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => edit('email', setEmail)(e.target.value)}
              {...errorProps('email')}
              placeholder="you@example.com"
              style={{ ...inputStyle, ...errorShell('email') }}
            />
            <FieldError id="booking-email-error" message={fieldErrors.email} />
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-phone">Contact Number</FieldLabel>
            <input
              id="booking-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => edit('phone', setPhone)(e.target.value)}
              {...errorProps('phone')}
              placeholder="+(XXX) XX XXX XXX"
              style={{ ...inputStyle, ...errorShell('phone') }}
            />
            <FieldError id="booking-phone-error" message={fieldErrors.phone} />
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-comments">Comments (Allergies, Requests)</FieldLabel>
            <textarea
              id="booking-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="e.g. nut allergy, wheelchair access, birthday"
              className="placeholder:text-[#757575]"
              style={{ ...inputStyle, height: fig(72), resize: 'none' }}
            />
          </div>

          {totalRow}

          {backLink(1, 'Back To Your Visit')}

          <button
            type="submit"
            className="w-full cursor-pointer capitalize text-white"
            style={primaryButtonStyle}
          >
            Continue To Payment
          </button>
        </>
      )}

      {step === 3 && (
        <>
          {/* Booking summary */}
          <div className="flex flex-col" style={{ gap: fig(8) }}>
            <FieldLabel>Your Booking</FieldLabel>
            <div className="flex flex-col" style={{ ...noteBoxStyle, gap: fig(8) }}>
              <SummaryRow
                left={selected?.label ?? 'Custom request'}
                right={
                  <>
                    {guestCount} guest{guestCount === 1 ? '' : 's'}
                    {selected && (
                      <span style={{ marginLeft: fig(10) }}>{formatAmd(experienceTotal)}</span>
                    )}
                  </>
                }
              />
              <SummaryRow left={formatVisitDate(date)} right={time} />
              {foodLines.map((line) => (
                <SummaryRow
                  key={line.key}
                  left={`${line.name} × ${line.count}`}
                  right={formatAmd(line.total)}
                />
              ))}
            </div>
          </div>

          <div
            className="flex flex-col"
            style={{
              gap: fig(12),
              borderBlock: '1px solid rgba(26,29,23,0.1)',
              paddingBlock: fig(16),
            }}
          >
            <SummaryRow strong left="Total" right={formatAmd(total)} />
            <div className="flex items-baseline justify-between">
              <span
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontWeight: 600,
                  fontSize: fig(13),
                  color: '#1a1d17',
                }}
              >
                Deposit now ({Math.round(DEPOSIT_RATE * 100)}%)
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 500,
                  fontSize: fig(20),
                  color: '#1a1d17',
                }}
              >
                {formatAmd(deposit)}
              </span>
            </div>
            <SummaryRow left="Pay at the winery" right={formatAmd(total - deposit)} />
          </div>

          {paymentError && <AlertBanner tone="error">{paymentError}</AlertBanner>}

          {/* Card */}
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-card-number">Card Number</FieldLabel>
            <input
              id="booking-card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => edit('cardNumber', setCardNumber)(formatCardNumber(e.target.value))}
              {...errorProps('cardNumber')}
              placeholder="1234 5678 9012 3456"
              disabled={isLoading}
              style={{ ...inputStyle, ...errorShell('cardNumber') }}
            />
            <FieldError id="booking-cardNumber-error" message={fieldErrors.cardNumber} />
          </div>
          <div className="flex" style={{ gap: fig(8) }}>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-card-expiry">Expiry</FieldLabel>
              <input
                id="booking-card-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={cardExpiry}
                onChange={(e) => edit('cardExpiry', setCardExpiry)(formatExpiry(e.target.value))}
                {...errorProps('cardExpiry')}
                placeholder="MM / YY"
                disabled={isLoading}
                style={{ ...inputStyle, ...errorShell('cardExpiry') }}
              />
              <FieldError id="booking-cardExpiry-error" message={fieldErrors.cardExpiry} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: fig(6) }}>
              <FieldLabel htmlFor="booking-card-cvc">CVC</FieldLabel>
              <input
                id="booking-card-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cardCvc}
                onChange={(e) =>
                  edit('cardCvc', setCardCvc)(e.target.value.replace(/\D/g, '').slice(0, 3))
                }
                {...errorProps('cardCvc')}
                placeholder="123"
                disabled={isLoading}
                style={{ ...inputStyle, ...errorShell('cardCvc') }}
              />
              <FieldError id="booking-cardCvc-error" message={fieldErrors.cardCvc} />
            </div>
          </div>
          <div className="flex flex-col" style={{ gap: fig(6) }}>
            <FieldLabel htmlFor="booking-card-name">Name On Card</FieldLabel>
            <input
              id="booking-card-name"
              autoComplete="cc-name"
              value={cardName}
              onChange={(e) => edit('cardName', setCardName)(e.target.value)}
              {...errorProps('cardName')}
              placeholder="As shown on the card"
              disabled={isLoading}
              style={{ ...inputStyle, ...errorShell('cardName') }}
            />
            <FieldError id="booking-cardName-error" message={fieldErrors.cardName} />
          </div>

          <div style={noteBoxStyle}>
            <p
              style={{
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: fig(13),
                color: '#1a1d17',
              }}
            >
              Free cancellation up to 24 hours before your visit
            </p>
            <p style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(12), color: '#4f4542' }}>
              We refund your deposit in full. After that, the deposit is non-refundable.
            </p>
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
            <AlertBanner tone="error">
              {errorMessage || 'Something went wrong. Please try again.'}
            </AlertBanner>
          )}

          {backLink(2, 'Back To Your Details')}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer capitalize text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
            style={primaryButtonStyle}
          >
            {isLoading ? 'Processing…' : ctaText}
          </button>
        </>
      )}

      {/* One overlay for both stages, so it doesn't fade out and back in between them. */}
      <StatusOverlay
        open={isLoading}
        {...(formState === 'paying'
          ? {
              title: 'Processing your payment',
              message: 'This takes a few seconds — please don’t close the page.',
            }
          : { title: 'Confirming your booking…', message: 'Almost there.' })}
      />

      <AlertModal
        open={holdModalOpen}
        title="Your hold has ended"
        message="We held your table for 10 minutes. The time may still be free — check availability to try again."
        actions={[
          { label: 'Check availability', onClick: checkAvailabilityAgain },
          { label: 'Close', onClick: () => setHoldModalOpen(false), variant: 'text' },
        ]}
        onClose={() => setHoldModalOpen(false)}
      />

      <AlertModal
        open={savedDraft !== null}
        title="Your session timed out"
        message="Your details are saved. Start again to finish your booking."
        actions={[{ label: 'Start again', onClick: startAgainFromDraft }]}
        onClose={discardDraft}
      />

      <AlertModal
        open={connectionLostOpen}
        title="The connection dropped"
        message="Nothing has been charged. Try again whenever you’re ready."
        actions={[
          { label: 'Try again', onClick: tryAgain },
          { label: 'Close', onClick: () => setConnectionLostOpen(false), variant: 'text' },
        ]}
        onClose={() => setConnectionLostOpen(false)}
      />

      <AlertModal
        open={bankCheckUrl !== null}
        title="Your bank wants to check it’s you"
        message="We’ll take you across now — please stay on this page."
        actions={[
          {
            label: 'Continue',
            onClick: () => {
              if (bankCheckUrl) window.location.assign(bankCheckUrl)
            },
          },
        ]}
        onClose={() => setBankCheckUrl(null)}
      />

      <AlertModal
        open={conflict !== null}
        title={
          conflict?.kind === 'duplicate'
            ? 'You’ve already booked this'
            : 'Someone just took the last place'
        }
        message={conflict ? conflictMessage(conflict) : ''}
        actions={[
          {
            label: conflict?.kind === 'duplicate' ? 'Choose another time' : 'Pick another time',
            onClick: pickAnotherTime,
          },
          { label: 'Close', onClick: () => setConflict(null), variant: 'text' },
        ]}
        onClose={() => setConflict(null)}
      />
    </form>
  )
}
