// src/lib/email/sendContactEmails.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ContactAdminEmail } from './templates/ContactAdminEmail'
import { ContactUserEmail } from './templates/ContactUserEmail'
import { insertEmailLog } from '@/lib/supabase/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  contactId: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export async function sendContactEmails(data: ContactEmailData) {
  const adminEmail = process.env.EMAIL_ADMIN!
  const fromEmail = process.env.EMAIL_FROM!

  const [adminHtml, userHtml] = await Promise.all([
    render(
      ContactAdminEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      })
    ),
    render(ContactUserEmail({ name: data.name })),
  ])

  const [adminResult, userResult] = await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Contact Message — ${data.subject ?? data.name}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: 'We received your message — HOVAZ Wine Rooms',
      html: userHtml,
    }),
  ])

  // Log results — never throws
  await Promise.allSettled([
    insertEmailLog({
      contact_id: data.contactId,
      type: 'contact_admin_notification' as const,
      recipient: adminEmail,
      subject: `New Contact Message — ${data.subject ?? data.name}`,
      status: adminResult.status === 'fulfilled' ? ('sent' as const) : ('failed' as const),
      resend_id: adminResult.status === 'fulfilled' ? (adminResult.value.data?.id ?? null) : null,
      error: adminResult.status === 'rejected' ? String(adminResult.reason) : null,
    }),
    insertEmailLog({
      contact_id: data.contactId,
      type: 'contact_user_confirmation' as const,
      recipient: data.email,
      subject: 'We received your message — HOVAZ Wine Rooms',
      status: userResult.status === 'fulfilled' ? ('sent' as const) : ('failed' as const),
      resend_id: userResult.status === 'fulfilled' ? (userResult.value.data?.id ?? null) : null,
      error: userResult.status === 'rejected' ? String(userResult.reason) : null,
    }),
  ])
}
