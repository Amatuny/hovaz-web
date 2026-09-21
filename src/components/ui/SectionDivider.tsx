import Image from 'next/image'

interface SectionDividerProps {
  variant?: 'vine' | 'symbol'
  className?: string
}

const VARIANTS = {
  vine: { src: '/wines/vine-divider.svg', width: 677, height: 78, maxWidth: '420px' },
  symbol: { src: '/wines/collection-symbol.svg', width: 667, height: 83, maxWidth: '380px' },
} as const

export function SectionDivider({ variant = 'symbol', className = '' }: SectionDividerProps) {
  const { src, width, height, maxWidth } = VARIANTS[variant]

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
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
