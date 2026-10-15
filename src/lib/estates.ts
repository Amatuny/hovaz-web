// src/lib/estates.ts
import type { Estate } from '@/types/sanity'

// URL key for an estate on /estates (?estate=…), e.g. "Dilijan" → "dilijan".
export function estateKey(estate: Pick<Estate, 'name'>) {
  return estate.name.trim().toLowerCase().replace(/\s+/g, '-')
}

export function estateHref(estate: Pick<Estate, 'name'>) {
  return `/estates?estate=${estateKey(estate)}`
}
