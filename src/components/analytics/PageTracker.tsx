// src/components/analytics/PageTracker.tsx
'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface PageTrackerProps {
  eventName: string
  parameters?: Record<string, unknown>
}

export function PageTracker({ eventName, parameters }: PageTrackerProps) {
  useEffect(() => {
    trackEvent(eventName, parameters)
  }, [eventName, parameters])

  return null
}
