import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#9CAF88',
        accent: '#DAA520',
        cream: '#F5F5DC',
        'deep-forest': '#2D5016',
        charcoal: '#36454F',
        'soft-gray': '#E5E5E5',
        'pure-white': '#FFFFFF',
        'light-gray': '#F8F9FA',
        'medium-gray': '#6C757D',
        'dark-gray': '#343A40',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 8px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}

export default config