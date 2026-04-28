/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950 base
        card: 'rgba(15, 23, 42, 0.6)', // slate-900/60
        border: 'rgba(30, 41, 59, 0.5)', // slate-800/50
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          hover: '#6366f1', // indigo-500
        },
        accent: {
          DEFAULT: '#2dd4bf', // teal-400
          hover: '#22d3ee', // cyan-400
        },
        success: '#10b981', // emerald-500
        warning: '#f59e0b', // amber-500
        danger: '#ef4444', // rose-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
