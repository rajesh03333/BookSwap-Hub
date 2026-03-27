/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#5C3A21',
        'link-text': '#4A4A4A',
        'button-bg': '#A08C7D',
        'button-bg-hover': '#8a7465',
        'navbar-bg': '#FAF7F0',
        'border-blue': '#3b82f6',
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};