// src/components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

interface NavigationProps {
  settings: {
    siteName?: string
  } | null
}

export function Navigation({ settings }: NavigationProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  const navLinks = [
    { label: t('events'), href: '/events' },
    { label: t('experiences'), href: '/events/whats-on' },
    { label: t('ourWines'), href: '/wines' },
    { label: t('ourStory'), href: '/about/our-story' },
    { label: t('newsAwards'), href: '/news/awards' },
    { label: t('contactUs'), href: '/contact/form' },
    { label: t('twoEstates'), href: '#' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change (reset during render, not in an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Hovaz"
              width={101}
              height={120}
              className="h-16 w-auto lg:h-22"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <nav className="flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`header-nav-link ${link.href !== '#' && pathname.startsWith(link.href) ? 'header-nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:block shrink-0">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
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
          className="lg:hidden border-t"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-brand-stone) 20%, transparent)',
            backgroundColor: 'var(--color-brand-cream)',
          }}
        >
          <div className="container-content py-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`header-nav-link ${link.href !== '#' && pathname.startsWith(link.href) ? 'header-nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
