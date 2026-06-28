import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/lib/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          DEFAULT: "#3DF5C5",
          dark: "#2BCC9E",
          light: "#6EE7B7",
        },
        ios: {
          base: "#06080C",
          surface: "#0C0F15",
          "surface-2": "#12161E",
          "surface-3": "#1A1F2B",
          border: "#1E2433",
          text: "#E8EDF2",
          "text-secondary": "#B0B8C4",
          muted: "#7A8694",
          accent: "#3DF5C5",
          error: "#FF4D6A",
          warning: "#FFB347",
          success: "#3DF5C5",
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"SF Pro Display"', "system-ui", "sans-serif"],
        sans: ['"Geist"', '"SF Pro Text"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
