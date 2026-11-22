// src/components/ui/TextLink.tsx
// Figma "Button/Desktop/Text Link/Large" (863:7686): Hanken Grotesk SemiBold
// 16px, 2px tracking, forest #2e3a28, 2px underline, 8/4 padding, 8px gap,
// 15×7 arrow. Closes most homepage sections.
import Link from 'next/link'
import Image from 'next/image'

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      // Figma states: hover -> 78% opacity, pressed -> content nudged 1px down
      className="inline-flex w-fit items-center gap-2 border-b-2 border-[#2e3a28] px-2 py-1 capitalize text-[#2e3a28] transition-opacity duration-150 ease-out hover:opacity-[0.78] active:translate-y-px"
      style={{
        fontFamily: 'var(--font-hanken)',
        fontWeight: 600,
        fontSize: 'max(14px, calc(var(--figma-scale) * 16px))',
        // Figma: line-height "normal" — inheriting the body's 1.5 made it 34px tall, not 31
        lineHeight: 'normal',
        letterSpacing: 'max(1.5px, calc(var(--figma-scale) * 2px))',
      }}
    >
      {children}
      <Image src="/wines/explore-arrow.svg" alt="" aria-hidden="true" width={15} height={7} />
    </Link>
  )
}
