// src/lib/bookingCancellation.ts
// Self-service cancellation rules (shown on /booking/cancel):
//   more than 24 hours before the visit → full refund
//   less than 24 hours                  → can still cancel, no refund
//   visit already started / past         → can't cancel online
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']

export const FULL_REFUND_HOURS = 24

// Armenia is UTC+4 all year (no DST), so a fixed offset is safe.
const ESTATE_UTC_OFFSET = '+04:00'

/** The slot's start time as "HH:mm", from the column or (older rows) the notes. */
export function bookingTime(booking: Pick<Booking, 'preferred_time' | 'notes'>): string | null {
  if (booking.preferred_time) return booking.preferred_time.slice(0, 5)
  return booking.notes?.match(/Preferred time: ([01]\d|2[0-3]):([0-5]\d)/)?.[0].slice(-5) ?? null
}

/**
 * When the visit starts. Without a time we use the start of the day, so the
 * 24-hour window is never more generous than it should be.
 */
export function bookingStartsAt(
  booking: Pick<Booking, 'preferred_date' | 'preferred_time' | 'notes'>
) {
  const time = bookingTime(booking) ?? '00:00'
  return new Date(`${booking.preferred_date}T${time}:00${ESTATE_UTC_OFFSET}`)
}

export type CancellationState =
  | { cancellable: true; refund: 'full' | 'none'; hoursUntilStart: number }
  | { cancellable: false; reason: 'already_cancelled' | 'completed' | 'started' }

export function cancellationState(
  booking: Pick<Booking, 'status' | 'preferred_date' | 'preferred_time' | 'notes'>,
  now = new Date()
): CancellationState {
  if (booking.status === 'cancelled') return { cancellable: false, reason: 'already_cancelled' }
  if (booking.status === 'completed') return { cancellable: false, reason: 'completed' }

  const hoursUntilStart = (bookingStartsAt(booking).getTime() - now.getTime()) / 3_600_000
  if (hoursUntilStart <= 0) return { cancellable: false, reason: 'started' }

  return {
    cancellable: true,
    refund: hoursUntilStart > FULL_REFUND_HOURS ? 'full' : 'none',
    hoursUntilStart,
  }
}

export interface BookingAddOn {
  name: string
  quantity: number
}

function parseAddOns(value: Booking['add_ons']): BookingAddOn[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const { name, quantity } = (item ?? {}) as Partial<BookingAddOn>
    return typeof name === 'string' && typeof quantity === 'number' ? [{ name, quantity }] : []
  })
}

/** What the guest sees in step 2 — no phone, notes or admin fields. */
export function publicBookingSummary(booking: Booking, now = new Date()) {
  const cancellation = cancellationState(booking, now)
  return {
    confirmationCode: booking.confirmation_code,
    firstName: booking.name.split(/\s+/)[0],
    experienceType: booking.experience_type,
    experienceName: booking.experience_name,
    estate: booking.estate,
    date: booking.preferred_date,
    time: bookingTime(booking),
    groupSize: booking.group_size,
    addOns: parseAddOns(booking.add_ons),
    depositAmd: booking.deposit_amd,
    status: booking.status,
    cancellation,
  }
}

export type PublicBookingSummary = ReturnType<typeof publicBookingSummary>
