// src/components/ui/DarkPanel.tsx
// Shared pieces of the dark #231814 story panels on the homepage (Figma "about
// Us" and "Hovaz" sections): the coral label, the body text and the faint
// emblem watermark that hangs off the panel's right edge.
import Image from 'next/image'
import { mfig } from '@/lib/figmaScale'

/** Figma: Inter SemiBold 14px, 1.4px tracking, coral #e5987d */
export const darkPanelLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: mfig(14, 14, 12),
  letterSpacing: mfig(1.4, 1.4),
  color: '#e5987d',
}

/** Figma: Hanken Grotesk 18/28, 0.5px tracking, #f1eeeb */
export const darkPanelTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontWeight: 400,
  fontSize: mfig(18, 18, 15),
  lineHeight: 1.556,
  letterSpacing: '0.5px',
  color: '#f1eeeb',
}

/** Emblem watermark — the SVG is white at 2% opacity, flipped vertically as in
 *  Figma, positioned by the same insets relative to the panel's content box. */
export function DarkPanelEmblem({ src, inset }: { src: string; inset: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{ inset, transform: 'scaleY(-1)' }}
    >
      <Image src={src} alt="" fill unoptimized />
    </div>
  )
}
