// src/lib/cancellationRequest.ts
// Shared front half of the /api/bookings/cancel endpoints: origin check, rate
// limits, validation, and finding the booking by code + email.
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { cancellationLookupSchema } from '@/lib/validations/cancellation'
import { cancellationCodeRatelimit, cancellationRatelimit } from '@/lib/ratelimit'
import { findBookingByConfirmation } from '@/lib/supabase/queries'
import { logger } from '@/lib/logger'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']

const ALLOWED_ORIGINS = [
  'https://hovazwines.com',
  'https://staging.hovazwines.com',
  'http://localhost:3000',
  'http://localhost:3001',
]

// Same answer whether the code or the email is wrong (or both).
export const NOT_FOUND_MESSAGE =
  "We couldn't find a booking with that confirmation number and email. Check both and try again."

export async function resolveCancellationRequest(
  request: Request
): Promise<{ booking: Booking; body: unknown } | { response: NextResponse }> {
  const origin = request.headers.get('origin')
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return { response: NextResponse.json({ error: 'Not allowed' }, { status: 403 }) }
  }

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const tooMany = () =>
    NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })

  const { success: ipOk } = await cancellationRatelimit.limit(ip)
  if (!ipOk) {
    logger.warn('Cancellation rate limit exceeded', { ip })
    return { response: tooMany() }
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return { response: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }
  }

  const result = cancellationLookupSchema.safeParse(body)
  if (!result.success) {
    return {
      response: NextResponse.json(
        {
          error: 'Validation failed',
          issues: result.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      ),
    }
  }
  const { confirmationCode, email } = result.data

  const { success: codeOk } = await cancellationCodeRatelimit.limit(confirmationCode)
  if (!codeOk) {
    logger.warn('Cancellation per-code rate limit exceeded', { ip, confirmationCode })
    return { response: tooMany() }
  }

  let booking: Booking | null
  try {
    booking = await findBookingByConfirmation(confirmationCode, email)
  } catch (error) {
    logger.error('Booking lookup failed', error, { confirmationCode })
    return {
      response: NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      ),
    }
  }

  if (!booking) {
    logger.info('Booking lookup: no match', { ip, confirmationCode })
    return { response: NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 }) }
  }

  return { booking, body }
}
