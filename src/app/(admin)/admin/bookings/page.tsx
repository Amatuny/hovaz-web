// src/app/(admin)/admin/bookings/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export const metadata: Metadata = { title: 'Bookings' }
export const dynamic = 'force-dynamic'

type BookingStatus = Database['public']['Enums']['booking_status']

const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed']

function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as string[]).includes(value)
}

const statusColors: Record<string, string> = {
  pending: '#B8924A',
  confirmed: '#2D6A4F',
  cancelled: '#dc2626',
  completed: '#6B7280',
}

const statusBg: Record<string, string> = {
  pending: '#FFF8F0',
  confirmed: '#F0F7F4',
  cancelled: '#FFF0F0',
  completed: '#F5F5F5',
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

async function getBookings(status?: string) {
  const supabase = createAdminClient()
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

  if (status && status !== 'all' && isBookingStatus(status)) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export default async function BookingsPage({ searchParams }: Props) {
  const { status } = await searchParams
  const activeStatus = status ?? 'all'
  const bookings = await getBookings(activeStatus)

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Completed', value: 'completed' },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
          Bookings
        </h1>
        <p className="text-caption">{bookings.length} bookings</p>
      </div>

      {/* Status filter tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded"
        style={{ backgroundColor: '#E5E0D8', width: 'fit-content' }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'all' ? '/admin/bookings' : `/admin/bookings?status=${tab.value}`}
            className="px-4 py-2 rounded font-sans text-sm transition-colors"
            style={{
              backgroundColor: activeStatus === tab.value ? 'white' : 'transparent',
              color:
                activeStatus === tab.value
                  ? 'var(--color-brand-burgundy)'
                  : 'var(--color-brand-stone)',
              fontWeight: activeStatus === tab.value ? 600 : 400,
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Bookings table */}
      <div
        className="rounded overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl mb-2" style={{ color: 'var(--color-brand-stone)' }}>
              No bookings found
            </p>
            <p className="text-caption">
              {activeStatus !== 'all'
                ? `No ${activeStatus} bookings at the moment`
                : 'No bookings have been submitted yet'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F1E8' }}>
                {['Guest', 'Experience', 'Date', 'Group', 'Submitted', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="text-label text-left px-4 py-3"
                    style={{ color: 'var(--color-brand-stone)', fontSize: '0.65rem' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr
                  key={booking.id}
                  style={{
                    borderTop: i > 0 ? '1px solid #F0EDE8' : 'none',
                  }}
                >
                  {/* Guest */}
                  <td className="px-4 py-3">
                    <p
                      className="font-sans text-sm font-medium"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {booking.name}
                    </p>
                    <p className="text-caption">{booking.email}</p>
                  </td>

                  {/* Experience */}
                  <td className="px-4 py-3">
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {booking.experience_type?.replace(/_/g, ' ')}
                    </p>
                  </td>

                  {/* Preferred date */}
                  <td className="px-4 py-3">
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {new Date(booking.preferred_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </td>

                  {/* Group size */}
                  <td className="px-4 py-3">
                    <p
                      className="font-sans text-sm text-center"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {booking.group_size}
                    </p>
                  </td>

                  {/* Submitted */}
                  <td className="px-4 py-3">
                    <p className="text-caption">
                      {new Date(booking.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className="text-label px-2 py-1 rounded"
                      style={{
                        fontSize: '0.6rem',
                        backgroundColor: statusBg[booking.status],
                        color: statusColors[booking.status],
                      }}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-label transition-colors"
                      style={{ color: 'var(--color-brand-burgundy)', fontSize: '0.65rem' }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
