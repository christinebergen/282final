/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        top: '0 -8px 16px -2px rgba(0, 0, 0, 0.2), 0 -8px 16px -3px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
