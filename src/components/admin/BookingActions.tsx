'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingActionsProps {
  bookingId: string
  currentStatus: string
  guestName: string
  guestEmail: string
}

export function BookingActions({
  bookingId,
  currentStatus,
  guestName,
  guestEmail,
}: BookingActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [status, setStatus] = useState(currentStatus)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  async function updateStatus(newStatus: string) {
    setLoading(newStatus)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to update status')
      }

      // Update local status immediately — don't wait for router.refresh()
      setStatus(newStatus)
      setMessage({
        type: 'success',
        text: `Booking ${newStatus} successfully.${
          newStatus === 'confirmed' || newStatus === 'cancelled' ? ' Guest notified by email.' : ''
        }`,
      })
      router.refresh()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Something went wrong',
      })
    } finally {
      setLoading(null)
    }
  }

  const actions = [
    {
      status: 'confirmed',
      label: 'Confirm Booking',
      color: '#2D6A4F',
      bg: '#F0F7F4',
      show: status === 'pending',
    },
    {
      status: 'cancelled',
      label: 'Cancel Booking',
      color: '#dc2626',
      bg: '#FFF0F0',
      show: status === 'pending', // ← only show cancel when pending
    },
    {
      status: 'completed',
      label: 'Mark Completed',
      color: '#6B7280',
      bg: '#F5F5F5',
      show: status === 'confirmed',
    },
  ].filter((a) => a.show)

  if (actions.length === 0) {
    return (
      <div
        className="rounded p-6"
        style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
      >
        <p className="text-caption" style={{ color: 'var(--color-brand-stone)' }}>
          No actions available for {status} bookings.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded p-6" style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}>
      <h2 className="font-serif text-lg mb-2" style={{ color: 'var(--color-brand-charcoal)' }}>
        Actions
      </h2>
      <p className="text-caption mb-4" style={{ color: 'var(--color-brand-stone)' }}>
        Guest will be notified by email when confirmed or cancelled.
      </p>

      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <button
            key={action.status}
            onClick={() => updateStatus(action.status)}
            disabled={loading !== null}
            className="font-sans text-sm px-5 py-2.5 rounded transition-opacity"
            style={{
              backgroundColor: action.bg,
              color: action.color,
              border: `1px solid ${action.color}40`,
              opacity: loading !== null ? 0.6 : 1,
              cursor: loading !== null ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {loading === action.status ? 'Updating...' : action.label}
          </button>
        ))}
      </div>

      {message && (
        <div
          className="mt-4 p-3 rounded"
          style={{
            backgroundColor: message.type === 'success' ? '#F0F7F4' : '#FFF0F0',
            border: `1px solid ${message.type === 'success' ? '#2D6A4F' : '#dc2626'}40`,
          }}
        >
          <p
            className="font-sans text-sm"
            style={{ color: message.type === 'success' ? '#2D6A4F' : '#dc2626' }}
          >
            {message.text}
          </p>
        </div>
      )}
    </div>
  )
}
