import Link from 'next/link'
import { WineCard } from '@/components/ui/WineCard'
import type { Wine } from '@/types/sanity'
import { DragScroll } from '@/components/ui/DragScroll'

interface WinePreviewProps {
  wines: Wine[]
}

export function WinePreview({ wines }: WinePreviewProps) {
  if (!wines?.length) return null

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-content">
        <p
          className="mb-2 uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: '10px',
            letterSpacing: '1.5px',
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          The Cellar
        </p>
        <h2
          className="mb-3 capitalize"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 600,
            fontSize: '26px',
            color: '#1a1d17',
            letterSpacing: '0.3px',
            lineHeight: 1.15,
          }}
        >
          Wines of the Valley
        </h2>
        <p
          className="mb-10 max-w-xl"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#4f4542',
          }}
        >
          Estate-grown across Vayots Dzor, Aragatsotn and the Ararat Valley — small lots, made
          slowly.
        </p>

        <DragScroll className="flex gap-4 pb-2 snap-x snap-mandatory">
          {wines.map((wine) => (
            <div key={wine._id} className="shrink-0 snap-start" style={{ width: '250px' }}>
              <WineCard wine={wine} />
            </div>
          ))}
        </DragScroll>

        <div className="mt-8">
          <Link
            href="/wines"
            className="group inline-flex items-center gap-2"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: '14px', color: '#1a1d17' }}
          >
            <span
              className="border-b pb-1 transition-colors group-hover:text-[var(--color-brand-gold)]"
              style={{ borderColor: 'currentColor' }}
            >
              Explore The Cellar
            </span>
            <span
              aria-hidden="true"
              className="transition-colors group-hover:text-[var(--color-brand-gold)]"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
