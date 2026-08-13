// src/app/(admin)/admin/contacts/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Contact Messages' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ filter?: string }>
}

async function getContacts(unreadOnly: boolean) {
  const supabase = createAdminClient()
  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data ?? []
}

export default async function ContactsPage({ searchParams }: Props) {
  const { filter } = await searchParams
  const unreadOnly = filter === 'unread'
  const contacts = await getContacts(unreadOnly)

  const unreadCount = contacts.filter((c) => !c.read).length

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-brand-burgundy)' }}>
            Contact Messages
          </h1>
          <p className="text-caption">
            {contacts.length} messages
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded"
        style={{ backgroundColor: '#E5E0D8', width: 'fit-content' }}
      >
        {[
          { label: 'All', value: undefined },
          { label: 'Unread', value: 'unread' },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/contacts?filter=${tab.value}` : '/admin/contacts'}
            className="px-4 py-2 rounded font-sans text-sm transition-colors"
            style={{
              backgroundColor:
                tab.value === filter || (!tab.value && !filter) ? 'white' : 'transparent',
              color:
                tab.value === filter || (!tab.value && !filter)
                  ? 'var(--color-brand-burgundy)'
                  : 'var(--color-brand-stone)',
              fontWeight: tab.value === filter || (!tab.value && !filter) ? 600 : 400,
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Messages list */}
      <div
        className="rounded overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-xl mb-2" style={{ color: 'var(--color-brand-stone)' }}>
              {unreadOnly ? 'No unread messages' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div>
            {contacts.map((contact, i) => (
              <Link
                key={contact.id}
                href={`/admin/contacts/${contact.id}`}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors block"
                style={{
                  borderTop: i > 0 ? '1px solid #F0EDE8' : 'none',
                  textDecoration: 'none',
                }}
              >
                {/* Unread indicator */}
                <div
                  className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: !contact.read ? 'var(--color-brand-burgundy)' : 'transparent',
                    border: contact.read ? '1px solid #E5E0D8' : 'none',
                  }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="font-sans text-sm"
                      style={{
                        color: 'var(--color-brand-charcoal)',
                        fontWeight: !contact.read ? 600 : 400,
                      }}
                    >
                      {contact.name}
                    </p>
                    <p className="text-caption shrink-0 ml-4">
                      {new Date(contact.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {contact.subject && (
                    <p
                      className="font-sans text-sm mb-1"
                      style={{
                        color: 'var(--color-brand-charcoal)',
                        fontWeight: !contact.read ? 500 : 400,
                      }}
                    >
                      {contact.subject}
                    </p>
                  )}
                  <p
                    className="text-caption truncate"
                    style={{ color: 'var(--color-brand-stone)' }}
                  >
                    {contact.message}
                  </p>
                </div>

                <span
                  className="text-label shrink-0"
                  style={{ color: 'var(--color-brand-burgundy)', fontSize: '0.65rem' }}
                >
                  View →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
