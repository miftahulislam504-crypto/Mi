import { profile } from '@/lib/data'

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-void px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim sm:flex-row sm:text-left">
        <span>{profile.fullName}</span>
        <span className="text-cosmic-cyan/70">CivilOS / EnginEx Ecosystem</span>
        <span>&copy; {new Date().getFullYear()} — Built from Sirajganj, Bangladesh</span>
      </div>
    </footer>
  )
}
