/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#090D16',
        surface: {
          DEFAULT: '#0F172A',
          hover: '#1E293B',
          dark: '#0B0F17',
        },
        primary: '#6366F1',
        magentaAcc: '#6366F1',
        cyanAcc: '#38BDF8',
        softText: '#F8FAFC',
        gold: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        ink: '#090D16',
        paper: '#090D16',
        line: '#1E293B',
        muted: '#94A3B8',
        subtext: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px #6366F1',
        magentaGlow: '0 0 0 1px #6366F1',
        cyanGlow: '0 0 0 1px #38BDF8',
      }
    },
  },
  plugins: [],
}
