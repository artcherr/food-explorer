// tailwind.config.ts
import type { Config } from 'tailwindcss'
import scrollbar from 'tailwind-scrollbar'

export default {
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/pages/**/*.{ts,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [scrollbar({ nocompatible: true })],
} satisfies Config
