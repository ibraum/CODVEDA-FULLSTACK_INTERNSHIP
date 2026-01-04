/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You might want to add custom colors here later to match the "HumanOps" theme
        // For now, we'll stick to defaults but prepared for extension
      },
    },
  },
  plugins: [],
}
