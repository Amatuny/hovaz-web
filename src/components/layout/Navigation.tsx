// src/components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavigationProps {
  settings: {
    siteName?: string
  } | null
}

const navLinks = [
  { label: 'Wines', href: '/wines' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about/our-story' },
  { label: 'News', href: '/news/awards' },
  { label: 'Journal', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Navigation({ settings }: NavigationProps) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change (reset during render, not in an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  const isHeroPage = pathname === '/'

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-400
        ${
          scrolled || menuOpen || !isHeroPage
            ? 'bg-brand-cream/95 backdrop-blur-sm shadow-sm'
            : 'bg-transparent'
        }
      `}
      style={{
        backgroundColor:
          scrolled || menuOpen || !isHeroPage
            ? 'color-mix(in srgb, var(--color-brand-cream) 95%, transparent)'
            : 'transparent',
      }}
    >
      <div className="container-content">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl tracking-widest"
            style={{
              color: scrolled || !isHeroPage ? 'var(--color-brand-burgundy)' : 'white',
            }}
          >
            HOVAZ
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname.startsWith(link.href) ? 'nav-link-active' : ''}`}
                style={{
                  color:
                    scrolled || !isHeroPage
                      ? undefined
                      : pathname.startsWith(link.href)
                        ? 'white'
                        : 'rgba(255,255,255,0.8)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side — language + CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language switcher — Phase 2 (Armenian) and Phase 3 (Russian) */}
            <button
              className="text-label"
              style={{ color: scrolled || !isHeroPage ? undefined : 'rgba(255,255,255,0.7)' }}
            >
              EN
            </button>

            <Link
              href="/events"
              className="btn-primary"
              style={
                !scrolled && isHeroPage
                  ? {
                      backgroundColor: 'transparent',
                      border: '1px solid white',
                      color: 'white',
                    }
                  : {}
              }
            >
              Reserve
            </Link>
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
                backgroundColor:
                  scrolled || !isHeroPage || menuOpen ? 'var(--color-brand-charcoal)' : 'white',
                transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor:
                  scrolled || !isHeroPage || menuOpen ? 'var(--color-brand-charcoal)' : 'white',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-all duration-300"
              style={{
                backgroundColor:
                  scrolled || !isHeroPage || menuOpen ? 'var(--color-brand-charcoal)' : 'white',
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
                className={`nav-link ${pathname.startsWith(link.href) ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider-cream pt-2">
              <Link href="/events" className="btn-primary w-full text-center mt-4">
                Reserve an Experience
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
