// src/components/ui/BookingPickers.tsx
// Date and time pickers for the booking form: a field-styled trigger that
// opens an olive popover (calendar grid / scroll wheel).
'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { MdSchedule } from 'react-icons/md'
import { fig } from '@/lib/figmaScale'

const POPOVER_BG = 'linear-gradient(180deg, #535e48 0%, #465140 100%)'
const MUTED = 'rgba(255,255,255,0.55)'
const SOFT = 'rgba(255,255,255,0.12)'

const popoverStyle: React.CSSProperties = {
  background: POPOVER_BG,
  borderRadius: fig(20),
  boxShadow: '0 12px 32px rgba(26,29,23,0.25)',
  color: 'white',
  fontFamily: 'var(--font-hanken)',
  zIndex: 30,
}

// Open/close state that closes on an outside click or Escape.
export function usePopover() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return { open, setOpen, rootRef }
}

interface TriggerProps {
  id: string
  display: string
  placeholder: string
  icon: React.ReactNode
  open: boolean
  onClick: () => void
  style: React.CSSProperties
  describedBy?: string
}

function Trigger({
  id,
  display,
  placeholder,
  icon,
  open,
  onClick,
  style,
  describedBy,
}: TriggerProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-describedby={describedBy}
      className="relative w-full cursor-pointer text-left"
      style={{
        ...style,
        padding: fig(10),
        paddingRight: fig(40),
        color: display ? '#1a1d17' : '#757575',
      }}
    >
      {display || placeholder}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 flex -translate-y-1/2"
        style={{ right: fig(10), fontSize: fig(20), color: '#1a1d17' }}
      >
        {icon}
      </span>
    </button>
  )
}

// ── Date ──

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function parseIsoDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

interface CalendarPanelProps {
  value: string // YYYY-MM-DD, or '' for none
  onSelect: (value: string) => void
  // Block days before today (and months before this one).
  disablePast?: boolean
  // Days that get a gold dot, as YYYY-MM-DD.
  markedDates?: Set<string>
  footer?: React.ReactNode
}

// The olive month grid shared by every date picker on the site. Renders as an
// absolutely-positioned popover; place it inside a `relative` wrapper.
export function CalendarPanel({
  value,
  onSelect,
  disablePast = false,
  markedDates,
  footer,
}: CalendarPanelProps) {
  const labelId = useId()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [view, setView] = useState(() => {
    const base = parseIsoDate(value) ?? today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  const leading = view.getDay()
  const canGoBack =
    !disablePast ||
    view.getFullYear() > today.getFullYear() ||
    (view.getFullYear() === today.getFullYear() && view.getMonth() > today.getMonth())

  const shiftMonth = (delta: number) =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1))

  const navButton: React.CSSProperties = {
    width: fig(36),
    height: fig(36),
    borderRadius: '50%',
    backgroundColor: SOFT,
    fontSize: fig(18),
  }

  return (
    <div
      role="dialog"
      aria-labelledby={labelId}
      className="absolute left-0"
      style={{ ...popoverStyle, top: `calc(100% + ${fig(8)})`, width: fig(380), padding: fig(14) }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: fig(14) }}>
        <p
          id={labelId}
          aria-live="polite"
          style={{
            paddingInline: fig(14),
            paddingBlock: fig(7),
            borderRadius: fig(999),
            backgroundColor: SOFT,
            fontWeight: 600,
            fontSize: fig(15),
          }}
        >
          {view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="flex" style={{ gap: fig(14) }}>
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canGoBack}
            onClick={() => shiftMonth(-1)}
            className="flex cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-30"
            style={navButton}
          >
            <FiChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className="flex cursor-pointer items-center justify-center"
            style={navButton}
          >
            <FiChevronRight aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center" style={{ rowGap: fig(6) }}>
        {WEEKDAYS.map((day) => (
          <p
            key={day}
            className="uppercase"
            style={{
              paddingBottom: fig(10),
              fontWeight: 600,
              fontSize: fig(11),
              letterSpacing: fig(0.5),
              color: MUTED,
            }}
          >
            {day}
          </p>
        ))}
        {Array.from({ length: leading }, (_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = new Date(view.getFullYear(), view.getMonth(), i + 1)
          const iso = toIsoDate(day)
          const isSelected = iso === value
          const isToday = day.getTime() === today.getTime()
          const isMarked = markedDates?.has(iso) ?? false
          return (
            <div key={iso} className="flex justify-center">
              <button
                type="button"
                disabled={disablePast && day < today}
                aria-pressed={isSelected}
                aria-label={`${day.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}${isMarked ? ', has events' : ''}`}
                onClick={() => onSelect(iso)}
                className="relative flex cursor-pointer items-center justify-center transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                style={{
                  width: fig(38),
                  height: fig(38),
                  borderRadius: '50%',
                  fontSize: fig(14),
                  fontWeight: isSelected ? 600 : 400,
                  backgroundColor: isSelected ? 'white' : isToday ? SOFT : undefined,
                  color: isSelected ? '#1a1d17' : 'white',
                }}
              >
                {i + 1}
                {isMarked && !isSelected && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      bottom: fig(4),
                      width: fig(4),
                      height: fig(4),
                      backgroundColor: 'var(--color-brand-gold)',
                    }}
                  />
                )}
              </button>
            </div>
          )
        })}
      </div>

      {footer && <div style={{ marginTop: fig(10), paddingInline: fig(4) }}>{footer}</div>}
    </div>
  )
}

