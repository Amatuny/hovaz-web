// src/app/(admin)/admin/dashboard/page.tsx
import { getBookings, getContactSubmissions, getEmailLogs } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const [bookings, contacts, emailLogs] = await Promise.all([
    getBookings(),
    getContactSubmissions(),
    getEmailLogs(),
  ])

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const unreadContacts = contacts.filter((c) => !c.read).length
  const failedEmails = emailLogs.filter(
    (e) => e.status === 'failed' || e.status === 'bounced'
  ).length

  const stats = [
    { label: 'Total Bookings', value: bookings.length },
    { label: 'Pending Bookings', value: pendingBookings },
    { label: 'Unread Contacts', value: unreadContacts },
    { label: 'Failed Emails', value: failedEmails },
  ]

  return (
    <div className="p-8">
      <h1 className="heading-section mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6" style={{ backgroundColor: 'white' }}>
            <p className="text-label mb-2">{stat.label}</p>
            <p className="heading-card">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6" style={{ backgroundColor: 'white' }}>
          <p className="text-label mb-4">Recent Bookings</p>
          <div className="flex flex-col gap-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex justify-between items-center divider-cream pt-3">
                <div>
                  <p className="text-body" style={{ fontSize: '0.9rem' }}>
                    {b.name}
                  </p>
                  <p className="text-caption">{b.experience_type.replace(/_/g, ' ')}</p>
                </div>
                <p className="text-caption capitalize">{b.status}</p>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-caption">No bookings yet.</p>}
          </div>
        </div>

        <div className="p-6" style={{ backgroundColor: 'white' }}>
          <p className="text-label mb-4">Recent Contact Submissions</p>
          <div className="flex flex-col gap-3">
            {contacts.slice(0, 5).map((c) => (
              <div key={c.id} className="flex justify-between items-center divider-cream pt-3">
                <div>
                  <p className="text-body" style={{ fontSize: '0.9rem' }}>
                    {c.name}
                  </p>
                  <p className="text-caption">{c.subject || c.email}</p>
                </div>
                <p className="text-caption">{c.read ? 'Read' : 'Unread'}</p>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-caption">No submissions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
