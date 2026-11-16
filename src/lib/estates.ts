// src/lib/estates.ts
import type { Estate } from '@/types/sanity'

// Lowercase, punctuation-free, dash-separated: "Wine Rooms, Dilijan" → "wine-rooms-dilijan".
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

// URL key for an estate on /estates (?estate=…), e.g. "Wine Rooms, Dilijan" → "wine-rooms-dilijan".
export function estateKey(estate: Pick<Estate, 'name'>) {
  return slugify(estate.name)
}

export function estateHref(estate: Pick<Estate, 'name'>) {
  return `/estates?estate=${estateKey(estate)}`
}

/**
 * Finds the estate a `?estate=` value points to. Accepts the full key
 * ("wine-rooms-dilijan") or any part of the name ("dilijan", "proshyan"),
 * so hand-written links in Sanity and the footer keep working if an estate
 * is renamed.
 */
export function findEstate<T extends Pick<Estate, 'name'>>(
  estates: T[],
  key: string | null | undefined
): T | undefined {
  if (!key) return undefined
  const wanted = slugify(key)
  if (!wanted) return undefined

  const exact = estates.find((e) => estateKey(e) === wanted)
  if (exact) return exact

  const wantedWords = wanted.split('-')
  return estates.find((e) => {
    const words = estateKey(e).split('-')
    return wantedWords.every((w) => words.includes(w))
  })
}
