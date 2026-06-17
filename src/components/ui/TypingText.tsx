'use client'

import { useEffect, useState } from 'react'

interface TypingTextProps {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  cursorClassName?: string
  onComplete?: () => void
}

/**
 * One-shot typewriter effect. The full string is always present for screen
 * readers via a visually-hidden span — only the visible characters are
 * animated.
 */
export function TypingText({
  text,
  speed = 35,
  startDelay = 0,
  className,
  cursorClassName,
  onComplete,
}: TypingTextProps) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    const start = setTimeout(() => {
      let i = 0
      interval = setInterval(() => {
        i += 1
        setLength(i)
        if (i >= text.length) {
          clearInterval(interval)
          onComplete?.()
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay])

  const done = length >= text.length

  return (
    <span className={className}>
      <span aria-hidden="true">{text.slice(0, length)}</span>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className={
          cursorClassName ??
          `ml-1 inline-block h-[0.85em] w-[3px] -mb-1 translate-y-[0.05em] bg-current align-middle ${
            done ? 'animate-blink' : 'opacity-100'
          }`
        }
      />
    </span>
  )
}

interface RoleCyclerProps {
  roles: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
}

/**
 * Loops through a list of role labels with a typewriter cycle effect.
 */
export function RoleCycler({ roles, className, typeSpeed = 60, deleteSpeed = 30, pause = 1500 }: RoleCyclerProps) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const current = roles[index % roles.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && subIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % roles.length)
    } else {
      timeout = setTimeout(
        () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
        deleting ? deleteSpeed : typeSpeed
      )
    }

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, roles, typeSpeed, deleteSpeed, pause])

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(blinkInterval)
  }, [])

  const current = roles[index % roles.length]

  return (
    <span className={className}>
      <span aria-hidden="true">{current.slice(0, subIndex)}</span>
      <span aria-hidden="true" className={blink ? 'opacity-100' : 'opacity-0'}>
        |
      </span>
      <span className="sr-only">{current}</span>
    </span>
  )
}
