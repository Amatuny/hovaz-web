// src/app/api/newsletter/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { newsletterSchema } from '@/lib/validations/newsletter'
import { verifyTurnstile } from '@/lib/turnstile'
import { newsletterRatelimit } from '@/lib/ratelimit'
import { insertNewsletterSubscriber } from '@/lib/supabase/queries'
import { sendNewsletterWelcomeEmail } from '@/lib/email/sendNewsletterWelcomeEmail'
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
  const { success: rateLimitOk } = await newsletterRatelimit.limit(ip)
  if (!rateLimitOk) {
    logger.warn('Newsletter rate limit exceeded', { ip })
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
  const result = newsletterSchema.safeParse(body)
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

  const { email, source, turnstileToken } = result.data

  // ── 4. Verify Turnstile ──
  const turnstileValid = await verifyTurnstile(turnstileToken)
  if (!turnstileValid) {
    logger.warn('Turnstile verification failed on newsletter', { ip, email })
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 })
  }

  // ── 5. Insert to Supabase ──
  let insertResult
  try {
    insertResult = await insertNewsletterSubscriber({ email, source: source ?? 'homepage' })
  } catch (error) {
    logger.error('Newsletter insert failed', error, { email })
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }

  // ── 6. Send welcome email (first-time subscribers only) ──
  if (!insertResult.alreadySubscribed) {
    try {
      await sendNewsletterWelcomeEmail(email)
    } catch (error) {
      logger.error('Newsletter welcome email failed', error, { email })
    }
  }

  // ── 7. Return success ──
  return NextResponse.json(
    {
      success: true,
      alreadySubscribed: insertResult.alreadySubscribed,
      message: insertResult.alreadySubscribed
        ? "You're already on the list."
        : "You're subscribed — welcome to the forest.",
    },
    { status: 201 }
  )
}
