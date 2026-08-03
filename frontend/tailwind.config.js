/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qeats: {
          primary: '#e23744', // QEats / Zomato red signature
          dark: '#1c1c1c',
          secondary: '#242a38',
          accent: '#00b553', // Emerald green
          yellow: '#ffb400', // Star gold
          bg: '#f8f9fc',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
