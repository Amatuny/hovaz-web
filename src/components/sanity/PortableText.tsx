import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityBlock, SanityImage } from '@/types/sanity'

interface PortableTextProps {
  value: SanityBlock[]
}

const components = {
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string; caption?: string } }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption
              className="text-caption text-center mt-3"
              style={{ color: 'var(--color-brand-stone)' }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode
      value?: { href?: string; blank?: boolean }
    }) => {
      const href = value?.href ?? '#'
      const isExternal = href.startsWith('http')
      const opensNewTab = value?.blank === true || isExternal
      return (
        <a
          href={href}
          target={opensNewTab ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{ color: 'var(--color-brand-burgundy)' }}
        >
          {children}
        </a>
      )
    },
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600, color: 'var(--color-brand-charcoal)' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-body mb-4" style={{ lineHeight: '1.8' }}>
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2
        className="font-serif text-2xl mt-10 mb-4"
        style={{ color: 'var(--color-brand-burgundy)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-serif text-xl mt-8 mb-3" style={{ color: 'var(--color-brand-charcoal)' }}>
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="font-serif text-lg mt-6 mb-2" style={{ color: 'var(--color-brand-charcoal)' }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote
        className="font-serif text-xl italic my-8 pl-6"
        style={{
          borderLeft: '2px solid var(--color-brand-gold)',
          color: 'var(--color-brand-burgundy)',
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 space-y-1" style={{ listStyle: 'disc inside' }}>
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 space-y-1" style={{ listStyle: 'decimal inside' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-body" style={{ fontSize: '1rem' }}>
        {children}
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="text-body" style={{ fontSize: '1rem' }}>
        {children}
      </li>
    ),
  },
}

export function PortableText({ value }: PortableTextProps) {
  if (!value?.length) return null
  return (
    <div className="prose-hovaz">
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
