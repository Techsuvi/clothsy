/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["translate-x-full", "translate-x-0"], // ✅ Fixes cart drawer visibility
  theme: {
    extend: {},
  },
  plugins: [],
};
