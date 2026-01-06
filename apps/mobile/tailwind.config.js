/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#13ecec",
        "background-light": "#f6f8f8",
        "background-dark": "#102222",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2c2c",
      }
    },
  },
  plugins: [],
}
