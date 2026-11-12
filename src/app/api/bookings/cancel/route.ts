// src/app/api/bookings/cancel/route.ts
// Step 2 of /booking/cancel: cancel the booking. Code + email are checked
// again here — the lookup step is never trusted on its own.
import { NextResponse } from 'next/server'
import { resolveCancellationRequest } from '@/lib/cancellationRequest'
import { cancellationState, publicBookingSummary } from '@/lib/bookingCancellation'
import { cancelBookingByGuest } from '@/lib/supabase/queries'
import { sendCancellationEmails } from '@/lib/email/sendCancellationEmails'
import { logger } from '@/lib/logger'
import { CANCELLATION_REASONS, cancellationReasonSchema } from '@/lib/validations/cancellation'

const NOT_CANCELLABLE_MESSAGES = {
  already_cancelled: 'This booking has already been cancelled.',
  completed: 'This visit has already taken place.',
  started: 'This visit has already started, so it can no longer be cancelled online.',
} as const

export async function POST(request: Request) {
  const resolved = await resolveCancellationRequest(request)
  if ('response' in resolved) return resolved.response
  const { booking, body } = resolved

  // Optional; an unknown value is ignored rather than blocking the cancellation.
  const reasonResult = cancellationReasonSchema.safeParse(
    (body as { reason?: unknown } | null)?.reason ?? undefined
  )
  const reason = reasonResult.success ? (reasonResult.data ?? null) : null

  const state = cancellationState(booking)
  if (!state.cancellable) {
    return NextResponse.json(
      {
        error: NOT_CANCELLABLE_MESSAGES[state.reason],
        code: state.reason,
        booking: publicBookingSummary(booking),
      },
      { status: 409 }
    )
  }

  const refundNote =
    state.refund === 'full'
      ? 'full refund due (more than 24 hours before the visit)'
      : 'no refund (less than 24 hours before the visit)'

  let cancelled
  try {
    cancelled = await cancelBookingByGuest(
      booking.id,
      `[${new Date().toISOString()}] Cancelled by guest online — ${refundNote}.${
        reason ? ` Reason: ${CANCELLATION_REASONS[reason]}.` : ''
      }`,
      reason
    )
  } catch (error) {
    logger.error('Guest cancellation failed', error, { bookingId: booking.id })
    return NextResponse.json(
      { error: 'Failed to cancel the booking. Please try again.' },
      { status: 500 }
    )
  }

  // Someone (another tab, or an admin) changed it between the read and the update.
  if (!cancelled) {
    return NextResponse.json(
      { error: NOT_CANCELLABLE_MESSAGES.already_cancelled, code: 'already_cancelled' },
      { status: 409 }
    )
  }

  logger.info('Booking cancelled by guest', {
    bookingId: booking.id,
    confirmationCode: booking.confirmation_code,
    refund: state.refund,
    reason,
  })

  try {
    await sendCancellationEmails(cancelled, state.refund)
  } catch (error) {
    // The cancellation stands even if the emails fail
    logger.error('Cancellation email send failed', error, { bookingId: booking.id })
  }

  return NextResponse.json({
    success: true,
    refund: state.refund,
    booking: publicBookingSummary(cancelled),
  })
}
