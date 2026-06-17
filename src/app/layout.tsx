import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import 'lenis/dist/lenis.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScroll'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Miftahul Islam — Civil Engineer & Full-Stack Developer',
    template: '%s · Miftahul Islam',
  },
  description:
    'Civil Engineer and Full-Stack Developer building the CivilOS ecosystem — eleven interconnected applications transforming construction workflows across Bangladesh.',
  keywords: [
    'Miftahul Islam',
    'CivilOS',
    'EnginEx',
    'Civil Engineering',
    'BNBC 2020',
    'Next.js Developer',
    'Bangladesh',
    'Structural Analysis',
  ],
  authors: [{ name: 'Miftahul Islam' }],
  openGraph: {
    title: 'Miftahul Islam — Civil Engineer & Full-Stack Developer',
    description: 'Creator of the CivilOS Ecosystem — transforming construction workflows in Bangladesh.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miftahul Islam — Civil Engineer & Full-Stack Developer',
    description: 'Creator of the CivilOS Ecosystem — transforming construction workflows in Bangladesh.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#04050D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-void font-sans text-ink">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
