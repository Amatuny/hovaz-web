// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="w-full" style={{ maxWidth: '400px', padding: '0 1.5rem' }}>
        {/* Logo */}
        <div className="text-center mb-10">
          <p
            className="font-serif text-4xl tracking-widest mb-2"
            style={{ color: 'var(--color-brand-burgundy)' }}
          >
            HOVAZ
          </p>
          <p className="text-label" style={{ color: 'var(--color-brand-stone)' }}>
            Admin Access
          </p>
        </div>

        {/* Form */}
        <div className="p-8" style={{ backgroundColor: 'white' }}>
          <h1 className="font-serif text-2xl mb-6" style={{ color: 'var(--color-brand-charcoal)' }}>
            Sign In
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <label className="label-field" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="input-field"
                placeholder="admin@hovazwines.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="input-field"
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="p-3 text-center"
                style={{
                  backgroundColor: '#FFF0F0',
                  border: '1px solid #dc2626',
                }}
              >
                <p className="text-caption" style={{ color: '#dc2626' }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-caption text-center mt-6" style={{ color: 'var(--color-brand-stone)' }}>
          HOVAZ Wine Rooms · Admin Panel
        </p>
      </div>
    </div>
  )
}
