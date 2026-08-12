// src/app/(admin)/admin/contacts/page.tsx
import { getContactSubmissions } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Contacts',
}

export default async function ContactsPage() {
  const contacts = await getContactSubmissions()

  return (
    <div className="p-8">
      <h1 className="heading-section mb-8">Contact Submissions</h1>

      <div className="flex flex-col gap-4">
        {contacts.map((c) => (
          <div key={c.id} className="p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-body" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {c.name}
                </p>
                <p className="text-caption">
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ''}
                </p>
              </div>
              <p className="text-caption">{c.read ? 'Read' : 'Unread'}</p>
            </div>
            {c.subject && <p className="text-caption mb-2">Subject: {c.subject}</p>}
            <p className="text-body" style={{ fontSize: '0.9rem' }}>
              {c.message}
            </p>
            <p className="text-caption mt-3">{new Date(c.created_at).toLocaleString()}</p>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-caption">No submissions yet.</p>}
      </div>
    </div>
  )
}
