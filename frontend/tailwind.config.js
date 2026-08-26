/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#010030',
        surface: {
          DEFAULT: '#160078',
          hover: '#1E009C',
          dark: '#0B0047',
        },
        primary: '#7226FF',
        magentaAcc: '#F042FF',
        cyanAcc: '#87F5F5',
        softText: '#FFE5F1',
        gold: {
          DEFAULT: '#F042FF',
          hover: '#7226FF',
        },
        ink: '#010030',
        paper: '#010030',
        line: 'rgba(114, 38, 255, 0.25)',
        muted: '#A4A0D1',
        subtext: '#FFE5F1/80',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -2px rgba(114, 38, 255, 0.4)',
        magentaGlow: '0 0 25px -2px rgba(240, 66, 255, 0.4)',
        cyanGlow: '0 0 20px -2px rgba(135, 245, 245, 0.35)',
      }
    },
  },
  plugins: [],
}
