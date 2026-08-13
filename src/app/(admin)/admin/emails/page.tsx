// src/app/(admin)/admin/emails/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Email Logs' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ status?: string }>
}

const EMAIL_STATUSES = ['sent', 'failed', 'bounced'] as const
type EmailStatus = (typeof EMAIL_STATUSES)[number]

function isEmailStatus(value: string | undefined): value is EmailStatus {
  return EMAIL_STATUSES.includes(value as EmailStatus)
}

async function getEmailLogs(status?: EmailStatus) {
  const supabase = createAdminClient()
  let query = supabase
    .from('email_logs')
    .select(
      `
      *,
      booking:booking_id (
        id, name, experience_type
      ),
      contact:contact_id (
        id, name, subject
      )
    `
    )
    .order('sent_at', { ascending: false })
    .limit(100)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

const statusColors: Record<string, string> = {
  sent: '#2D6A4F',
  failed: '#dc2626',
  bounced: '#B8924A',
}

const statusBg: Record<string, string> = {
  sent: '#F0F7F4',
  failed: '#FFF0F0',
  bounced: '#FFF8F0',
}

const typeLabels: Record<string, string> = {
  booking_admin_notification: 'Booking — Admin',
  booking_user_confirmation: 'Booking — Guest',
  booking_status_update: 'Booking — Status Update',
  contact_admin_notification: 'Contact — Admin',
  contact_user_confirmation: 'Contact — Guest',
}

export default async function EmailLogsPage({ searchParams }: Props) {
  const { status } = await searchParams
  const activeStatus = isEmailStatus(status) ? status : 'all'
  const logs = await getEmailLogs(isEmailStatus(status) ? status : undefined)

  const failedCount = logs.filter((l) => l.status === 'failed').length
  const bouncedCount = logs.filter((l) => l.status === 'bounced').length

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Sent', value: 'sent' },
    { label: `Failed${failedCount > 0 ? ` (${failedCount})` : ''}`, value: 'failed' },
    { label: `Bounced${bouncedCount > 0 ? ` (${bouncedCount})` : ''}`, value: 'bounced' },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
          Email Logs
        </h1>
        <p className="text-caption">
          {logs.length} emails
          {failedCount > 0 && <span style={{ color: '#dc2626' }}> · {failedCount} failed</span>}
          {bouncedCount > 0 && <span style={{ color: '#B8924A' }}> · {bouncedCount} bounced</span>}
        </p>
      </div>

      {/* Alert for failures */}
      {failedCount > 0 && activeStatus !== 'failed' && (
        <div
          className="flex items-center justify-between p-4 rounded mb-6"
          style={{
            backgroundColor: '#FFF0F0',
            border: '1px solid #dc262640',
          }}
        >
          <p className="font-sans text-sm" style={{ color: '#dc2626' }}>
            ⚠️ {failedCount} email{failedCount > 1 ? 's' : ''} failed to deliver
          </p>
          <Link
            href="/admin/emails?status=failed"
            className="font-sans text-sm"
            style={{ color: '#dc2626', textDecoration: 'underline' }}
          >
            View failed →
          </Link>
        </div>
      )}

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded"
        style={{ backgroundColor: '#E5E0D8', width: 'fit-content' }}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === 'all' ? '/admin/emails' : `/admin/emails?status=${tab.value}`}
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

      {/* Logs table */}
      <div
        className="rounded overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl mb-2" style={{ color: 'var(--color-brand-stone)' }}>
              No email logs found
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F5F1E8' }}>
                {['Type', 'Recipient', 'Related to', 'Status', 'Sent', 'Resend ID'].map((h) => (
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
              {logs.map((log, i) => (
                <tr
                  key={log.id}
                  style={{
                    borderTop: i > 0 ? '1px solid #F0EDE8' : 'none',
                    backgroundColor: log.status === 'failed' ? '#FFFAFA' : 'white',
                  }}
                >
                  {/* Type */}
                  <td className="px-4 py-3">
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--color-brand-charcoal)' }}
                    >
                      {typeLabels[log.type] ?? log.type?.replace(/_/g, ' ')}
                    </p>
                  </td>

                  {/* Recipient */}
                  <td className="px-4 py-3">
                    <p className="text-caption">{log.recipient}</p>
                  </td>

                  {/* Related to */}
                  <td className="px-4 py-3">
                    {log.booking ? (
                      <Link
                        href={`/admin/bookings/${log.booking_id}`}
                        className="text-caption transition-colors"
                        style={{ color: 'var(--color-brand-burgundy)' }}
                      >
                        {log.booking.name} — {log.booking.experience_type?.replace(/_/g, ' ')}
                      </Link>
                    ) : log.contact ? (
                      <Link
                        href={`/admin/contacts/${log.contact_id}`}
                        className="text-caption transition-colors"
                        style={{ color: 'var(--color-brand-burgundy)' }}
                      >
                        {log.contact.name} — {log.contact.subject ?? 'No subject'}
                      </Link>
                    ) : (
                      <span className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
                        —
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div>
                      <span
                        className="text-label px-2 py-1 rounded"
                        style={{
                          fontSize: '0.6rem',
                          backgroundColor: statusBg[log.status] ?? '#F5F5F5',
                          color: statusColors[log.status] ?? '#6B7280',
                        }}
                      >
                        {log.status}
                      </span>
                      {log.error && (
                        <p
                          className="text-caption mt-1"
                          style={{ color: '#dc2626', fontSize: '0.65rem', maxWidth: '160px' }}
                        >
                          {log.error}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Sent at */}
                  <td className="px-4 py-3">
                    <p className="text-caption">
                      {new Date(log.sent_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>

                  {/* Resend ID */}
                  <td className="px-4 py-3">
                    {log.resend_id ? (
                      <p
                        className="font-mono text-xs truncate"
                        style={{
                          color: 'var(--color-brand-stone)',
                          maxWidth: '120px',
                        }}
                        title={log.resend_id}
                      >
                        {log.resend_id}
                      </p>
                    ) : (
                      <span className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
                        —
                      </span>
                    )}
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
