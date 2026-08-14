// src/app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { contactSchema } from '@/lib/validations/contact'
import { verifyTurnstile } from '@/lib/turnstile'
import { contactRatelimit } from '@/lib/ratelimit'
import { insertContactSubmission } from '@/lib/supabase/queries'
import { sendContactEmails } from '@/lib/email/sendContactEmails'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://hovazwines.com',
    'https://staging.hovazwines.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ]

  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  // ── 1. Rate limiting ──
  const { success: rateLimitOk } = await contactRatelimit.limit(ip)
  if (!rateLimitOk) {
    logger.warn('Contact rate limit exceeded', { ip })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  // ── 2. Parse body ──
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // ── 3. Validate with Zod ──
  const result = contactSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: result.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    )
  }

  const { name, email, phone, subject, message, turnstileToken } = result.data

  // ── 4. Verify Turnstile ──
  const turnstileValid = await verifyTurnstile(turnstileToken)
  if (!turnstileValid) {
    logger.warn('Turnstile verification failed on contact', { ip, email })
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 })
  }

  // ── 5. Insert to Supabase ──
  let submission
  try {
    submission = await insertContactSubmission({
      name,
      email,
      phone: phone ?? null,
      subject: subject ?? null,
      message,
      read: false,
    })
    logger.info('Contact submission created', {
      contactId: submission.id,
      email,
    })
  } catch (error) {
    logger.error('Contact insert failed', error, { email })
    return NextResponse.json(
      { error: 'Failed to save message. Please try again.' },
      { status: 500 }
    )
  }

  // ── 6. Send emails ──
  try {
    await sendContactEmails({
      contactId: submission.id,
      name,
      email,
      phone,
      subject,
      message,
    })
  } catch (error) {
    logger.error('Contact email send failed', error, { contactId: submission.id })
  }

  // ── 7. Return success ──
  return NextResponse.json(
    {
      success: true,
      message: 'Message received. We will get back to you within 24 hours.',
    },
    { status: 201 }
  )
}
