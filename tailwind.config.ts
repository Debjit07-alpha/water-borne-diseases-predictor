import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: '#0ea5e9',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        'heading-sans': ['var(--font-montserrat)', 'Montserrat', 'Helvetica', 'Arial', 'ui-sans-serif', 'system-ui'],
        'heading-serif': ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        'comic-sans': ['Comic Sans MS', 'cursive'],
        'book-antiqua': ['Book Antiqua', 'serif'],
        'bell-mt': ['Bell MT', 'serif'],
        'bookman-old-style': ['Bookman Old Style', 'serif'],
        'baskerville': ['"Baskerville Old Face"', 'Baskerville', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;