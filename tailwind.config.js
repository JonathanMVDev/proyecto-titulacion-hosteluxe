/** @type {import('tailwindcss').Config} */
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {
      fontFamily:{
        display: "EB Garamond"
      },
      colors: {
        nav: "#321F1A",
        backgr: "#a16207",
        header: "#527e98"
      }
    },
  },
  plugins: [],
}
