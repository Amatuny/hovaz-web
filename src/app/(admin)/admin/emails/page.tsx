// src/app/(admin)/admin/emails/page.tsx
import { getEmailLogs } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Email Logs',
}

export default async function EmailsPage() {
  const emailLogs = await getEmailLogs()

  return (
    <div className="p-8">
      <h1 className="heading-section mb-8">Email Logs</h1>

      <div className="overflow-x-auto" style={{ backgroundColor: 'white' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="divider-cream">
              <th className="text-label text-left p-4">Recipient</th>
              <th className="text-label text-left p-4">Type</th>
              <th className="text-label text-left p-4">Subject</th>
              <th className="text-label text-left p-4">Status</th>
              <th className="text-label text-left p-4">Sent</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map((e) => (
              <tr key={e.id} className="divider-cream">
                <td className="text-body p-4" style={{ fontSize: '0.9rem' }}>
                  {e.recipient}
                </td>
                <td className="text-caption p-4 capitalize">{e.type.replace(/_/g, ' ')}</td>
                <td className="text-caption p-4">{e.subject || '—'}</td>
                <td className="text-caption p-4 capitalize">
                  {e.status}
                  {e.error && <div style={{ color: '#dc2626' }}>{e.error}</div>}
                </td>
                <td className="text-caption p-4">{new Date(e.sent_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {emailLogs.length === 0 && <p className="text-caption p-4">No email logs yet.</p>}
      </div>
    </div>
  )
}
