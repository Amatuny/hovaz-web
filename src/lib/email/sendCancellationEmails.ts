// src/lib/email/sendCancellationEmails.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { BookingCancelledEmail } from './templates/BookingCancelledEmail'
import { insertEmailLog } from '@/lib/supabase/queries'
import { bookingTime } from '@/lib/bookingCancellation'
import { CANCELLATION_REASONS, type CancellationReason } from '@/lib/validations/cancellation'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendCancellationEmails(booking: Booking, refund: 'full' | 'none') {
  const adminEmail = process.env.EMAIL_ADMIN!
  const fromEmail = process.env.EMAIL_FROM!

  const props = {
    confirmationCode: booking.confirmation_code,
    name: booking.name,
    email: booking.email,
    experienceType: booking.experience_type,
    preferredDate: booking.preferred_date,
    preferredTime: bookingTime(booking),
    groupSize: booking.group_size,
    refund,
    depositAmd: booking.deposit_amd,
    experienceName: booking.experience_name,
    reason: booking.cancellation_reason
      ? (CANCELLATION_REASONS[booking.cancellation_reason as CancellationReason] ??
        booking.cancellation_reason)
      : null,
  }

  const guestSubject = `Your booking ${booking.confirmation_code} is cancelled — HOVAZ Wine Rooms`
  const adminSubject = `Booking cancelled ${booking.confirmation_code} — ${
    refund === 'full' ? 'refund due' : 'no refund'
  }`

  const [guestHtml, adminHtml] = await Promise.all([
    render(BookingCancelledEmail({ ...props, audience: 'guest' })),
    render(BookingCancelledEmail({ ...props, audience: 'admin' })),
  ])

  const [guestResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: booking.email,
      subject: guestSubject,
      html: guestHtml,
    }),
    resend.emails.send({ from: fromEmail, to: adminEmail, subject: adminSubject, html: adminHtml }),
  ])

  await Promise.allSettled([
    insertEmailLog({
      booking_id: booking.id,
      type: 'booking_status_update',
      recipient: booking.email,
      subject: guestSubject,
      status: guestResult.status === 'fulfilled' && guestResult.value.data ? 'sent' : 'failed',
      resend_id: guestResult.status === 'fulfilled' ? (guestResult.value.data?.id ?? null) : null,
      error:
        guestResult.status === 'rejected'
          ? String(guestResult.reason)
          : guestResult.value.error
            ? String(guestResult.value.error.message)
            : null,
    }),
    insertEmailLog({
      booking_id: booking.id,
      type: 'booking_admin_notification',
      recipient: adminEmail,
      subject: adminSubject,
      status: adminResult.status === 'fulfilled' && adminResult.value.data ? 'sent' : 'failed',
      resend_id: adminResult.status === 'fulfilled' ? (adminResult.value.data?.id ?? null) : null,
      error:
        adminResult.status === 'rejected'
          ? String(adminResult.reason)
          : adminResult.value.error
            ? String(adminResult.value.error.message)
            : null,
    }),
  ])
}
