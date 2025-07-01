/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: ["translate-x-full", "translate-x-0"],
  theme: {
    extend: {
        animation: {
        'ping-once': 'ping 0.75s ease-in-out 1',
      },
    },
  },
  plugins: [],
};
