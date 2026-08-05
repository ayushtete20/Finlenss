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
        portfolio: {
          bg: '#E3F2FD',
          card: '#FFFFFF',
          border: '#90CAF9',
          text: '#0D47A1',
          accent: '#2196F3',
          main: '#0D47A1',
          gold: '#F59E0B',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}

