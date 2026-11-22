// src/lib/figmaScale.ts
// Scales a raw Figma px value by --figma-scale (viewport-width : 1900,
// clamped 0.6–1 — see globals.css) so it's pixel-perfect at Figma's 1900px
// canvas width and shrinks proportionally below that instead of overflowing
// its column.
export function fig(px: number): string {
  return `calc(var(--figma-scale) * ${px}px)`
}

/**
 * Mobile Figma px below lg (the 428px "wine landing — Mobile" frame), desktop
 * Figma px × --figma-scale from lg up. Uses --lg (0 below 1024px, 1 above,
 * set on <html> in globals.css), so one inline style carries both values.
 */
export function mfig(mobilePx: number, desktopPx: number, desktopFloor?: number): string {
  const desktop = desktopFloor ? `max(${desktopFloor}px, ${fig(desktopPx)})` : fig(desktopPx)
  return `calc(${mobilePx}px * (1 - var(--lg, 1)) + ${desktop} * var(--lg, 1))`
}

/**
 * Figma px × the footer's own --fs factor: 0.9 below lg (fixed, readable
 * phone/tablet sizes), and on desktop the page scale but never under 0.75 —
 * so from ~1425px up the footer is exactly Figma's proportions. --fs is set
 * on <footer>.
 */
export function fs(px: number): string {
  return `calc(var(--fs, 1) * ${px}px)`
}

/** fig(px), but never below `floor` px — for text and tap targets on small screens. */
export function figMin(px: number, floor: number): string {
  return `max(${floor}px, ${fig(px)})`
}
