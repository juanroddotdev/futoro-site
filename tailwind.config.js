/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/scss/**/*.scss",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A3FFB',
        secondary: '#FF6B4A',
        accent: '#7000FF',
        space: '#0A0A0F',
        neutral: {
          900: '#342E2E',
          700: '#817A7A',
          500: '#CFCDC7',
          400: '#D9D9D9',
          300: '#E8E8E8',
          100: '#FBFBFB',
        },
      },
      fontFamily: {
        sans: ['Raleway', 'Inter var', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
