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

// News items have no detail page yet, so only items pointing at an external
// article are linked.
export function newsHref(item: NewsItem) {
  return item.externalUrl || null
}
