/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        breadboard: {
          bg: '#f8fafc',
          railRed: '#ef4444',
          railBlue: '#3b82f6',
          hole: '#94a3b8',
          holeActive: '#22c55e',
          body: '#f1f5f9',
          divider: '#cbd5e1'
        }
      }
    },
  },
  plugins: [],
}
