// src/components/layout/AgeGate.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { fig } from '@/lib/figmaScale'

import { AGE_COOKIE } from '@/lib/ageGate'
const ONE_YEAR = 60 * 60 * 24 * 365

// Back-office pages are for staff, not visitors.
const EXCLUDED_PATHS = ['/studio', '/admin', '/login']

interface AgeGateProps {
  // Read from the cookie on the server, so verified visitors never see a flash.
  verified: boolean
  imageUrl?: string
  imageAlt?: string
}

export function AgeGate({ verified, imageUrl, imageAlt }: AgeGateProps) {
  const t = useTranslations('AgeGate')
  const pathname = usePathname()
  const [open, setOpen] = useState(!verified)
  const [declined, setDeclined] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const excluded = EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const visible = open && !excluded

  useEffect(() => {
    if (!visible) return
    const card = cardRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    card?.querySelector<HTMLElement>('[data-autofocus]')?.focus()

    // Keep Tab inside the card; there's deliberately no Escape to dismiss.
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !card) return
      const items = Array.from(card.querySelectorAll<HTMLElement>('button'))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  if (!visible) return null

  function confirm() {
    document.cookie = `${AGE_COOKIE}=1; max-age=${ONE_YEAR}; path=/; SameSite=Lax`
    setOpen(false)
  }

  const buttonBase: React.CSSProperties = {
    height: 'max(44px, calc(var(--figma-scale) * 48px))',
    paddingInline: 'max(20px, calc(var(--figma-scale) * 32px))',
    fontFamily: 'var(--font-hanken)',
    fontWeight: 500,
    fontSize: 'max(14px, calc(var(--figma-scale) * 16px))',
    letterSpacing: 'max(0.5px, calc(var(--figma-scale) * 1px))',
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto px-4 py-6"
      style={{ backgroundColor: 'rgba(20,19,15,0.92)', backdropFilter: 'blur(6px)' }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-message"
        className="flex w-full flex-col overflow-hidden md:flex-row"
        style={{
          maxWidth: 'max(340px, min(100%, calc(var(--figma-scale) * 1100px)))',
          borderRadius: 'max(16px, calc(var(--figma-scale) * 24px))',
          backgroundColor: '#f8f5ec',
          boxShadow: '0px 24px 80px rgba(0,0,0,0.45)',
        }}
      >
        {/* Photo with the tagline — compact strip on phones, left column on desktop */}
        <div className="relative h-40 shrink-0 bg-[#2e3a28] sm:h-52 md:h-auto md:w-[41%]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageAlt ?? ''}
              fill
              priority
              sizes="(min-width: 768px) 460px, 100vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%)' }}
          />
          <p
            className="absolute text-white"
            style={{
              left: 'max(18px, calc(var(--figma-scale) * 28px))',
              bottom: 'max(16px, calc(var(--figma-scale) * 36px))',
              fontFamily: 'var(--font-playfair)',
              fontSize: 'max(15px, calc(var(--figma-scale) * 18px))',
            }}
          >
            {t('tagline')}
          </p>
        </div>

        {/* Question */}
        <div
          className="flex flex-1 flex-col justify-center"
          style={{
            paddingBlock: 'max(28px, calc(var(--figma-scale) * 88px))',
            paddingInline: 'max(22px, calc(var(--figma-scale) * 46px))',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 500,
              fontSize: 'max(20px, calc(var(--figma-scale) * 24px))',
              letterSpacing: 'max(4px, calc(var(--figma-scale) * 6px))',
              color: '#1a1d17',
            }}
          >
            HOVAZ
          </p>
          <p
            className="uppercase"
            style={{
              marginTop: 'max(18px, calc(var(--figma-scale) * 36px))',
              fontFamily: 'var(--font-hanken)',
              fontWeight: 500,
              fontSize: 'max(10px, calc(var(--figma-scale) * 11px))',
              letterSpacing: 'max(1.5px, calc(var(--figma-scale) * 2px))',
              color: '#7c8a5c',
            }}
          >
            {t('eyebrow')}
          </p>
          <h2
            id="age-gate-title"
            style={{
              marginTop: fig(8),
              fontFamily: 'var(--font-playfair)',
              fontWeight: 600,
              fontSize: 'max(24px, calc(var(--figma-scale) * 32px))',
              lineHeight: 1.2,
              color: '#1a1d17',
            }}
          >
            {t('title')}
          </h2>
          <p
            id="age-gate-message"
            role={declined ? 'alert' : undefined}
            style={{
              marginTop: 'max(10px, calc(var(--figma-scale) * 12px))',
              fontFamily: 'var(--font-hanken)',
              fontSize: 'max(13px, calc(var(--figma-scale) * 14px))',
              lineHeight: 1.6,
              color: declined ? '#8f1d1d' : '#4f4542',
            }}
          >
            {declined ? t('declined') : t('message')}
          </p>
          <div
            className="flex flex-col sm:flex-row"
            style={{
              marginTop: 'max(22px, calc(var(--figma-scale) * 28px))',
              gap: 'max(10px, calc(var(--figma-scale) * 18px))',
            }}
          >
            <button
              type="button"
              onClick={confirm}
              data-autofocus
              className="flex-1 cursor-pointer rounded-full text-white transition-colors hover:bg-[#1f281b]"
              style={{ ...buttonBase, backgroundColor: '#2e3a28' }}
            >
              {t('confirm')}
            </button>
            <button
              type="button"
              onClick={() => setDeclined(true)}
              className="flex-1 cursor-pointer rounded-full transition-colors hover:bg-black/5"
              style={{ ...buttonBase, border: '1px solid #1a1d17', color: '#1a1d17' }}
            >
              {t('decline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
