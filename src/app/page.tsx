'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { Hero } from '@/components/sections/Hero'
import { Universe } from '@/components/sections/Universe'
import { About } from '@/components/sections/About'
import { SkillsGalaxy } from '@/components/sections/SkillsGalaxy'
import { Ecosystem } from '@/components/sections/Ecosystem'
import { Experience } from '@/components/sections/Experience'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <Hero />
      <Universe />
      <About />
      <SkillsGalaxy />
      <Ecosystem />
      <Experience />
      <Contact />
    </>
  )
}
