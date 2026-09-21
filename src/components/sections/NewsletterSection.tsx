import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { SectionDivider } from '@/components/ui/SectionDivider'

export function NewsletterSection() {
  return (
    <>
      <section
        className="section-padding-sm"
        style={{ backgroundColor: 'var(--color-brand-cream)' }}
      >
        <div className="container-content">
          <div
            className="rounded-2xl px-6 py-16 text-center lg:rounded-3xl"
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--color-brand-forest) 8%, var(--color-brand-cream))',
            }}
          >
            <p
              className="mb-4 uppercase"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: '10px',
                letterSpacing: '1.5px',
                color: 'rgba(93,110,82,0.92)',
              }}
            >
              Stay Close
            </p>
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                color: 'var(--color-brand-forest)',
              }}
            >
              Letters From The Forest
            </h2>
            <p
              className="mx-auto mb-8 max-w-sm"
              style={{
                fontFamily: 'var(--font-hanken)',
                fontSize: '14px',
                color: 'var(--color-brand-stone)',
              }}
            >
              Upcoming evenings, new releases, and notes from the cellar — a few times a season.
            </p>

            <div className="mx-auto" style={{ maxWidth: '370px' }}>
              <NewsletterForm source="homepage" />
            </div>
          </div>
        </div>
      </section>
      <SectionDivider variant="symbol" className="pb-8 lg:pb-11" />
    </>
  )
}
