import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages//*.{js,ts,jsx,tsx,mdx}",
    "./components//*.{js,ts,jsx,tsx,mdx}",
    "./app//*.{js,ts,jsx,tsx,mdx}",
    "./src//*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;