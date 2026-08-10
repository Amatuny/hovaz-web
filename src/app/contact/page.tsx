// src/app/contact/form/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactFormPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // API connection in Phase 5
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-24"
        style={{ backgroundColor: 'var(--color-brand-cream)' }}
      >
        <div className="container-content text-center max-w-narrow mx-auto">
          <p className="font-serif text-6xl mb-6" style={{ color: 'var(--color-brand-gold)' }}>
            ✓
          </p>
          <h1 className="heading-section mb-4">Message Sent</h1>
          <p className="text-body mb-8" style={{ color: 'var(--color-brand-stone)' }}>
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Get in touch
          </p>
          <h1 className="heading-display">Contact Us</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-narrow mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-field" htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label-field" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                placeholder="+374 77 000 000"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="input-field"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="textarea-field"
                placeholder="Tell us more..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-caption text-center" style={{ color: 'var(--color-brand-stone)' }}>
              We respond within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
