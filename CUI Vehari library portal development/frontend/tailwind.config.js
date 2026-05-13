/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        newsreader: ["Newsreader", "serif"],
        sans: ["Work Sans", "sans-serif"],
      },
      colors: {
        "primary": "#000615",
        "primary-container": "#0b1f3a",
        "on-primary-container": "#7587a7",
        "primary-fixed-dim": "#b5c7ea",
        "secondary": "#7e5700",
        "secondary-container": "#fec256",
        "on-secondary-container": "#734f00",
        "surface": "#fbf9fb",
        "surface-container-low": "#f5f3f6",
        "on-surface": "#1b1b1e",
        "on-surface-variant": "#44474d",
        "outline-variant": "#c4c6ce",
        "background": "#fbf9fb",
      },
      boxShadow: {
        'ambient': '0 4px 20px -2px rgba(11, 31, 58, 0.05), 0 2px 10px -2px rgba(11, 31, 58, 0.03)',
        'ambient-lg': '0 10px 30px -5px rgba(11, 31, 58, 0.08), 0 4px 12px -3px rgba(11, 31, 58, 0.04)',
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
