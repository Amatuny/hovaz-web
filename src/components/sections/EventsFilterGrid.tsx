// src/components/sections/EventsFilterGrid.tsx
'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { EventCard, type EventCardData } from '@/components/ui/EventCard'
import { DateFilterCalendar } from '@/components/ui/DateFilterCalendar'
import { fig } from '@/lib/figmaScale'
import type { Event } from '@/types/sanity'

interface EventsFilterGridProps {
  events: Event[]
}

const PAGE_SIZE = 16

function formatEventDate(startDate?: string) {
  if (!startDate) return null
  const date = new Date(startDate)
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${day} · ${time}`
}

function isEventPast(status?: string, startDate?: string) {
  if (status === 'completed') return true
  return !!startDate && new Date(startDate).getTime() < Date.now()
}

function toEventCardData(event: Event): EventCardData {
  return {
    href: `/events/${event.slug.current}`,
    title: event.title,
    description: event.description,
    image: event.mainImage,
    badgeLabel: event.estate?.name ?? event.location,
    badgeKey: event.estate?._id ?? event.location,
    tags: event.tags?.length
      ? event.tags
      : event.eventType
        ? [event.eventType.replace(/_/g, ' ')]
        : undefined,
    dateLabel: formatEventDate(event.startDate),
    isPast: isEventPast(event.status, event.startDate),
  }
}

function SearchIcon() {
  return (
    <svg
      width={fig(20.5)}
      height={fig(20.5)}
      viewBox="0 0 20.5 20.5"
      fill="none"
      className="shrink-0"
      style={{ color: '#4f4542' }}
    >
      <path
        d="M19.25 19.25L14.9 14.9M17.25 9.25C17.25 13.6683 13.6683 17.25 9.25 17.25C4.83172 17.25 1.25 13.6683 1.25 9.25C1.25 4.83172 4.83172 1.25 9.25 1.25C13.6683 1.25 17.25 4.83172 17.25 9.25Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
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
  )
}

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col justify-center" style={{ height: fig(38), gap: fig(4) }}>
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
        {label}
      </p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: fig(14),
            color: '#4f4542',
            paddingRight: fig(20),
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
          <ChevronIcon />
        </span>
      </div>
    </div>
  )
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        width: fig(40),
        height: fig(40),
        backgroundColor: active ? 'var(--color-brand-olive)' : 'white',
        color: active ? '#fdfcf8' : '#1a1d17',
        boxShadow: active ? 'none' : '0px 1px 1px 0px rgba(0,0,0,0.08)',
        fontFamily: 'var(--font-hanken)',
        fontWeight: 600,
        fontSize: fig(14),
      }}
    >
      {children}
    </button>
  )
}

export function EventsFilterGrid({ events }: EventsFilterGridProps) {
  const [searchInput, setSearchInput] = useState('')
  const [dateInput, setDateInput] = useState<Date | null>(null)
  const [locationInput, setLocationInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedDate, setAppliedDate] = useState<Date | null>(null)
  const [appliedLocation, setAppliedLocation] = useState('')
  const [page, setPage] = useState(1)

  const eventDates = useMemo(() => {
    const dates = new Set<string>()
    events.forEach((event) => {
      if (!event.startDate) return
      const d = new Date(event.startDate)
      dates.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      )
    })
    return dates
  }, [events])

  const locationOptions = useMemo(() => {
    const locations = new Set<string>()
    events.forEach((event) => {
      const location = event.estate?.name ?? event.location
      if (location) locations.add(location)
    })
    return Array.from(locations)
  }, [events])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (appliedSearch && !event.title.toLowerCase().includes(appliedSearch.toLowerCase())) {
        return false
      }
      if (appliedDate) {
        if (!event.startDate) return false
        const eventDate = new Date(event.startDate)
        const sameDay =
          eventDate.getFullYear() === appliedDate.getFullYear() &&
          eventDate.getMonth() === appliedDate.getMonth() &&
          eventDate.getDate() === appliedDate.getDate()
        if (!sameDay) return false
      }
      if (appliedLocation) {
        const location = event.estate?.name ?? event.location
        if (location !== appliedLocation) return false
      }
      return true
    })
  }, [events, appliedSearch, appliedDate, appliedLocation])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageEvents = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setAppliedSearch(searchInput)
    setAppliedDate(dateInput)
    setAppliedLocation(locationInput)
    setPage(1)
  }

  return (
    <div className="flex flex-col" style={{ gap: fig(48) }}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center bg-white"
        style={{
          gap: fig(16),
          borderRadius: fig(20),
          paddingInline: fig(24),
          paddingBlock: fig(20),
          boxShadow: '0px 1px 1px 0px rgba(0,0,0,0.05)',
        }}
      >
        <div
          className="flex min-w-[240px] flex-[2] items-center border-r"
          style={{ height: fig(38), gap: fig(10), paddingInline: fig(12), borderColor: '#e6e1d2' }}
        >
          <SearchIcon />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search events"
            className="w-full bg-transparent outline-none placeholder:text-[#757575]"
            style={{ fontFamily: 'var(--font-hanken)', fontSize: fig(15), color: '#1a1d17' }}
          />
        </div>

        <div
          className="min-w-[200px] flex-1 border-r"
          style={{ paddingInline: fig(12), borderColor: '#e6e1d2' }}
        >
          <DateFilterCalendar value={dateInput} onChange={setDateInput} eventDates={eventDates} />
        </div>

        <div className="min-w-[200px] flex-1" style={{ paddingInline: fig(12) }}>
          <FilterSelect
            label="Location"
            placeholder="Choose location"
            options={locationOptions}
            value={locationInput}
            onChange={setLocationInput}
          />
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-full capitalize transition-colors hover:bg-[var(--color-brand-olive)] hover:text-[#fdfcf8]"
          style={{
            borderWidth: '1.5px',
            borderStyle: 'solid',
            borderColor: 'var(--color-brand-olive)',
            paddingInline: fig(64),
            paddingBlock: fig(12),
            fontFamily: 'var(--font-hanken)',
            fontWeight: 600,
            fontSize: fig(16),
            letterSpacing: fig(2),
            color: 'var(--color-brand-olive)',
          }}
        >
          Search
        </button>
      </form>

      {/* Figma insets the "All Events" grid an extra 112px on each side beyond
          the search bar/pagination edges (first card at x=112 of a 1600-wide
          frame, last card ending at x=1488) — the grid is narrower than the
          rest of the section, not full width. */}
      {pageEvents.length === 0 ? (
        <p
          style={{
            paddingInline: fig(112),
            fontFamily: 'var(--font-hanken)',
            fontSize: '14px',
            color: 'var(--color-brand-stone)',
          }}
        >
          No events match your search.
        </p>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gap: fig(32), paddingInline: fig(112) }}
        >
          {pageEvents.map((event) => (
            <EventCard key={event._id} card={toEventCardData(event)} variant="grid" />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center" style={{ gap: fig(10) }}>
          <PageButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageButton key={p} active={p === currentPage} onClick={() => setPage(p)}>
              {p}
            </PageButton>
          ))}
          <PageButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </PageButton>
        </div>
      )}
    </div>
  )
}
