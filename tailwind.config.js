/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373', // Main grey
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        premium: {
          white: '#ffffff',
          light: '#f8fafc',
          gray: '#6b7280',
          dark: '#1f2937',
        },
        glass: {
          100: 'rgba(255,255,255,0.95)',
          200: 'rgba(255,255,255,0.8)',
          300: 'rgba(255,255,255,0.6)',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        premium: '0 4px 20px 0 rgba(0, 0, 0, 0.06)',
        soft: '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'Inter', 'ui-sans-serif'],
      },
    },
  },
  plugins: [],
} 