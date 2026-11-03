// src/components/ui/DateFilterCalendar.tsx
'use client'

import { fig } from '@/lib/figmaScale'
import { CalendarPanel, parseIsoDate, toIsoDate, usePopover } from './BookingPickers'

interface DateFilterCalendarProps {
  value: Date | null
  onChange: (date: Date | null) => void
  eventDates: Set<string>
}

export function DateFilterCalendar({ value, onChange, eventDates }: DateFilterCalendarProps) {
  const { open, setOpen, rootRef } = usePopover()

  return (
    <div
      ref={rootRef}
      className="relative flex h-[38px] flex-col justify-center"
      style={{ gap: fig(4) }}
    >
      <p
        className="uppercase"
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 600,
          fontSize: fig(10),
          letterSpacing: fig(1),
          color: '#a8a290',
        }}
      >
        Date
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent text-left outline-none"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 600,
          fontSize: fig(14),
          color: '#4f4542',
        }}
      >
        <span>
          {value
            ? value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Choose date'}
        </span>
        <svg
          width={fig(10)}
          height={fig(6)}
          viewBox="0 0 10 6"
          fill="none"
          className="pointer-events-none shrink-0"
          style={{ color: '#1a1d17' }}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        // Past events stay filterable, so past days are selectable here.
        <CalendarPanel
          value={value ? toIsoDate(value) : ''}
          markedDates={eventDates}
          onSelect={(iso) => {
            onChange(parseIsoDate(iso))
            setOpen(false)
          }}
          footer={
            value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
                className="cursor-pointer transition-colors hover:text-white"
                style={{
                  fontFamily: 'var(--font-hanken)',
                  fontSize: fig(12),
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                Clear date
              </button>
            )
          }
        />
      )}
    </div>
  )
}
