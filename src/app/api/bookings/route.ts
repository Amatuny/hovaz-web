// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { bookingSchema } from '@/lib/validations/booking'
import { verifyTurnstile } from '@/lib/turnstile'
import { bookingRatelimit } from '@/lib/ratelimit'
import { insertBooking } from '@/lib/supabase/queries'
import { sendBookingEmails } from '@/lib/email/sendBookingEmails'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  // ── 1. Rate limiting ──
  const { success: rateLimitOk } = await bookingRatelimit.limit(ip)
  if (!rateLimitOk) {
    logger.warn('Booking rate limit exceeded', { ip })
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
  const result = bookingSchema.safeParse(body)
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

  const { name, email, phone, experienceType, preferredDate, groupSize, notes, turnstileToken } =
    result.data

  // ── 4. Verify Turnstile ──
  const turnstileValid = await verifyTurnstile(turnstileToken)
  if (!turnstileValid) {
    logger.warn('Turnstile verification failed', { ip, email })
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 })
  }

  // ── 5. Insert booking to Supabase ──
  let booking
  try {
    booking = await insertBooking({
      name,
      email,
      phone,
      experience_type: experienceType as never,
      preferred_date: preferredDate,
      group_size: groupSize,
      notes: notes ?? null,
      status: 'pending',
    })
    logger.info('Booking created', {
      bookingId: booking.id,
      email,
      experienceType,
    })
  } catch (error) {
    logger.error('Booking insert failed', error, { email, experienceType })
    return NextResponse.json(
      { error: 'Failed to save booking. Please try again.' },
      { status: 500 }
    )
  }

  // ── 6. Send emails ──
  try {
    await sendBookingEmails({
      bookingId: booking.id,
      name,
      email,
      phone,
      experienceType,
      preferredDate,
      groupSize,
      notes,
    })
  } catch (error) {
    // Email failure doesn't fail the booking — it's already saved
    logger.error('Booking email send failed', error, { bookingId: booking.id })
  }

  // ── 7. Return success ──
  return NextResponse.json(
    {
      success: true,
      message: 'Booking inquiry received. We will contact you within 24 hours.',
      bookingId: booking.id,
    },
    { status: 201 }
  )
}
