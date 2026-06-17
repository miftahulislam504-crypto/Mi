'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn, scrollToHash } from '@/lib/utils'
import { navLinks, profile } from '@/lib/data'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', ...navLinks.map((link) => link.id)]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNav = (id: string) => {
    setOpen(false)
    scrollToHash(`#${id}`)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'border-b border-white/5 bg-void/70 backdrop-blur-xl' : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNav('home')
            }}
            data-cursor="hover"
            className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-ink"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full animate-pulse-glow rounded-full bg-cosmic-cyan" />
            </span>
            {profile.initials}
            <span className="text-cosmic-cyan">.</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(link.id)
                  }}
                  data-cursor="hover"
                  className={cn(
                    'font-mono text-xs uppercase tracking-[0.2em] transition-colors',
                    active === link.id ? 'text-cosmic-cyan' : 'text-ink-muted hover:text-ink'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                handleNav('contact')
              }}
              data-cursor="hover"
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors hover:border-cosmic-cyan/40 hover:text-ink"
            >
              Say Hello
            </a>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="-mr-2 p-2 text-ink md:hidden"
            aria-label="Open menu"
            data-cursor="hover"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-void/95 backdrop-blur-2xl md:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 p-2 text-ink"
              aria-label="Close menu"
              data-cursor="hover"
            >
              <X className="h-6 w-6" />
            </button>

            {['home', ...navLinks.map((l) => l.id)].map((id, i) => {
              const label = id === 'home' ? 'Home' : navLinks.find((l) => l.id === id)?.label
              return (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(id)
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  data-cursor="hover"
                  className={cn(
                    'font-display text-3xl font-bold uppercase tracking-wide transition-colors',
                    active === id ? 'text-cosmic-cyan' : 'text-ink'
                  )}
                >
                  {label}
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
