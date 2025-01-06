/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#192232",
        secondary: "#1649ff",
        tertiary: "#1e293b",
      },
      backgroundImage: {
        "gradient-to-light": "linear-gradient(to bottom, #1649FF, #5A85FF)",
      },
    },
  },
  plugins: [],
};
