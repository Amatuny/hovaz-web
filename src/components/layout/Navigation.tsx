// src/components/layout/Navigation.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Fragment, useState, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { fig } from '@/lib/figmaScale'
import type { NavSubItem, SiteSettings } from '@/types/sanity'

interface NavigationProps {
  settings: Pick<SiteSettings, 'navigation'> | null
}

interface NavLink {
  key: string
  label: string
  // Optional for dropdown parents — the button then only opens the menu.
  href?: string
  children?: { label: string; href: string }[]
}

export function Navigation({ settings }: NavigationProps) {
  const t = useTranslations('Navigation')
  const locale = useLocale() as 'en' | 'hy' | 'ru'
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  // href of the dropdown currently open (any item with children), or null
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Translated label for the current locale, falling back to English.
  const localize = (item: NavSubItem) =>
    (locale !== 'en' && item.label_i18n?.[locale]) || item.label || ''

  // Menu managed in Sanity (Site Settings → Navigation). Items missing a
  // label, or with neither a link nor dropdown items, are skipped so a
  // half-filled entry can't break the header.
  const sanityLinks: NavLink[] = (settings?.navigation ?? []).flatMap((item) => {
    const children = (item.children ?? [])
      .filter((child) => child.label && child.href)
      .map((child) => ({ label: localize(child), href: child.href! }))
    if (!item.label || (!item.href && !children.length)) return []
    return [
      {
        key: item._key,
        label: localize(item),
        ...(item.href ? { href: item.href } : {}),
        ...(children.length ? { children } : {}),
      },
    ]
  })

  // Built-in default menu, used until the navigation is filled in Sanity.
  const defaultLinks: NavLink[] = [
    {
      key: 'estates',
      label: t('twoLocations'),
      href: '/estates',
      children: [
        { label: t('proshyan'), href: '/estates?estate=proshyan' },
        { label: t('dilijan'), href: '/estates?estate=dilijan' },
      ],
    },
    { key: 'events', label: t('events'), href: '/events' },
    { key: 'wines', label: t('ourWines'), href: '/wines' },
    { key: 'story', label: t('ourStory'), href: '/about/our-story' },
    { key: 'news', label: t('newsAwards'), href: '/news' },
    { key: 'contact', label: t('contactUs'), href: '/contact/form' },
  ]

  const navLinks = sanityLinks.length ? sanityLinks : defaultLinks
  const isWineDetail = /^\/wines\/[^/]+/.test(pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the open dropdown on outside click or Escape
  useEffect(() => {
    if (!openDropdown) return
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpenDropdown(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openDropdown])

  // Close menus on route change (reset during render, not in an effect)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
    setOpenDropdown(null)
  }

  // Editors may enter "/" or links with query strings, so compare paths only
  // and don't let "/" mark every page active.
  const isActive = (href: string) => {
    const path = href.split(/[?#]/)[0] || '/'
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  const linkClass = (href: string) =>
    `header-nav-link ${isActive(href) ? 'header-nav-link-active' : ''}`

  // A dropdown parent is highlighted when its own link or any child is active.
  const parentClass = (link: NavLink) => {
    const active =
      (link.href && isActive(link.href)) || link.children?.some((c) => isActive(c.href))
    return `header-nav-link ${active ? 'header-nav-link-active' : ''}`
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}
      style={{ backgroundColor: 'var(--color-brand-cream)' }}
    >
      <div className="container-content">
        {/* Desktop header: 128px tall, 120px on a wine detail page (handoff §1) */}
        <div
          // Mobile Figma: 78px tall; desktop 128 (120 on a wine detail page)
          className={`relative flex h-[78px] items-center justify-between ${
            isWineDetail ? 'min-[1200px]:h-[120px]' : 'min-[1200px]:h-[128px]'
          }`}
        >
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
              className="h-14 w-auto min-[1200px]:h-22"
              priority
            />
          </Link>

          {/* Desktop nav + language — full-width row, unaffected by the logo's footprint */}
          <div className="hidden w-full items-center justify-between gap-4 min-[1200px]:flex">
            <div className="flex flex-1 items-center justify-center">
              <nav className="flex items-center" style={{ gap: fig(48) }}>
                {navLinks.map((link) => {
                  const isOpen = openDropdown === link.key
                  return link.children ? (
                    <div
                      key={link.key}
                      ref={isOpen ? dropdownRef : undefined}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(link.key)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : link.key)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        className={`${parentClass(link)} inline-flex items-center gap-1.5`}
                      >
                        {link.label}
                        <svg
                          width="8"
                          height="5"
                          viewBox="0 0 8 5"
                          fill="none"
                          aria-hidden="true"
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </button>
                      {/* pt-4 (not mt-4) keeps the gap inside the hover area,
                          so the menu stays open while the pointer moves down */}
                      {isOpen && (
                        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4">
                          {/* Figma "estates-dropdown" (3462:4714): 260px, white,
                              1px black/10 border, radius 8, 16px padding, shadow
                              0 8 24 black/12; options 12px apart with a 1px
                              #d8d6d5 rule between them. Options: 15px Hanken
                              Regular, 1.6px tracking, 12px padding, radius 8.
                              Hover → cream #f2eddd; pressed → forest #2e3a28,
                              white text. */}
                          {/* Scaled by --figma-scale like the nav links above it, so
                              it keeps the design's proportions below 1900px. */}
                          <div
                            className="flex flex-col rounded-lg border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                            style={{ width: fig(260), padding: fig(16), gap: fig(12) }}
                          >
                            {link.children.map((child, i) => (
                              <Fragment key={child.href}>
                                {i > 0 && <div aria-hidden="true" className="h-px bg-[#d8d6d5]" />}
                                <Link
                                  href={child.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="rounded-lg text-black transition-colors duration-[120ms] ease-out hover:bg-[#f2eddd] active:bg-[#2e3a28] active:text-white"
                                  style={{
                                    padding: fig(12),
                                    fontFamily: 'var(--font-hanken)',
                                    fontWeight: 400,
                                    fontSize: `max(12px, ${fig(15)})`,
                                    lineHeight: 1.33,
                                    letterSpacing: fig(1.6),
                                  }}
                                >
                                  {child.label}
                                </Link>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : link.href ? (
                    <Link key={link.key} href={link.href} className={linkClass(link.href)}>
                      {link.label}
                    </Link>
                  ) : null
                })}
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
                <div key={link.key} className="flex flex-col gap-4">
                  <span className={`${parentClass(link)} self-start`}>{link.label}</span>
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
              ) : link.href ? (
                <Link key={link.key} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ) : null
            )}
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  )
}
