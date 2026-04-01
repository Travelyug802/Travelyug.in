/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#0F4C81', light: '#1a6bb5', dark: '#0a3460' },
        secondary: { DEFAULT: '#00A8A8', dark: '#007a7a' },
        accent:    { DEFAULT: '#FFC107', dark: '#e6ac00' }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body:    ['Open Sans', 'sans-serif']
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      },
      animation: {
        float:    'float 3s ease-in-out infinite',
        'fade-in':'fadeIn .5s ease',
        'slide-up':'slideUp .6s ease'
      }
    }
  },
  plugins: []
};
