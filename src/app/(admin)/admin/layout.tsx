// src/app/(admin)/admin/layout.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/supabase/actions/auth'

export const metadata = {
  title: { default: 'Admin', template: '%s — HOVAZ Admin' },
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '◈' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📋' },
  { label: 'Contacts', href: '/admin/contacts', icon: '✉️' },
  { label: 'Email Logs', href: '/admin/emails', icon: '📨' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8F7F5' }}>
      {/* Sidebar */}
      <aside
        className="w-64 min-h-screen flex flex-col"
        style={{ backgroundColor: 'var(--color-brand-dark)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/admin/dashboard">
            <p className="font-serif text-xl tracking-widest" style={{ color: 'white' }}>
              HOVAZ
            </p>
            <p
              className="text-label mt-1"
              style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}
            >
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <span>{item.icon}</span>
                <span className="font-sans text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-caption mb-3 px-4 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {user.email}
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 font-sans text-sm transition-colors rounded"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
