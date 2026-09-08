'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { setLocale } from '@/i18n/actions'
import { locales, localeLabels, type Locale } from '@/i18n/config'

export function LanguageSwitcher() {
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
