import Image from 'next/image'
import { mfig } from '@/lib/figmaScale'

interface SectionDividerProps {
  variant?: 'vine' | 'symbol'
  className?: string
}

const VARIANTS = {
  vine: { src: '/wines/vine-divider.svg', width: 677, height: 78, maxWidth: mfig(245, 677) },
  symbol: { src: '/wines/collection-symbol.svg', width: 667, height: 83, maxWidth: mfig(245, 667) },
} as const

export function SectionDivider({ variant = 'symbol', className = '' }: SectionDividerProps) {
  const { src, width, height, maxWidth } = VARIANTS[variant]

  return (
    <div
      // Figma "symbol" frame: 100px tall (mobile), 100 × scale on desktop
      className={`flex h-[100px] items-center justify-center overflow-hidden lg:h-[calc(var(--figma-scale)*100px)] ${className}`}
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="h-auto w-full"
        style={{ maxWidth }}
      />
    </div>
  )
}
