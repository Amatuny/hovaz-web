import { NewsletterForm } from '@/components/ui/NewsletterForm'

function OrnamentDivider() {
  return (
    <svg
      viewBox="0 0 400 40"
      className="mx-auto"
      style={{ width: '260px', height: '26px', color: 'var(--color-brand-burgundy)' }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <line x1="8" y1="20" x2="150" y2="20" />
      <line x1="250" y1="20" x2="392" y2="20" />
      <rect
        x="4"
        y="16"
        width="8"
        height="8"
        transform="rotate(45 8 20)"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="388"
        y="16"
        width="8"
        height="8"
        transform="rotate(45 392 20)"
        fill="currentColor"
        stroke="none"
      />
      <circle cx="200" cy="20" r="18" />
      <path d="M200 8c4 4 4 8 0 12c-4-4-4-8 0-12z" fill="currentColor" stroke="none" />
      <path d="M200 32c4-4 4-8 0-12c-4 4-4 8 0 12z" fill="currentColor" stroke="none" />
      <path d="M188 20c4-4 8-4 12 0c-4 4-8 4-12 0z" fill="currentColor" stroke="none" />
      <path d="M212 20c-4-4-8-4-12 0c4 4 8 4 12 0z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function NewsletterSection() {
  return (
    <section className="section-padding-sm" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <div
          className="rounded-2xl px-6 py-16 text-center lg:rounded-3xl"
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-brand-forest) 8%, var(--color-brand-cream))',
          }}
        >
          <p className="text-label mb-4" style={{ color: 'var(--color-brand-stone)' }}>
            Stay Close
          </p>
          <h2
            className="mb-3 font-serif"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: 'var(--color-brand-forest)',
            }}
          >
            Letters From The Forest
          </h2>
          <p
            className="mx-auto mb-8 max-w-sm text-sm"
            style={{ color: 'var(--color-brand-stone)' }}
          >
            Upcoming evenings, new releases, and notes from the cellar — a few times a season.
          </p>

          <div className="mx-auto" style={{ maxWidth: '370px' }}>
            <NewsletterForm source="homepage" />
          </div>
        </div>
      </div>

      <div className="mt-14">
        <OrnamentDivider />
      </div>
    </section>
  )
}
