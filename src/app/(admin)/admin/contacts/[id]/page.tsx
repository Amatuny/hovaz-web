// src/app/(admin)/admin/contacts/[id]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { MarkAsReadButton } from '@/components/admin/MarkAsReadButton'

export const metadata: Metadata = { title: 'Contact Message' }
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

async function getContact(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

async function markAsRead(id: string) {
  const supabase = createAdminClient()
  await supabase.from('contact_submissions').update({ read: true }).eq('id', id)
}

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params
  const contact = await getContact(id)

  if (!contact) notFound()

  // Auto mark as read when opened
  if (!contact.read) {
    await markAsRead(id)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/contacts"
          className="text-caption transition-colors"
          style={{ color: 'var(--color-brand-stone)' }}
        >
          ← Messages
        </Link>
        <span style={{ color: 'var(--color-brand-stone)' }}>/</span>
        <span className="text-caption" style={{ color: 'var(--color-brand-charcoal)' }}>
          {contact.name}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
            {contact.subject ?? 'No subject'}
          </h1>
          <p className="text-caption">
            From {contact.name} ·{' '}
            {new Date(contact.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <MarkAsReadButton contactId={id} isRead={contact.read} />
      </div>

      {/* Sender info */}
      <div
        className="rounded p-6 mb-4"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brand-charcoal)' }}>
          Sender
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Name', value: contact.name },
            { label: 'Email', value: contact.email, href: 'mailto:' + contact.email },
            ...(contact.phone
              ? [{ label: 'Phone', value: contact.phone, href: 'tel:' + contact.phone }]
              : []),
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-3"
              style={{ borderBottom: '1px solid #F0EDE8' }}
            >
              <p className="text-label" style={{ color: 'var(--color-brand-stone)' }}>
                {item.label}
              </p>
              {'href' in item && item.href ? (
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

      {/* Message */}
      <div
        className="rounded p-6 mb-4"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <h2 className="font-serif text-lg mb-4" style={{ color: 'var(--color-brand-charcoal)' }}>
          Message
        </h2>
        <p
          className="font-sans text-sm"
          style={{
            color: 'var(--color-brand-charcoal)',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
          }}
        >
          {contact.message}
        </p>
      </div>

      {/* Quick reply */}
      <div
        className="rounded p-6"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <h2 className="font-serif text-lg mb-3" style={{ color: 'var(--color-brand-charcoal)' }}>
          Quick Reply
        </h2>
        <a
          href={
            'mailto:' +
            contact.email +
            '?subject=Re: ' +
            (contact.subject ?? 'Your message to HOVAZ')
          }
          className="btn-primary inline-flex"
          style={{ textDecoration: 'none' }}
        >
          Reply via Email
        </a>
        <p className="text-caption mt-3" style={{ color: 'var(--color-brand-stone)' }}>
          Opens your email client with the sender pre-filled.
        </p>
      </div>
    </div>
  )
}
