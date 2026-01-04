export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1014",
        haze: "#f7f4ef",
        punch: "#ff7a4a",
        mint: "#3dd3b1",
        clay: "#f2e7dd"
      },
      fontFamily: {
        sans: ["\"Space Grotesk\"", "ui-sans-serif", "system-ui"],
        serif: ["\"Fraunces\"", "ui-serif", "Georgia"]
      }
    }
  }
};
