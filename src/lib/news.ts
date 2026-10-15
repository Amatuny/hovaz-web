// src/lib/news.ts
// Shared formatting for the News & Awards page.
import type { NewsItem } from '@/types/sanity'

const CATEGORY_LABELS: Record<NonNullable<NewsItem['category']>, string> = {
  award: 'Award',
  press: 'Feature',
  brand_news: 'News',
  release: 'Release',
  event: 'Event',
}

export function newsCategoryLabel(item: NewsItem) {
  return item.category ? CATEGORY_LABELS[item.category] : 'News'
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
