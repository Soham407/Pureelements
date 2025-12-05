/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#8B7E66', // Gold/Brown
          secondary: '#5D6D55', // Green
          accent: '#F2C94C', // Yellow/Gold
          surface: '#FFFBF2', // Cream
          dark: '#2C2C2C',
          light: '#F9F9F9',
          cream: '#FFFBF2', // Alias for surface if needed for backward compat or specific use
        }
      },
      fontSize: {
        // Enforcing minimum 12px for readability
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
