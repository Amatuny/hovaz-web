// src/lib/figmaScale.ts
// Scales a raw Figma px value by --figma-scale (viewport-width : 1900,
// clamped 0.6–1 — see globals.css) so it's pixel-perfect at Figma's 1900px
// canvas width and shrinks proportionally below that instead of overflowing
// its column.
export function fig(px: number): string {
  return `calc(var(--figma-scale) * ${px}px)`
}
