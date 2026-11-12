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

// An active booking by the same guest for the same experience, day and (when
// given) time — used to stop an accidental second booking and deposit.
export async function findDuplicateBooking({
  email,
  preferredDate,
  experienceType,
  preferredTime,
}: {
  email: string
  preferredDate: string
  experienceType: BookingInsert['experience_type']
  preferredTime?: string
}) {
  const supabase = createAdminClient()
  // ilike for a case-insensitive match; escape LIKE wildcards in the address.
  const { data, error } = await supabase
    .from('bookings')
    .select('id, notes')
    .ilike('email', email.replace(/[\\%_]/g, '\\$&'))
    .eq('preferred_date', preferredDate)
    .eq('experience_type', experienceType)
    .in('status', ['pending', 'confirmed'])

  if (error) throw new Error(`Failed to check for duplicate booking: ${error.message}`)
  // The time only lives in notes ("Preferred time: HH:mm").
  return (
    data.find(
      (booking) => !preferredTime || booking.notes?.includes(`Preferred time: ${preferredTime}`)
    ) ?? null
  )
}

// The booking only if both the code and the email match — callers must not be
// able to tell which of the two was wrong.
export async function findBookingByConfirmation(confirmationCode: string, email: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('confirmation_code', confirmationCode)
    .maybeSingle()

  if (error) throw new Error(`Failed to look up booking: ${error.message}`)
  if (!data || data.email.trim().toLowerCase() !== email.trim().toLowerCase()) return null
  return data
}

// Cancels only if the booking is still active, so two simultaneous requests
// can't both succeed. Returns null when nothing was updated.
export async function cancelBookingByGuest(id: string, adminNote: string, reason: string | null) {
  const supabase = createAdminClient()
  const { data: current, error: readError } = await supabase
    .from('bookings')
    .select('admin_notes')
    .eq('id', id)
    .single()
  if (readError) throw new Error(`Failed to read booking: ${readError.message}`)

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
      admin_notes: [current.admin_notes, adminNote].filter(Boolean).join('\n'),
    })
    .eq('id', id)
    .in('status', ['pending', 'confirmed'])
    .select()
    .maybeSingle()

  if (error) throw new Error(`Failed to cancel booking: ${error.message}`)
  return data
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
