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
        msblue: {
          50: '#f0f6ff',
          100: '#e0edff',
          500: '#0078d4',
          600: '#0062ab',
          700: '#004c87',
          800: '#003966',
          900: '#002644',
        },
        slate: {
          850: '#151f32',
          950: '#080d1a',
        },
        cyber: {
          cyan: '#00f2fe',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(0, 120, 212, 0.3)',
        'glow-red': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
}
