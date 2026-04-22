/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8fafc",
        border: "#e2e8f0",
        text: "#0f172a",
        muted: "#475569",
        accent: "#1d4ed8"
      },
      fontFamily: {
        sans: ["Noto Sans", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
