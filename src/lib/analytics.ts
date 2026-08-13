// src/lib/analytics.ts
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!window.dataLayer) return

  window.dataLayer.push({
    event: eventName,
    ...parameters,
  })
}
