/** @type {import('tailwindcss').Config} */
const { hairlineWidth } = require('nativewind/theme');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './node_modules/@rnr/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Semantic tokens (CSS variables) — utilisés par les composants RNR
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          // Palette complète
          50: '#f8f5f6',
          100: '#f1e3e8',
          200: '#eac2d0',
          300: '#e599b3',
          400: '#e37ca0',
          500: '#e35f8d',
          600: '#dc316d',
          700: '#be1c55',
          800: '#921641',
          900: '#63112e',
          950: '#3b0b1c',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          // Palette complète
          50: '#f5f8f7',
          100: '#e4f0ec',
          200: '#c5e7db',
          300: '#93dcc2',
          400: '#52cfa4',
          500: '#2aab7e',
          600: '#1f8964',
          700: '#176d4f',
          800: '#10503a',
          900: '#0d3527',
          950: '#091f17',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      fontFamily: {
        // Outfit — titres, headings
        outfit: ['Outfit_400Regular'],
        'outfit-medium': ['Outfit_500Medium'],
        'outfit-semibold': ['Outfit_600SemiBold'],
        'outfit-bold': ['Outfit_700Bold'],
        // DM Sans — body, UI text
        'dm-sans': ['DMSans_400Regular'],
        'dm-sans-medium': ['DMSans_500Medium'],
        'dm-sans-semibold': ['DMSans_600SemiBold'],
        'dm-sans-bold': ['DMSans_700Bold'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
