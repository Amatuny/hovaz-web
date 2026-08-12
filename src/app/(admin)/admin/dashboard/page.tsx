// src/app/(admin)/admin/dashboard/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const supabase = createAdminClient()

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: confirmedBookings },
    { count: totalContacts },
    { count: unreadContacts },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('read', false),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    totalBookings: totalBookings ?? 0,
    pendingBookings: pendingBookings ?? 0,
    confirmedBookings: confirmedBookings ?? 0,
    totalContacts: totalContacts ?? 0,
    unreadContacts: unreadContacts ?? 0,
    recentBookings: recentBookings ?? [],
  }
}

const statusColors: Record<string, string> = {
  pending: '#B8924A',
  confirmed: '#2D6A4F',
  cancelled: '#dc2626',
  completed: '#6B7280',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      href: '/admin/bookings?status=pending',
      urgent: stats.pendingBookings > 0,
      bg: '#FFF8F0',
      color: '#B8924A',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      href: '/admin/bookings',
      urgent: false,
      bg: '#F5F1E8',
      color: '#6B1F2A',
    },
    {
      label: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      href: '/admin/bookings?status=confirmed',
      urgent: false,
      bg: '#F0F7F4',
      color: '#2D6A4F',
    },
    {
      label: 'Unread Messages',
      value: stats.unreadContacts,
      href: '/admin/contacts',
      urgent: stats.unreadContacts > 0,
      bg: '#FFF0F0',
      color: '#dc2626',
    },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
          Dashboard
        </h1>
        <p className="text-caption">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="block p-6 rounded transition-shadow hover:shadow-md"
            style={{
              backgroundColor: card.bg,
              border: card.urgent ? `2px solid ${card.color}` : '2px solid transparent',
            }}
          >
            <p className="font-serif text-4xl mb-2" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-label" style={{ color: card.color }}>
              {card.label}
            </p>
            {card.urgent && card.value > 0 && (
              <p className="text-caption mt-2" style={{ color: card.color }}>
                Needs attention →
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="rounded" style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}>
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #E5E0D8' }}
        >
          <h2 className="font-serif text-xl" style={{ color: 'var(--color-brand-charcoal)' }}>
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-label transition-colors"
            style={{ color: 'var(--color-brand-burgundy)' }}
          >
            View all →
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-caption">No bookings yet</p>
          </div>
        ) : (
          <div>
            {stats.recentBookings.map((booking, i) => (
              <Link
                key={booking.id}
                href={`/admin/bookings?id=${booking.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                style={{
                  borderBottom: i < stats.recentBookings.length - 1 ? '1px solid #F0EDE8' : 'none',
                }}
              >
                <div>
                  <p
                    className="font-sans text-sm font-medium mb-1"
                    style={{ color: 'var(--color-brand-charcoal)' }}
                  >
                    {booking.name}
                  </p>
                  <p className="text-caption">
                    {booking.experience_type?.replace(/_/g, ' ')} · {booking.group_size} guests ·{' '}
                    {new Date(booking.preferred_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="text-label px-2 py-1 rounded"
                    style={{
                      fontSize: '0.6rem',
                      backgroundColor: `${statusColors[booking.status]}20`,
                      color: statusColors[booking.status],
                    }}
                  >
                    {statusLabels[booking.status]}
                  </span>
                  <p className="text-caption">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
