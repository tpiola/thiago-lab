/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        svr: {
          bg: '#070707',
          surface: '#0e0e0e',
          elevated: '#161616',
          border: 'rgba(255,255,255,0.06)',
          text: '#ffffff',
          muted: '#888888',
          dim: '#444444',
          accent: '#00ff88',
          'accent-dim': '#00cc6a',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,255,136,0.25)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
