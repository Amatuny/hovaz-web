// src/components/ui/DragScroll.tsx
'use client'

import { useRef } from 'react'

// Horizontal strip with a hidden scrollbar that can be slid by dragging with
// the mouse. Touch and trackpad scrolling keep working natively.
export function DragScroll({
  className,
  style,
  onScroll,
  scrollRef,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  onScroll?: React.UIEventHandler<HTMLDivElement>
  // Exposes the scroll container, e.g. for pagination dots.
  scrollRef?: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const ref = scrollRef ?? innerRef
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

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

  return (
    <div
      ref={ref}
      className={`cursor-grab select-none overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ''}`}
      style={style}
      onScroll={onScroll}
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
}
