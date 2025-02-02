import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        primary: "var(--primary)",
      },
      maxWidth: {
        "mobile": "24.375rem"
      }
    },
  },
  plugins: [],
} satisfies Config;
