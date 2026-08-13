// src/app/api/admin/bookings/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type BookingStatus = Database['public']['Enums']['booking_status']

const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed']

function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as string[]).includes(value)
}

export async function GET(request: Request) {
  // Verify authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const admin = createAdminClient()
  let query = admin.from('bookings').select('*').order('created_at', { ascending: false })

  if (status && status !== 'all') {
    if (!isBookingStatus(status)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
    }
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings: data })
}
