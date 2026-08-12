// src/lib/email/sendBookingEmails.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { BookingAdminEmail } from './templates/BookingAdminEmail'
import { BookingUserEmail } from './templates/BookingUserEmail'
import { insertEmailLog } from '@/lib/supabase/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingEmailData {
  bookingId: string
  name: string
  email: string
  phone: string
  experienceType: string
  preferredDate: string
  groupSize: number
  notes?: string
}

export async function sendBookingEmails(data: BookingEmailData) {
  const adminEmail = process.env.EMAIL_ADMIN!
  const fromEmail = process.env.EMAIL_FROM!

  const [adminHtml, userHtml] = await Promise.all([
    render(
      BookingAdminEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        experienceType: data.experienceType,
        preferredDate: data.preferredDate,
        groupSize: data.groupSize,
        notes: data.notes,
      })
    ),
    render(
      BookingUserEmail({
        name: data.name,
        experienceType: data.experienceType,
        preferredDate: data.preferredDate,
        groupSize: data.groupSize,
      })
    ),
  ])

  // Send both emails in parallel
  const [adminResult, userResult] = await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Booking Inquiry — ${data.experienceType.replace(/_/g, ' ')}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: 'We received your inquiry — HOVAZ Wine Rooms',
      html: userHtml,
    }),
  ])

  // Log email results to Supabase (never throws)
  await Promise.allSettled([
    insertEmailLog({
      booking_id: data.bookingId,
      type: 'booking_admin_notification' as const,
      recipient: adminEmail,
      subject: `New Booking Inquiry — ${data.experienceType}`,
      status: adminResult.status === 'fulfilled' ? ('sent' as const) : ('failed' as const),
      resend_id: adminResult.status === 'fulfilled' ? (adminResult.value.data?.id ?? null) : null,
      error: adminResult.status === 'rejected' ? String(adminResult.reason) : null,
    }),
    insertEmailLog({
      booking_id: data.bookingId,
      type: 'booking_user_confirmation' as const,
      recipient: data.email,
      subject: 'We received your inquiry — HOVAZ Wine Rooms',
      status: userResult.status === 'fulfilled' ? ('sent' as const) : ('failed' as const),
      resend_id: userResult.status === 'fulfilled' ? (userResult.value.data?.id ?? null) : null,
      error: userResult.status === 'rejected' ? String(userResult.reason) : null,
    }),
  ])
}
