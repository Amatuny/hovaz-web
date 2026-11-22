'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { setLocale } from '@/i18n/actions'
import { locales, localeLabels, type Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  // 'header' (default): plain text links in the nav bar.
  // 'pill': segmented pill on a dark background, used in the footer.
  variant?: 'header' | 'pill'
}

export function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const activeLocale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSelect(locale: Locale) {
    if (locale === activeLocale || isPending) return
    startTransition(async () => {
      await setLocale(locale)
      router.refresh()
    })
  }

  if (variant === 'pill') {
    return (
      <div
        // Figma footer switcher (3577:10748): 4px padding and gap, 12/7px
        // buttons — all × --figma-scale like the rest of the footer
        className="inline-flex items-center rounded-full"
        style={{
          backgroundColor: 'rgba(242,237,221,0.06)',
          padding: 'calc(var(--fs, 1) * 4px)',
          gap: 'calc(var(--fs, 1) * 4px)',
        }}
        aria-label="Language"
      >
        {locales.map((locale) => {
          const isActive = locale === activeLocale
          return (
            <button
              key={locale}
              type="button"
              onClick={() => handleSelect(locale)}
              disabled={isPending}
              aria-current={isActive}
              className={`rounded-full uppercase transition-colors disabled:cursor-wait ${
                isActive ? 'bg-[#f2eddd] text-[#1a1d17]' : 'text-[#f2eddd] hover:text-white'
              }`}
              style={{
                paddingInline: 'calc(var(--fs, 1) * 12px)',
                paddingBlock: 'calc(var(--fs, 1) * 7px)',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: 'calc(var(--fs, 1) * 11px)',
                letterSpacing: '1px',
                lineHeight: 'normal',
              }}
            >
              {localeLabels[locale]}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2" aria-label="Language">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => handleSelect(locale)}
          disabled={isPending}
          aria-current={locale === activeLocale}
          className="header-lang-link disabled:cursor-wait"
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  )
}
