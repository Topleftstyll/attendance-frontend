/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./constants/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02'
      },
      width: {
        '32p': '32%',
        '49p': '49%'
      },
      maxWidth: {
        '94p': '94%'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}