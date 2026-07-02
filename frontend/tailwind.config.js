/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Fine Dining Palette Hack: Invert white/gray and make indigo a gold/bronze
        white: '#121212', // Dark charcoal for cards
        black: '#ffffff', // White for dark text
        gray: {
          50: '#0a0a0a',  // Page backgrounds (previously very light)
          100: '#1a1a1a', // Borders / subtle backgrounds
          200: '#262626',
          300: '#404040',
          400: '#525252',
          500: '#737373',
          600: '#a3a3a3',
          700: '#d4d4d4',
          800: '#e5e5e5',
          900: '#f5f5f5', // Primary text (previously very dark)
          950: '#fafafa',
        },
        indigo: { // Aliased to Gold/Bronze
          50: '#2a2118',  // Soft gold hover background
          100: '#3d3023',
          200: '#5c4835',
          300: '#7a6047',
          400: '#997858',
          500: '#b8906a',
          600: '#d6a87c', // Primary Accent (Gold)
          700: '#deba96',
          800: '#e6cdb0',
          900: '#f0dfca',
          950: '#f7efe5',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.1)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.05)',
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'blob': 'blob 7s infinite',
        shine: 'shine 5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
    },
  },
  plugins: [],
};
