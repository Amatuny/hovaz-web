// src/components/ui/DragScroll.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

// Horizontal strip with a hidden scrollbar that can be slid by dragging with
// the mouse. Touch and trackpad scrolling keep working natively. Pass `arrows`
// for prev/next buttons straddling the strip's edges (md+ only — touch users
// swipe), each hidden once the strip can't scroll further that way.
export function DragScroll({
  className,
  style,
  onScroll,
  scrollRef,
  arrows = false,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  onScroll?: React.UIEventHandler<HTMLDivElement>
  // Exposes the scroll container, e.g. for pagination dots.
  scrollRef?: React.RefObject<HTMLDivElement | null>
  arrows?: boolean
  children: React.ReactNode
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const ref = scrollRef ?? innerRef
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })
  const [edges, setEdges] = useState({ prev: false, next: false })

  function updateEdges(el: HTMLDivElement) {
    const prev = el.scrollLeft > 1
    const next = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setEdges((e) => (e.prev === prev && e.next === next ? e : { prev, next }))
  }

  useEffect(() => {
    const el = ref.current
    if (!arrows || !el) return
    const observer = new ResizeObserver(() => updateEdges(el))
    observer.observe(el)
    return () => observer.disconnect()
  }, [arrows, ref])

  function scrollByCard(direction: 1 | -1) {
    const el = ref.current
    if (!el) return
    // One card + gap: the distance between the first two children.
    const [a, b] = Array.from(el.children) as HTMLElement[]
    const step = a && b ? b.offsetLeft - a.offsetLeft : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !ref.current) return
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startScroll: ref.current.scrollLeft,
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!drag.current.active || !el) return
    const dx = e.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(dx) > 5) {
      drag.current.moved = true
      el.setPointerCapture(e.pointerId)
      // Snapping fights the drag, so it's off until the pointer is released.
      el.style.scrollSnapType = 'none'
      el.style.cursor = 'grabbing'
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startScroll - dx
  }

  function endDrag() {
    const el = ref.current
    drag.current.active = false
    if (!el) return
    el.style.scrollSnapType = ''
    el.style.cursor = ''
  }

  const strip = (
    <div
      ref={ref}
      className={`cursor-grab select-none overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ''}`}
      style={style}
      onScroll={(e) => {
        if (arrows) updateEdges(e.currentTarget)
        onScroll?.(e)
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // A drag must not also open the card the mouse was released over.
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault()
          e.stopPropagation()
          drag.current.moved = false
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  )

  if (!arrows) return strip

  return (
    <div className="relative">
      {strip}
      <ArrowButton direction={-1} visible={edges.prev} onClick={() => scrollByCard(-1)} />
      <ArrowButton direction={1} visible={edges.next} onClick={() => scrollByCard(1)} />
    </div>
  )
}

function ArrowButton({
  direction,
  visible,
  onClick,
}: {
  direction: 1 | -1
  visible: boolean
  onClick: () => void
}) {
  const isNext = direction === 1
  return (
    <button
      type="button"
      aria-label={isNext ? 'Scroll right' : 'Scroll left'}
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`absolute top-1/2 z-10 hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[18px] text-[#1a1d17] shadow-[0_4px_16px_rgba(26,29,23,0.15)] transition-[opacity,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#2e3a28] hover:text-white md:flex ${
        isNext ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
      } ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      {/* Figma "Button arrow": Arial 18px chevron */}
      <span aria-hidden="true" style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1 }}>
        {isNext ? '›' : '‹'}
      </span>
    </button>
  )
}
