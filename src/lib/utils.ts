import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Merge Tailwind class names, resolving conflicts (last one wins).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Linear interpolation.
 */
export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Module-level mutable pointer state.
 *
 * Updated by `usePointerTracker` (window pointermove listener) and read +
 * smoothed inside the R3F `CameraRig` via `useFrame`. Keeping this outside
 * React state avoids re-renders on every mouse move and avoids any
 * pointer-events stacking issues with overlay UI.
 *
 * x/y: smoothed values in range [-1, 1]
 * targetX/targetY: raw normalized pointer position in range [-1, 1]
 */
export const pointer = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
}

/**
 * Smoothly scroll to a section using the global Lenis instance if available,
 * falling back to native scrollIntoView.
 */
export function scrollToHash(hash: string) {
  if (typeof window === 'undefined') return

  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return

  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target, { offset: -80, duration: 1.4 })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Format a number with comma separators (e.g. 1280 -> "1,280").
 */
export function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}
