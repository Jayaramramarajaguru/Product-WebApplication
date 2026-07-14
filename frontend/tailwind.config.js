/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#b3ccff",
          300: "#80a8ff",
          400: "#5c86ff",
          500: "#3a63f5",
          600: "#2b4cd6",
          700: "#233eab",
          800: "#1e3488",
          900: "#1b2d6e",
        },
      },
      boxShadow: {
        card: "0 4px 24px -6px rgba(30, 41, 59, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
