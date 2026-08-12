// src/app/(admin)/admin/bookings/page.tsx
import { getBookings } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Bookings',
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div className="p-8">
      <h1 className="heading-section mb-8">Bookings</h1>

      <div className="overflow-x-auto" style={{ backgroundColor: 'white' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="divider-cream">
              <th className="text-label text-left p-4">Name</th>
              <th className="text-label text-left p-4">Contact</th>
              <th className="text-label text-left p-4">Experience</th>
              <th className="text-label text-left p-4">Group Size</th>
              <th className="text-label text-left p-4">Preferred Date</th>
              <th className="text-label text-left p-4">Status</th>
              <th className="text-label text-left p-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="divider-cream">
                <td className="text-body p-4" style={{ fontSize: '0.9rem' }}>
                  {b.name}
                </td>
                <td className="text-caption p-4">
                  <div>{b.email}</div>
                  <div>{b.phone}</div>
                </td>
                <td className="text-caption p-4 capitalize">
                  {b.experience_type.replace(/_/g, ' ')}
                </td>
                <td className="text-caption p-4">{b.group_size}</td>
                <td className="text-caption p-4">
                  {new Date(b.preferred_date).toLocaleDateString()}
                </td>
                <td className="text-caption p-4 capitalize">{b.status}</td>
                <td className="text-caption p-4">{new Date(b.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-caption p-4">No bookings yet.</p>}
      </div>
    </div>
  )
}
