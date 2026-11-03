// src/components/ui/Alerts.tsx
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { fig } from '@/lib/figmaScale'

// Shared booking alerts from the Figma "alerts" frame:
//   StatusOverlay — blocking "please wait" card (A · while something is happening)
//   AlertModal    — card with a title, message and actions (B2, B3…)
//   AlertBanner   — non-blocking strip shown inside a form (B1…)

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair)',
  fontWeight: 600,
  fontSize: 'max(20px, calc(var(--figma-scale) * 24px))',
  lineHeight: 1.25,
  color: '#1a1d17',
}

const messageStyle: React.CSSProperties = {
  fontFamily: 'var(--font-hanken)',
  fontSize: 'max(14px, calc(var(--figma-scale) * 15px))',
  lineHeight: 1.5,
  color: '#4f4542',
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseButton({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5"
      style={{ width: 32, height: 32, color: '#8a8478' }}
    >
      <CloseIcon />
    </button>
  )
}

// Backdrop + white card, rendered at the end of <body>. Locks page scroll,
// keeps Tab inside the card and gives focus back when it closes.
function OverlayCard({
  labelledBy,
  describedBy,
  role,
  busy,
  onEscape,
  maxWidth,
  children,
}: {
  labelledBy: string
  describedBy?: string
  role: 'dialog' | 'alertdialog'
  busy?: boolean
  onEscape?: () => void
  maxWidth: number
  children: ReactNode
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const escapeRef = useRef(onEscape)
  useEffect(() => {
    escapeRef.current = onEscape
  })

  useEffect(() => {
    const card = cardRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusable = () =>
      Array.from(card?.querySelectorAll<HTMLElement>('button, [href], input, [tabindex="0"]') ?? [])
    // Land on the main action when there is one, otherwise on the card.
    const primary = card?.querySelector<HTMLElement>('[data-autofocus]')
    ;(primary ?? card)?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && escapeRef.current) {
        e.preventDefault()
        escapeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [])

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(26,29,23,0.45)', backdropFilter: 'blur(2px)' }}
    >
      <div
        ref={cardRef}
        role={role}
        aria-modal="true"
        aria-busy={busy || undefined}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className="relative flex w-full flex-col items-start bg-white outline-none"
        style={{
          maxWidth: `max(340px, calc(var(--figma-scale) * ${maxWidth}px))`,
          borderRadius: fig(20),
          paddingBlock: fig(48),
          paddingInline: fig(56),
          gap: fig(16),
          boxShadow: '0px 1px 1px rgba(0,0,0,0.05), 0px 12px 40px rgba(26,29,23,0.12)',
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

// ─── A · while something is happening ───

interface StatusOverlayProps {
  open: boolean
  title: string
  message?: string
}

export function StatusOverlay({ open, title, message }: StatusOverlayProps) {
  if (!open || typeof document === 'undefined') return null
  return (
    <OverlayCard
      role="alertdialog"
      busy
      labelledBy="status-overlay-title"
      describedBy={message ? 'status-overlay-message' : undefined}
      maxWidth={545}
    >
      <Spinner />
      <p id="status-overlay-title" aria-live="assertive" style={titleStyle}>
        {title}
      </p>
      {message && (
        <p id="status-overlay-message" style={messageStyle}>
          {message}
        </p>
      )}
    </OverlayCard>
  )
}

function Spinner() {
  const size = 'max(24px, calc(var(--figma-scale) * 28px))'
  return (
    <span
      aria-hidden="true"
      className="block shrink-0 animate-spin rounded-full motion-reduce:animate-none"
      style={{
        width: size,
        height: size,
        border: '2.5px solid #d6d3cb',
        borderTopColor: 'var(--color-brand-olive)',
        animationDuration: '1.1s',
      }}
    />
  )
}

// ─── Modal with actions ───

export interface AlertAction {
  label: string
  onClick: () => void
  // Primary = dark green pill; text = plain link-style button next to it.
  variant?: 'primary' | 'text'
}

interface AlertModalProps {
  open: boolean
  title: string
  message: string
  actions: AlertAction[]
  // × button and Escape key.
  onClose: () => void
}

export function AlertModal({ open, title, message, actions, onClose }: AlertModalProps) {
  if (!open || typeof document === 'undefined') return null
  return (
    <OverlayCard
      role="alertdialog"
      labelledBy="alert-modal-title"
      describedBy="alert-modal-message"
      onEscape={onClose}
      maxWidth={566}
    >
      <div className="absolute" style={{ top: fig(20), right: fig(20) }}>
        <CloseButton onClick={onClose} />
      </div>
      <h2 id="alert-modal-title" style={{ ...titleStyle, paddingRight: 32 }}>
        {title}
      </h2>
      <p id="alert-modal-message" style={messageStyle}>
        {message}
      </p>
      <div className="flex flex-wrap items-center" style={{ gap: fig(10), marginTop: fig(8) }}>
        {actions.map((action, i) =>
          action.variant === 'text' ? (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="cursor-pointer rounded-full transition-colors hover:bg-black/5"
              style={{
                paddingInline: 'max(8px, calc(var(--figma-scale) * 10px))',
                paddingBlock: 'max(10px, calc(var(--figma-scale) * 12px))',
                fontFamily: 'var(--font-hanken)',
                fontWeight: 500,
                fontSize: 'max(14px, calc(var(--figma-scale) * 15px))',
                color: '#1a1d17',
              }}
            >
              {action.label}
            </button>
          ) : (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              data-autofocus={i === 0 || undefined}
              className="cursor-pointer rounded-full text-white transition-colors hover:bg-[#1f281b]"
              style={{
                backgroundColor: '#2e3a28',
                paddingInline: 'max(18px, calc(var(--figma-scale) * 22px))',
                paddingBlock: 'max(10px, calc(var(--figma-scale) * 12px))',
                fontFamily: 'var(--font-hanken)',
                fontWeight: 600,
                fontSize: 'max(14px, calc(var(--figma-scale) * 15px))',
              }}
            >
              {action.label}
            </button>
          )
        )}
      </div>
    </OverlayCard>
  )
}

// ─── Banner inside a form ───

interface AlertBannerProps {
  children: ReactNode
  // notice = beige heads-up (B1); error = red strip for a failed action (C3).
  tone?: 'notice' | 'error'
  onDismiss?: () => void
}

const BANNER_TONES = {
  notice: { background: '#f2ecdc', color: '#1a1d17' },
  error: { background: '#f5e9e6', color: '#8f1d1d' },
}

export function AlertBanner({ children, tone = 'notice', onDismiss }: AlertBannerProps) {
  const colors = BANNER_TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="animate-fade-in flex items-center"
      style={{
        backgroundColor: colors.background,
        borderRadius: fig(12),
        paddingBlock: 'max(6px, calc(var(--figma-scale) * 8px))',
        paddingLeft: 'max(14px, calc(var(--figma-scale) * 16px))',
        paddingRight: onDismiss ? 6 : 'max(14px, calc(var(--figma-scale) * 16px))',
        gap: 'max(12px, calc(var(--figma-scale) * 16px))',
        minHeight: 'max(40px, calc(var(--figma-scale) * 42px))',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-hanken)',
          fontWeight: 700,
          fontSize: 14,
          color: colors.color,
        }}
      >
        !
      </span>
      <p className="flex-1" style={{ ...messageStyle, fontSize: 14, color: colors.color }}>
        {children}
      </p>
      {onDismiss && <CloseButton onClick={onDismiss} label="Dismiss" />}
    </div>
  )
}
