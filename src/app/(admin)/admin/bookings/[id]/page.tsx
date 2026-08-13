// src/app/(admin)/admin/bookings/[id]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { BookingActions } from '@/components/admin/BookingActions'

export const metadata: Metadata = { title: 'Booking Detail' }
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

async function getBooking(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single()

  if (error || !data) return null
  return data
}

async function getEmailLogs(bookingId: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('email_logs')
    .select('*')
    .eq('booking_id', bookingId)
    .order('sent_at', { ascending: false })

  return data ?? []
}

const statusColors: Record<string, string> = {
  pending: '#B8924A',
  confirmed: '#2D6A4F',
  cancelled: '#dc2626',
  completed: '#6B7280',
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params
  const [booking, emailLogs] = await Promise.all([getBooking(id), getEmailLogs(id)])

  if (!booking) notFound()

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/bookings"
          className="text-caption transition-colors"
          style={{ color: 'var(--color-brand-stone)' }}
        >
          ← Bookings
        </Link>
        <span style={{ color: 'var(--color-brand-stone)' }}>/</span>
        <span className="text-caption" style={{ color: 'var(--color-brand-charcoal)' }}>
          {booking.name}
        </span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
            {booking.name}
          </h1>
          <p className="text-caption">
            Submitted{' '}
            {new Date(booking.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className="text-label px-3 py-1 rounded"
          style={{
            backgroundColor: `${statusColors[booking.status]}20`,
            color: statusColors[booking.status],
            fontSize: '0.7rem',
          }}
        >
          {booking.status}
        </span>
      </div>

      {/* Booking details */}
      <div
        className="rounded p-6 mb-4"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brand-charcoal)' }}>
          Booking Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Experience', value: booking.experience_type?.replace(/_/g, ' ') },
            {
              label: 'Preferred Date',
              value: new Date(booking.preferred_date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            },
            { label: 'Group Size', value: `${booking.group_size} guests` },
            { label: 'Status', value: booking.status },
          ].map((item) => (
            <div key={item.label} className="py-3" style={{ borderBottom: '1px solid #F0EDE8' }}>
              <p className="text-label mb-1" style={{ color: 'var(--color-brand-stone)' }}>
                {item.label}
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--color-brand-charcoal)' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        {booking.notes && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F0EDE8' }}>
            <p className="text-label mb-2" style={{ color: 'var(--color-brand-stone)' }}>
              Notes from guest
            </p>
            <p
              className="font-sans text-sm"
              style={{ color: 'var(--color-brand-charcoal)', lineHeight: '1.6' }}
            >
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      {/* Guest contact info */}
      <div
        className="rounded p-6 mb-4"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brand-charcoal)' }}>
          Guest Information
        </h2>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Name', value: booking.name },
            { label: 'Email', value: booking.email, href: 'mailto:' + booking.email },
            { label: 'Phone', value: booking.phone, href: 'tel:' + booking.phone },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-3"
              style={{ borderBottom: '1px solid #F0EDE8' }}
            >
              <p className="text-label" style={{ color: 'var(--color-brand-stone)' }}>
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-sans text-sm transition-colors"
                  style={{ color: 'var(--color-brand-burgundy)' }}
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-sans text-sm" style={{ color: 'var(--color-brand-charcoal)' }}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <BookingActions
        bookingId={booking.id}
        currentStatus={booking.status}
        guestName={booking.name}
        guestEmail={booking.email}
      />

      {/* Email logs */}
      {emailLogs.length > 0 && (
        <div
          className="rounded p-6 mt-4"
          style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
        >
          <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brand-charcoal)' }}>
            Email History
          </h2>
          <div className="flex flex-col gap-2">
            {emailLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid #F0EDE8' }}
              >
                <div>
                  <p className="font-sans text-sm" style={{ color: 'var(--color-brand-charcoal)' }}>
                    {log.type?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-caption">{log.recipient}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-label px-2 py-1 rounded"
                    style={{
                      fontSize: '0.6rem',
                      backgroundColor: log.status === 'sent' ? '#F0F7F4' : '#FFF0F0',
                      color: log.status === 'sent' ? '#2D6A4F' : '#dc2626',
                    }}
                  >
                    {log.status}
                  </span>
                  <p className="text-caption">
                    {new Date(log.sent_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
