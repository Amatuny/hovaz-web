// src/components/sections/CancelReservation.tsx
// The /booking/cancel page body: intro + cancellation policy on the left,
// the find-and-cancel card on the right.
import Link from 'next/link'
import { fig } from '@/lib/figmaScale'
import { Ornament } from '@/components/ui/Ornament'
import { CancelBookingForm } from '@/components/ui/CancelBookingForm'

const INK = '#1a1d17'
const BODY = '#4f4542'

const POLICY = [
  { when: 'More than 24 hours before', outcome: 'Full refund' },
  { when: 'Less than 24 hours', outcome: 'No refund' },
]

export function CancelReservation() {
  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div
        className="container-content flex flex-col items-center"
        style={{ gap: fig(82), paddingBlock: fig(100) }}
      >
        <div
          className="flex w-full flex-wrap items-start justify-between"
          style={{ maxWidth: fig(1086), gap: fig(56) }}
        >
          {/* Intro + policy */}
          <div
            className="flex min-w-[min(300px,100%)] flex-[500_0_0] flex-col"
            style={{ maxWidth: fig(500) }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: fig(12),
                letterSpacing: fig(3),
                color: '#6b7457',
              }}
            >
              Manage Booking
            </p>
            <h1
              style={{
                marginTop: fig(16),
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: fig(60),
                lineHeight: 1.2,
                color: INK,
              }}
            >
              Cancel Reservation
            </h1>
            <p
              style={{
                marginTop: fig(16),
                maxWidth: fig(380),
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(16),
                lineHeight: fig(27.5),
                color: BODY,
              }}
            >
              No account needed. Enter the confirmation number from your booking email and the email
              address you booked with.
            </p>

            <div
              style={{
                marginTop: fig(32),
                paddingTop: fig(28),
                borderTop: '1px solid rgba(26,29,23,0.15)',
              }}
            >
              <h2
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: fig(12),
                  letterSpacing: fig(2.5),
                  color: INK,
                }}
              >
                Cancellation Policy
              </h2>
              <dl className="flex flex-col" style={{ marginTop: fig(14), gap: fig(14) }}>
                {POLICY.map((row) => (
                  <div key={row.when} className="flex items-baseline justify-between gap-4">
                    <dt
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontSize: fig(15),
                        color: BODY,
                      }}
                    >
                      {row.when}
                    </dt>
                    <dd
                      style={{
                        fontFamily: 'var(--font-hanken)',
                        fontWeight: 600,
                        fontSize: fig(15),
                        color: INK,
                      }}
                    >
                      {row.outcome}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <p
              style={{
                marginTop: fig(56),
                fontFamily: 'var(--font-hanken)',
                fontSize: fig(14),
                color: BODY,
              }}
            >
              Need to change the date instead?{' '}
              <Link
                href="/contact/form"
                className="border-b border-current font-semibold transition-colors hover:text-[var(--color-brand-gold)]"
                style={{ color: INK }}
              >
                Contact us
              </Link>{' '}
              — we&apos;ll move it for free.
            </p>
          </div>

          {/* Find / cancel card */}
          <div
            className="flex min-w-[min(320px,100%)] flex-[500_0_0]"
            style={{ maxWidth: fig(500) }}
          >
            <CancelBookingForm />
          </div>
        </div>

        <Ornament variant="symbol" />
      </div>
    </div>
  )
}
