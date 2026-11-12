import type { Metadata } from 'next'
import { CancelReservation } from '@/components/sections/CancelReservation'

export const metadata: Metadata = {
  title: 'Cancel Reservation',
  description:
    'Cancel a HOVAZ tasting or tour booking with your confirmation number and booking email.',
  robots: { index: false, follow: true },
}

export default function CancelReservationPage() {
  return <CancelReservation />
}
