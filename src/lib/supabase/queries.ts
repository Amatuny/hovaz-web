import { createAdminClient } from './server'
import type { Database } from '@/types/database'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type ContactInsert = Database['public']['Tables']['contact_submissions']['Insert']
type EmailLogInsert = Database['public']['Tables']['email_logs']['Insert']

// ── BOOKINGS ──

export async function insertBooking(data: BookingInsert) {
  const supabase = createAdminClient()
  const { data: booking, error } = await supabase.from('bookings').insert(data).select().single()

  if (error) throw new Error(`Failed to insert booking: ${error.message}`)
  return booking
}

export async function getBookings(status?: Database['public']['Enums']['booking_status']) {
  const supabase = createAdminClient()
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch bookings: ${error.message}`)
  return data
}

export async function updateBookingStatus(
  id: string,
  status: Database['public']['Enums']['booking_status'],
  adminNotes?: string
) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, ...(adminNotes && { admin_notes: adminNotes }) })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update booking: ${error.message}`)
  return data
}

// ── CONTACT SUBMISSIONS ──

export async function insertContactSubmission(data: ContactInsert) {
  const supabase = createAdminClient()
  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to insert contact submission: ${error.message}`)
  return submission
}

export async function getContactSubmissions(unreadOnly = false) {
  const supabase = createAdminClient()
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch contact submissions: ${error.message}`)
  return data
}

export async function markContactAsRead(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('contact_submissions').update({ read: true }).eq('id', id)

  if (error) throw new Error(`Failed to mark contact as read: ${error.message}`)
}

// ── EMAIL LOGS ──

export async function insertEmailLog(data: EmailLogInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('email_logs').insert(data)

  if (error) {
    console.error('Failed to insert email log:', error.message)
  }
}
