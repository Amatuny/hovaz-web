import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { fig } from '@/lib/figmaScale'
import { HOME_DEFAULTS } from '@/content/defaults'

interface NewsletterSectionProps {
  texts?: typeof HOME_DEFAULTS.newsletter
}

// Figma "subscribe" (3179:4918): #f0ede2 card, radius 24, 387px tall, holding
// a centred 516px column (36px side padding) — header, then the form 32px below.
export function NewsletterSection({ texts = HOME_DEFAULTS.newsletter }: NewsletterSectionProps) {
  return (
    <section className="section-padding-sm" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            minHeight: `max(320px, ${fig(387)})`,
            borderRadius: `max(16px, ${fig(24)})`,
            backgroundColor: '#f0ede2',
          }}
        >
          <div
            className="flex w-full flex-col items-center py-12 text-center"
            style={{ maxWidth: '516px', paddingInline: '36px', gap: '32px' }}
          >
            <div className="flex w-full flex-col" style={{ gap: '16px' }}>
              <p
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '3px',
                  color: 'rgba(93,110,82,0.92)',
                }}
              >
                {texts.eyebrow}
              </p>
              <h2
                className="capitalize"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 500,
                  fontSize: 'max(28px, calc(var(--figma-scale) * 34px))',
                  letterSpacing: '2px',
                  color: '#3d4a38',
                }}
              >
                {texts.heading}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: '16px',
                  letterSpacing: '0.5px',
                  color: '#4f4542',
                }}
              >
                {texts.text}
              </p>
            </div>

            <div className="w-full">
              <NewsletterForm
                source="homepage"
                placeholder={texts.placeholder}
                buttonText={texts.buttonText}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
