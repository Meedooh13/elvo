import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:   'var(--accent)',
        surface:  'var(--surface)',
        surface2: 'var(--surface-2)',
        border:   'var(--border)',
        primary:  'var(--bg-primary)',
        secondary:'var(--bg-secondary)',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        'ticker': 'ticker 20s linear infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
