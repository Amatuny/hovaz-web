// src/components/admin/MarkAsReadButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MarkAsReadButtonProps {
  contactId: string
  isRead: boolean
}

export function MarkAsReadButton({ contactId, isRead: initialRead }: MarkAsReadButtonProps) {
  const [isRead, setIsRead] = useState(initialRead)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    try {
      await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !isRead }),
      })
      setIsRead(!isRead)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="font-sans text-sm px-4 py-2 rounded transition-colors"
      style={{
        backgroundColor: isRead ? '#F5F1E8' : '#FFF8F0',
        color: isRead ? 'var(--color-brand-stone)' : 'var(--color-brand-gold)',
        border: `1px solid ${isRead ? '#E5E0D8' : '#B8924A40'}`,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : isRead ? 'Mark as unread' : 'Mark as read'}
    </button>
  )
}
