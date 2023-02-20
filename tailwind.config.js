/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/theme.liquid',
    './src/**/*.{liquid,json}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primaryColor)',
        page: 'var(--pageBg)',
        accent: 'var(--accentOne)',
        accentTwo: 'var(--accentTwo)',
      }
    },
  },
  plugins: [],
}
