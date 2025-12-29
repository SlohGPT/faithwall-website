/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#D97B3B',
          light: '#E9A06A',
          dark: '#C06A2E',
          soft: '#F5C9A8',
        },
        purple: {
          soft: '#7C6B8E',
          light: '#9B8AAE',
        },
        blue: {
          calm: '#6B8CAE',
        },
        cream: {
          DEFAULT: '#FDF8F0',
          light: '#FFFBF5',
          dark: '#F5EDE3',
        },
        dark: {
          DEFAULT: '#1A1A2E',
          light: '#2D2A4A',
        },
        text: {
          primary: '#2D2A32',
          secondary: '#5A5660',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #FFFBF5 0%, #FDF8F0 50%, #F5EDE3 100%)',
        'gradient-orange': 'linear-gradient(135deg, #D97B3B 0%, #E9A06A 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A2E 0%, #2D2A4A 100%)',
      },
    },
  },
  plugins: [],
};
