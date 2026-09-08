export const locales = ['en', 'hy', 'ru'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeCookieName = 'NEXT_LOCALE'

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  hy: 'HY',
  ru: 'RU',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
