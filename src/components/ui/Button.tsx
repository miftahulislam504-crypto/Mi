'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn, scrollToHash } from '@/lib/utils'

interface GlowButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  icon?: boolean
  external?: boolean
  className?: string
}

export function GlowButton({ href, children, variant = 'primary', icon = true, external = false, className }: GlowButtonProps) {
  const isHash = href.startsWith('#')

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHash) {
      event.preventDefault()
      scrollToHash(href)
    }
  }

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      data-cursor="hover"
      className={cn(
        'group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-shadow duration-300',
        variant === 'primary'
          ? 'bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan text-white shadow-glow-purple hover:shadow-glow-cyan'
          : 'border border-white/15 bg-white/[0.03] text-ink backdrop-blur-md hover:border-cosmic-cyan/40 hover:bg-white/[0.06]',
        className
      )}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </motion.a>
  )
}
