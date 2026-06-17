import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04050D',
        surface: '#0A0E1C',
        'surface-2': '#10162B',
        cosmic: {
          purple: '#8B5CF6',
          blue: '#3B82F6',
          cyan: '#22D3EE',
        },
        ink: {
          DEFAULT: '#F3F5FA',
          muted: '#8B93A7',
          dim: '#525B72',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 40px -10px rgba(139, 92, 246, 0.55)',
        'glow-blue': '0 0 40px -10px rgba(59, 130, 246, 0.55)',
        'glow-cyan': '0 0 40px -10px rgba(34, 211, 238, 0.55)',
        'glow-sm': '0 0 20px -6px rgba(139, 92, 246, 0.6)',
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
