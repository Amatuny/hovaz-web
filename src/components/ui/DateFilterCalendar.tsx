// src/components/ui/DateFilterCalendar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { fig } from '@/lib/figmaScale'

interface DateFilterCalendarProps {
  value: Date | null
  onChange: (date: Date | null) => void
  eventDates: Set<string>
}

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Monday-first 6x7 grid covering the given month, including the leading/
// trailing days from the adjacent months needed to fill each week.
function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1)
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7 // 0 = Monday
  const gridStart = new Date(year, month, 1 - firstWeekday)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return d
  })
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" style={{ color: '#4f4542' }}>
      <path
        d={direction === 'left' ? 'M6 1L1 6L6 11' : 'M1 1L6 6L1 11'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DateFilterCalendar({ value, onChange, eventDates }: DateFilterCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => value ?? new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const grid = getMonthGrid(year, month)
  const today = new Date()

  return (
    <div
      ref={containerRef}
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
        onClick={() => setIsOpen((v) => !v)}
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

      {isOpen && (
        <div
          className="absolute left-0 top-full z-20 mt-2 w-[280px] rounded-2xl bg-white p-4"
          style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-[#f5f1e8]"
            >
              <ChevronIcon direction="left" />
            </button>
            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontSize: '14px',
                color: '#1a1d17',
              }}
            >
              {viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="flex size-7 items-center justify-center rounded-full transition-colors hover:bg-[#f5f1e8]"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="flex items-center justify-center"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 600,
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                  color: '#a8a290',
                  height: '24px',
                }}
              >
                {label}
              </div>
            ))}

            {grid.map((day) => {
              const inMonth = day.getMonth() === month
              const isSelected = value ? isSameDay(day, value) : false
              const isToday = isSameDay(day, today)
              const hasEvent = eventDates.has(toISODate(day))

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={!inMonth}
                  onClick={() => {
                    onChange(day)
                    setIsOpen(false)
                  }}
                  className="relative flex items-center justify-center rounded-full transition-colors disabled:cursor-default"
                  style={{
                    height: '28px',
                    fontFamily: 'var(--font-hanken)',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '12px',
                    color: !inMonth ? 'transparent' : isSelected ? '#fdfcf8' : '#1a1d17',
                    backgroundColor: isSelected ? 'var(--color-brand-olive)' : 'transparent',
                    border:
                      isToday && !isSelected
                        ? '1px solid var(--color-brand-olive)'
                        : '1px solid transparent',
                  }}
                >
                  {day.getDate()}
                  {hasEvent && !isSelected && inMonth && (
                    <span
                      className="absolute bottom-[3px] left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: '3px',
                        height: '3px',
                        backgroundColor: 'var(--color-brand-gold)',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className="mt-3 transition-colors hover:text-[var(--color-brand-olive)]"
              style={{ fontFamily: 'var(--font-hanken)', fontSize: '11px', color: '#a8a290' }}
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  )
}
