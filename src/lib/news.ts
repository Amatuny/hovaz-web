// src/lib/news.ts
// Shared formatting for the News & Awards page.
import type { NewsItem } from '@/types/sanity'
import { NEWS_DEFAULTS } from '@/content/defaults'

/** Category names come from News & Awards Page → Cards & Categories. */
export function newsCategoryLabel(
  item: NewsItem,
  categories: Record<string, string> = NEWS_DEFAULTS.categories
) {
  return (item.category && categories[item.category]) || categories.brand_news
}

// "Aug 2026"
export function formatNewsMonth(date?: string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function newsYear(item: NewsItem) {
  return item.date ? new Date(item.date).getUTCFullYear() : undefined
}

// "August 2026"
export function formatNewsMonthLong(date?: string) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function newsHref(item: NewsItem) {
  return `/news/${item.slug.current}`
}
