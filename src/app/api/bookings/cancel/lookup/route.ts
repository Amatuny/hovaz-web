// src/app/api/bookings/cancel/lookup/route.ts
// Step 1 of /booking/cancel: find a booking by confirmation number + email.
import { NextResponse } from 'next/server'
import { resolveCancellationRequest } from '@/lib/cancellationRequest'
import { publicBookingSummary } from '@/lib/bookingCancellation'

export async function POST(request: Request) {
  const resolved = await resolveCancellationRequest(request)
  if ('response' in resolved) return resolved.response

  return NextResponse.json({ booking: publicBookingSummary(resolved.booking) })
}
