import { createAdminClient } from './server'
import type { Database } from '@/types/database'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type ContactInsert = Database['public']['Tables']['contact_submissions']['Insert']
type NewsletterInsert = Database['public']['Tables']['newsletter_subscribers']['Insert']
type EmailLogInsert = Database['public']['Tables']['email_logs']['Insert']
type EmailStatus = Database['public']['Enums']['email_status']
type EmailType = Database['public']['Enums']['email_type']

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

// ── NEWSLETTER SUBSCRIBERS ──

export async function insertNewsletterSubscriber(data: NewsletterInsert) {
  const supabase = createAdminClient()
  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .insert(data)
    .select()
    .single()

  if (error) {
    // Unique violation — already subscribed, not a failure
    if (error.code === '23505') {
      return { alreadySubscribed: true as const }
    }
    throw new Error(`Failed to insert newsletter subscriber: ${error.message}`)
  }

  return { alreadySubscribed: false as const, subscriber }
}

// ── EMAIL LOGS ──

export async function insertEmailLog(data: {
  booking_id?: string | null
  contact_id?: string | null
  type: EmailType
  recipient: string
  subject?: string | null
  status: EmailStatus
  resend_id?: string | null
  error?: string | null
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('email_logs').insert(data)

  if (error) {
    console.error('Failed to insert email log:', error.message)
  }
}

export async function getEmailLogs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .order('sent_at', { ascending: false })

  if (error) throw new Error(`Failed to fetch email logs: ${error.message}`)
  return data
}
