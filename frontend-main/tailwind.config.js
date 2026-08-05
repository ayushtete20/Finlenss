/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgLight: '#E3F2FD',
        primary: {
          DEFAULT: '#0D47A1',
          dark: '#0A367B',
          light: '#1565C0',
        },
        accent: {
          DEFAULT: '#2196F3',
          light: '#90CAF9',
          bg: '#E3F2FD',
        },
        mint: {
          50: '#F0F7FF',
          100: '#E3F2FD',
          200: '#D0E6F9',
          300: '#90CAF9',
          400: '#64B5F6',
          500: '#2196F3',
        },
        navy: {
          950: '#082B60',
          900: '#0D47A1',
          850: '#1565C0',
          800: '#1976D2',
          700: '#1E88E5',
          600: '#2196F3',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        display: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}

