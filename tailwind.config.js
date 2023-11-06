/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {},
  },
  plugins: ["preline/plugin"],
}

