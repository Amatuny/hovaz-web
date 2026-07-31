// src/lib/email/sendBookingEmails.ts
import { resend } from './client'
import { BookingAdminEmail } from './templates/BookingAdminEmail'
import { BookingUserEmail } from './templates/BookingUserEmail'
import { render } from '@react-email/render'

interface BookingData {
  name: string
  email: string
  phone: string
  experienceType: string
  preferredDate: string
  groupSize: number
  notes?: string
}

export async function sendBookingEmails(data: BookingData) {
  const adminHtml = await render(BookingAdminEmail(data))
  const userHtml = await render(BookingUserEmail(data))

  await Promise.all([
    // Email to admin
    resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_ADMIN!,
      subject: `New Booking Inquiry — ${data.experienceType}`,
      html: adminHtml,
    }),
    // Confirmation to user
    resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: data.email,
      subject: 'We received your inquiry — HOVAZ',
      html: userHtml,
    }),
  ])
}
