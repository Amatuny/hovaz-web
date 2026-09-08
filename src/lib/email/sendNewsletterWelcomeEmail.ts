// src/lib/email/sendNewsletterWelcomeEmail.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { NewsletterWelcomeEmail } from './templates/NewsletterWelcomeEmail'
import { insertEmailLog } from '@/lib/supabase/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewsletterWelcomeEmail(email: string) {
  const fromEmail = process.env.EMAIL_FROM!
  const subject = "You're on the list — HOVAZ Wine Rooms"

  const html = await render(NewsletterWelcomeEmail())

  const result = await resend.emails
    .send({ from: fromEmail, to: email, subject, html })
    .then((r) => ({ status: 'fulfilled' as const, value: r }))
    .catch((error) => ({ status: 'rejected' as const, reason: error }))

  await insertEmailLog({
    type: 'newsletter_welcome' as const,
    recipient: email,
    subject,
    status: result.status === 'fulfilled' ? ('sent' as const) : ('failed' as const),
    resend_id: result.status === 'fulfilled' ? (result.value.data?.id ?? null) : null,
    error: result.status === 'rejected' ? String(result.reason) : null,
  })
}
