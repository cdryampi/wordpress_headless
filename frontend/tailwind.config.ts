export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "primary-dark": "#0b63b8",
        "background-light": "#ffffff",
        "background-off-white": "#f8f9fa",
        "background-dark": "#101922",
        "background-dark-card": "#1a2632",
        "text-light": "#1f2937",
        "text-light-secondary": "#4b5563",
        "text-dark": "#f3f4f6",
        "text-dark-secondary": "#9ca3af",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2632",
        "text-main-light": "#0d141b",
        "text-main-dark": "#e7edf3",
        "text-sec-light": "#4c739a",
        "text-sec-dark": "#9aaebb"
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  }
};
