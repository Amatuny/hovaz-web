// src/app/api/admin/bookings/[id]/route.ts
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { insertEmailLog } from '@/lib/supabase/queries'
import { logger } from '@/lib/logger'
import { StatusUpdateEmail } from '@/lib/email/templates/StatusUpdateEmail'
import type { TablesUpdate } from '@/types/database'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Props) {
  // ── 1. Auth check ──
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // ── 2. Parse body ──
  let body: { status?: string; adminNotes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { status, adminNotes } = body

  // ── 3. Validate status ──
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  // ── 4. Get the booking ──
  const admin = createAdminClient()
  const { data: booking, error: fetchError } = await admin
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // ── 5. Update status ──
  const updateData: TablesUpdate<'bookings'> = {
    status: status as TablesUpdate<'bookings'>['status'],
  }
  if (adminNotes) updateData.admin_notes = adminNotes

  const { error: updateError } = await admin.from('bookings').update(updateData).eq('id', id)

  if (updateError) {
    logger.error('Booking status update failed', updateError, { id, status })
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }

  logger.info('Booking status updated', { id, status, updatedBy: user.email })

  // ── 6. Send guest notification email ──
  if (status === 'confirmed' || status === 'cancelled') {
    try {
      const isConfirmed = status === 'confirmed'

      const emailHtml = await render(
        StatusUpdateEmail({
          name: booking.name,
          experienceType: booking.experience_type,
          preferredDate: booking.preferred_date,
          groupSize: booking.group_size,
          status,
          isConfirmed,
        })
      )

      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: booking.email,
        subject: isConfirmed
          ? 'Your booking is confirmed — HOVAZ Wine Rooms'
          : 'Booking update — HOVAZ Wine Rooms',
        html: emailHtml,
      })

      await insertEmailLog({
        booking_id: id,
        type: 'booking_status_update' as const,
        recipient: booking.email,
        subject: isConfirmed
          ? 'Your booking is confirmed — HOVAZ Wine Rooms'
          : 'Booking update — HOVAZ Wine Rooms',
        status: emailResult.data ? ('sent' as const) : ('failed' as const),
        resend_id: emailResult.data?.id ?? null,
        error: emailResult.error ? String(emailResult.error) : null,
      })
    } catch (error) {
      logger.error('Status update email failed', error, { id, status })
      // Don't fail the status update if email fails
    }
  }

  return NextResponse.json({
    success: true,
    bookingId: id,
    newStatus: status,
  })
}
