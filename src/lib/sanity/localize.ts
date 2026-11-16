// src/lib/sanity/localize.ts
// Reads editor-managed text from Sanity in the visitor's language.
// Translatable fields store English in `<key>` and HY/RU in `<key>_i18n`
// (see the translatable() schema helper). Order of preference:
//   translation for the locale → English value → built-in default.
import type { Locale } from '@/i18n/config'

/** Any Sanity object holding translatable fields (`key` + `key_i18n`). */
export type TextSource = Record<string, unknown> | null | undefined

function isFilled(value: unknown) {
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return value != null
}

/** The value of `key` in the given locale, or undefined if not filled in. */
export function pick<T = string>(source: TextSource, key: string, locale: Locale): T | undefined {
  if (!source) return undefined
  if (locale !== 'en') {
    const translations = source[`${key}_i18n`] as Record<string, unknown> | undefined
    const translated = translations?.[locale]
    if (isFilled(translated)) return translated as T
  }
  const english = source[key]
  return isFilled(english) ? (english as T) : undefined
}

/**
 * Resolves every key of `defaults` from `source`, so components always get
 * a complete set of strings:  resolveTexts(settings.homeWines, HOME_DEFAULTS.wines, locale)
 */
export function resolveTexts<T extends Record<string, string>>(
  source: TextSource,
  defaults: T,
  locale: Locale
): T {
  const out: Record<string, string> = {}
  for (const key of Object.keys(defaults)) {
    out[key] = pick<string>(source, key, locale) ?? defaults[key]
  }
  return out as T
}

export interface ResolvedLink {
  label: string
  href: string
}

/** Links managed in Sanity (label + href), or the defaults when the list is empty. */
export function resolveLinks(
  items: TextSource[] | null | undefined,
  defaults: ResolvedLink[],
  locale: Locale
): ResolvedLink[] {
  const links = (items ?? []).flatMap((item) => {
    const label = pick<string>(item, 'label', locale)
    const href = item?.href
    return label && typeof href === 'string' && href ? [{ label, href }] : []
  })
  return links.length ? links : defaults
}
