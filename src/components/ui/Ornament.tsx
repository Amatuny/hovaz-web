// src/components/ui/Ornament.tsx
// Figma's 100px-tall decorative divider row (vine or collection symbol), scaled by --figma-scale.
import Image from 'next/image'
import { fig } from '@/lib/figmaScale'

const ORNAMENTS = {
  vine: { src: '/wines/vine-divider.svg', width: 677.469, height: 78 },
  symbol: { src: '/wines/collection-symbol.svg', width: 666.622, height: 83.3614 },
} as const

export function Ornament({ variant }: { variant: keyof typeof ORNAMENTS }) {
  const { src, width, height } = ORNAMENTS[variant]
  return (
    <div className="flex items-center justify-center overflow-hidden" style={{ height: fig(100) }}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ width: fig(width), height: fig(height) }}
      />
    </div>
  )
}
