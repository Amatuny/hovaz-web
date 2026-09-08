import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How HOVAZ Wine Rooms collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="pt-32 pb-16" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-content">
          <p className="text-label mb-3" style={{ color: 'var(--color-brand-gold)' }}>
            Legal
          </p>
          <h1 className="heading-display">Privacy Policy</h1>
        </div>
      </div>

      <div className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container-content max-w-prose mx-auto flex flex-col gap-6">
          <p className="text-body" style={{ color: 'var(--color-brand-stone)' }}>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          <p className="text-body">
            This page outlines how HOVAZ Wine Rooms collects, uses, and protects information you
            share with us — through bookings, contact forms, our newsletter, and general use of this
            website.
          </p>

          <h2 className="heading-card" style={{ fontSize: '1.3rem' }}>
            Information we collect
          </h2>
          <p className="text-body">
            When you make a booking, send a contact inquiry, or subscribe to our newsletter, we
            collect the details you provide — such as your name, email address, phone number, and
            the content of your message. We also collect standard analytics data about how visitors
            use our site.
          </p>

          <h2 className="heading-card" style={{ fontSize: '1.3rem' }}>
            How we use your information
          </h2>
          <p className="text-body">
            We use this information to respond to inquiries, confirm bookings, send newsletter
            updates you&apos;ve opted into, and improve our website and experiences. We do not sell
            your information to third parties.
          </p>

          <h2 className="heading-card" style={{ fontSize: '1.3rem' }}>
            Your choices
          </h2>
          <p className="text-body">
            You can unsubscribe from our newsletter at any time using the link in any email we send,
            or by contacting us directly. To request access to, or deletion of, your personal data,
            get in touch via our{' '}
            <a href="/contact/form" style={{ color: 'var(--color-brand-burgundy)' }}>
              contact form
            </a>
            .
          </p>

          <h2 className="heading-card" style={{ fontSize: '1.3rem' }}>
            Contact
          </h2>
          <p className="text-body">
            Questions about this policy can be sent to us through our{' '}
            <a href="/contact/form" style={{ color: 'var(--color-brand-burgundy)' }}>
              contact form
            </a>
            .
          </p>

          <p className="text-caption mt-4" style={{ color: 'var(--color-brand-stone)' }}>
            This is a placeholder policy pending full legal review.
          </p>
        </div>
      </div>
    </>
  )
}
