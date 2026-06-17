'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query.
 *
 * Used for responsive 3D quality (mobile vs desktop particle counts),
 * `(pointer: fine)` to gate the custom cursor, and
 * `(prefers-reduced-motion: reduce)` to swap the 3D hero for a static
 * gradient fallback.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQueryList.matches)

    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
