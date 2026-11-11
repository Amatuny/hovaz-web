// src/components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { fig } from '@/lib/figmaScale'

interface NavigationProps {
  settings: {
    siteName?: string
  } | null
}

interface NavLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

export function Navigation({ settings }: NavigationProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  const [estatesOpen, setEstatesOpen] = useState(false)
  const estatesRef = useRef<HTMLDivElement>(null)

  const navLinks: NavLink[] = [
    {
      label: t('twoLocations'),
      href: '/estates',
      children: [
        { label: t('proshyan'), href: '/estates?estate=proshyan' },
        { label: t('dilijan'), href: '/estates?estate=dilijan' },
      ],
    },
    { label: t('events'), href: '/events' },
    { label: t('ourWines'), href: '/wines' },
    { label: t('ourStory'), href: '/about/our-story' },
    { label: t('newsAwards'), href: '/news' },
    { label: t('contactUs'), href: '/contact/form' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the estates dropdown on outside click or Escape
  useEffect(() => {
    if (!estatesOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!estatesRef.current?.contains(e.target as Node)) setEstatesOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEstatesOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [estatesOpen])

  // Close menus on route change (reset during render, not in an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
    setEstatesOpen(false)
  }

  const linkClass = (href: string) =>
    `header-nav-link ${pathname.startsWith(href) ? 'header-nav-link-active' : ''}`

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        <div className="relative flex items-center justify-between py-3 min-[1200px]:min-h-22 min-[1200px]:py-4">
          {/*
            Logo: in normal flow on mobile (shares the row with the menu button),
            but absolutely positioned on desktop — matching Figma, where the logo
            is layered on top of the header rather than a flex sibling. That
            matters because the nav+language row below needs to center itself
            across the FULL width; if the logo stayed in-flow it would eat into
            that centering math and skew every link slightly right of where
            Figma places it.
          */}
          <Link
            href="/"
            className="shrink-0 min-[1200px]:absolute min-[1200px]:left-0 min-[1200px]:top-1/2 min-[1200px]:z-10 min-[1200px]:-translate-y-1/2"
          >
            <Image
              src="/logo.png"
              alt="Hovaz"
              width={101}
              height={120}
              className="h-16 w-auto min-[1200px]:h-22"
              priority
            />
          </Link>

          {/* Desktop nav + language — full-width row, unaffected by the logo's footprint */}
          <div className="hidden w-full items-center justify-between gap-4 min-[1200px]:flex">
            <div className="flex flex-1 items-center justify-center">
              <nav className="flex items-center" style={{ gap: fig(50) }}>
                {navLinks.map((link) =>
                  link.children ? (
                    <div
                      key={link.href}
                      ref={estatesRef}
                      className="relative"
                      onMouseEnter={() => setEstatesOpen(true)}
                      onMouseLeave={() => setEstatesOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => setEstatesOpen((open) => !open)}
                        aria-expanded={estatesOpen}
                        aria-haspopup="true"
                        className={`${linkClass(link.href)} inline-flex items-center gap-1.5`}
                      >
                        {link.label}
                        <svg
                          width="8"
                          height="5"
                          viewBox="0 0 8 5"
                          fill="none"
                          aria-hidden="true"
                          className={`transition-transform duration-200 ${estatesOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </button>
                      {/* pt-4 (not mt-4) keeps the gap inside the hover area,
                          so the menu stays open while the pointer moves down */}
                      {estatesOpen && (
                        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                          <div className="flex flex-col divide-y divide-black/15 rounded-xl bg-white px-4 py-1 shadow-lg">
                            {link.children.map((child) => (
                              <div key={child.href} className="px-3 py-4">
                                <Link
                                  href={child.href}
                                  onClick={() => setEstatesOpen(false)}
                                  className="header-nav-link text-[13px] normal-case tracking-[0.5px]"
                                >
                                  {child.label}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </div>

            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            className="min-[1200px]:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-brand-charcoal)',
                transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-brand-charcoal)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-brand-charcoal)',
                transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="min-[1200px]:hidden border-t"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-brand-stone) 20%, transparent)',
            backgroundColor: 'var(--color-brand-cream)',
          }}
        >
          <div className="container-content py-6 flex flex-col gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="flex flex-col gap-4">
                  <span className={`${linkClass(link.href)} self-start`}>{link.label}</span>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMenuOpen(false)}
                      className="header-nav-link self-start pl-4"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              )
            )}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
