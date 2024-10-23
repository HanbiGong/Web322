/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/404.html`,`./views/about.html`,`./views/home.html`],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['fantasy'],
  },
}

