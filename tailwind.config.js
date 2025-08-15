/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
        },
        sidebar: {
          bg: '#1e293b',
          hover: '#334155',
          active: '#4338ca',
          text: '#cbd5e1',
          activeText: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}