interface DatePickerProps {
  id: string
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  style: React.CSSProperties
  describedBy?: string
}

export function DatePicker({ id, value, onChange, style, describedBy }: DatePickerProps) {
  const { open, setOpen, rootRef } = usePopover()
  const selected = parseIsoDate(value)

  const display = selected
    ? `${String(selected.getDate()).padStart(2, '0')}/${String(selected.getMonth() + 1).padStart(2, '0')}/${selected.getFullYear()}`
    : ''

  return (
    <div ref={rootRef} className="relative">
      <Trigger
        id={id}
        display={display}
        placeholder="dd/mm/yyyy"
        icon={<FiCalendar />}
        open={open}
        onClick={() => setOpen((o) => !o)}
        style={style}
        describedBy={describedBy}
      />

      {open && (
        <CalendarPanel
          value={value}
          disablePast
          onSelect={(iso) => {
            onChange(iso)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

// ── Time ──

const ROW = 30 // Figma px per wheel row
const VISIBLE_ROWS = 5

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const PERIODS = ['AM', 'PM'] as const

function to12h(value: string) {
  const [h, m] = value.split(':').map(Number)
  return { hour: h % 12 || 12, minute: m, period: h < 12 ? 'AM' : 'PM' } as const
}

function to24h(hour: number, minute: number, period: 'AM' | 'PM') {
  const h = (hour % 12) + (period === 'PM' ? 12 : 0)
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function formatTime12h(value: string) {
  if (!value) return ''
  const { hour, minute, period } = to12h(value)
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`
}

// One scroll-snapping column; the row under the centre band is the value.
function Wheel<T extends string | number>({
  label,
  items,
  value,
  onChange,
  format,
}: {
  label: string
  items: readonly T[]
  value: T
  onChange: (value: T) => void
  format: (item: T) => string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const index = items.indexOf(value)

  // Row height in real px, read from the rendered list.
  const rowHeight = () => (ref.current?.scrollHeight ?? 0) / (items.length + VISIBLE_ROWS - 1)

  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = index * rowHeight()
    // Only align on mount; afterwards the scroll position drives the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onScroll() {
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const el = ref.current
      if (!el) return
      const next = items[Math.round(el.scrollTop / rowHeight())]
      if (next !== undefined && next !== value) onChange(next)
    }, 80)
  }

  function scrollToIndex(i: number) {
    ref.current?.scrollTo({ top: i * rowHeight(), behavior: 'smooth' })
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const next = Math.min(items.length - 1, Math.max(0, index + (e.key === 'ArrowDown' ? 1 : -1)))
    scrollToIndex(next)
  }

  return (
    <div
      ref={ref}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={index}
      aria-valuetext={format(value)}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      className="snap-y snap-mandatory overflow-y-auto outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{
        height: fig(ROW * VISIBLE_ROWS),
        paddingBlock: fig(ROW * Math.floor(VISIBLE_ROWS / 2)),
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)',
      }}
    >
      {items.map((item, i) => {
        const distance = Math.abs(i - index)
        return (
          <button
            key={String(item)}
            type="button"
            tabIndex={-1}
            onClick={() => scrollToIndex(i)}
            className="flex w-full cursor-pointer snap-center items-center justify-center transition-all"
            style={{
              height: fig(ROW),
              fontSize: distance === 0 ? fig(24) : fig(18),
              fontWeight: distance === 0 ? 600 : 400,
              color: distance === 0 ? 'white' : MUTED,
            }}
          >
            {format(item)}
          </button>
        )
      })}
    </div>
  )
}

interface TimePickerProps {
  id: string
  value: string // HH:mm, 24h
  onChange: (value: string) => void
  style: React.CSSProperties
  describedBy?: string
  defaultTime?: string
}

export function TimePicker({
  id,
  value,
  onChange,
  style,
  describedBy,
  defaultTime = '12:00',
}: TimePickerProps) {
  const { open, setOpen, rootRef } = usePopover()
  const { hour, minute, period } = to12h(value || defaultTime)

  function toggle() {
    // Opening the wheel picks its starting time, like a native picker.
    if (!open && !value) onChange(defaultTime)
    setOpen(!open)
  }

  return (
    <div ref={rootRef} className="relative">
      <Trigger
        id={id}
        display={formatTime12h(value)}
        placeholder="--:--"
        icon={<MdSchedule />}
        open={open}
        onClick={toggle}
        style={style}
        describedBy={describedBy}
      />

      {open && (
        <div
          role="dialog"
          aria-label="Choose a time"
          className="absolute left-0 grid grid-cols-3"
          style={{
            ...popoverStyle,
            top: `calc(100% + ${fig(8)})`,
            width: fig(228),
            paddingInline: fig(12),
          }}
        >
          <Wheel
            label="Hour"
            items={HOURS}
            value={hour}
            onChange={(h) => onChange(to24h(h, minute, period))}
            format={String}
          />
          <Wheel
            label="Minute"
            items={MINUTES}
            value={minute}
            onChange={(m) => onChange(to24h(hour, m, period))}
            format={(m) => String(m).padStart(2, '0')}
          />
          <Wheel
            label="AM or PM"
            items={PERIODS}
            value={period}
            onChange={(p) => onChange(to24h(hour, minute, p))}
            format={String}
          />
        </div>
      )}
    </div>
  )
}
