/** @type {import('tailwindcss').Config} */
export default  {
  darkMode: 'class', // ← خیلی مهم
  content: [
    "./src/views/**/*.{ejs,html,js}",
    "./src/views/*.ejs",
    "./public/**/*.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
