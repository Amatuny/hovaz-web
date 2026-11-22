// src/components/ui/SectionHead.tsx
// Figma "section-head" (wine--reserve, component 458:7322): eyebrow, title and
// optional intro paragraph, 16px apart, max 860px wide. Every homepage section
// opens with it. Sizes are the raw Figma px scaled by --figma-scale, with a
// floor so they stay readable on phones.
import { fig, mfig } from '@/lib/figmaScale'

interface SectionHeadProps {
  eyebrow?: string
  title: string
  text?: string
  as?: 'h1' | 'h2'
  /** Figma uses two title styles: SemiBold 0.5px tracking (most sections) and
   *  Medium 2px tracking in black (Events, Journal). */
  weight?: 'semibold' | 'medium'
  /** Title px at the 1900px design width — 44 by default, 52 for Events. */
  titleSize?: number
  align?: 'left' | 'center'
}

/** max(floor, Figma px × --figma-scale) */
const scaled = (px: number, floor: number) => `max(${floor}px, ${fig(px)})`

export function SectionHead({
  eyebrow,
  title,
  text,
  as: Heading = 'h2',
  weight = 'semibold',
  titleSize = 44,
  align = 'left',
}: SectionHeadProps) {
  const medium = weight === 'medium'

  return (
    <div
      className={`flex w-full flex-col ${align === 'center' ? 'items-center text-center' : ''}`}
      style={{ gap: mfig(16, 16, 12) }}
    >
      {eyebrow && (
        <p
          className="w-full uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 600,
            fontSize: mfig(12, 12, 11),
            lineHeight: 'normal',
            letterSpacing: scaled(3, 2),
            color: 'rgba(93,110,82,0.92)',
          }}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className="w-full capitalize"
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: medium ? 500 : 600,
          fontSize: mfig(32, titleSize, 28),
          letterSpacing: medium ? scaled(2, 1) : '0.5px',
          // Figma: line-height "normal" (≈1.33 for Playfair) on both the
          // eyebrow and the title — 44px title = 59px line, 52px = 69px.
          lineHeight: 'normal',
          color: medium ? '#000' : '#1a1d17',
          maxWidth: fig(860),
        }}
      >
        {title}
      </Heading>
      {text && (
        <p
          className="w-full"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 400,
            fontSize: mfig(18, 18, 15),
            lineHeight: 1.65,
            color: '#4f4542',
            maxWidth: fig(860),
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
}
