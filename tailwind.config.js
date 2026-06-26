import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const here = dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [resolve(here, 'index.html'), resolve(here, 'src/**/*.{ts,tsx}')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2f9', 100: '#dce5f2', 200: '#b8caE6', 300: '#8aa7d4',
          400: '#5a80bc', 500: '#3a62a3', 600: '#2d4a7c', 700: '#263d66',
          800: '#1f3252', 900: '#16243b',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.08)',
        pop: '0 10px 30px rgba(16,24,40,0.12)',
      },
      borderRadius: { xl: '0.9rem' },
    },
  },
  plugins: [],
}
