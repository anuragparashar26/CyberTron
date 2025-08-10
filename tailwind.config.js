/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d0d0d',
        'primary-green': '#00ff00',
        'primary-amber': '#ffb000',
        'light-gray': '#cccccc',
      },
      fontFamily: {
        'mono': ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
