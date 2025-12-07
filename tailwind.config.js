/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#031926',
          50: '#031926',
          100: '#031926',
          200: '#031926',
          300: '#031926',
          400: '#031926',
          500: '#031926',
          600: '#031926',
          700: '#031926',
          800: '#031926',
          900: '#031926',
        },
        teal: {
          DEFAULT: '#468189',
          50: '#e8f0f2',
          100: '#d1e1e5',
          200: '#a3c3cb',
          300: '#75a5b1',
          400: '#468189',
          500: '#3a6a71',
          600: '#2e5359',
          700: '#223d41',
          800: '#162729',
          900: '#0b1214',
        },
        mutedTeal: {
          DEFAULT: '#77ACA2',
          50: '#f0f7f6',
          100: '#e1efed',
          200: '#c3dfdb',
          300: '#a5cfc9',
          400: '#77ACA2',
          500: '#5f8a82',
          600: '#4c6e68',
          700: '#39524e',
          800: '#263634',
          900: '#131a19',
        },
        ash: {
          DEFAULT: '#9DBEBB',
          50: '#f5f9f9',
          100: '#ebf3f3',
          200: '#d7e7e7',
          300: '#c3dbdb',
          400: '#9DBEBB',
          500: '#7e9896',
          600: '#647978',
          700: '#4a5a5a',
          800: '#303c3c',
          900: '#181e1e',
        },
        cream: {
          DEFAULT: '#F4E9CD',
          50: '#fefbf7',
          100: '#fdf7ef',
          200: '#fbefdf',
          300: '#f9e7cf',
          400: '#F4E9CD',
          500: '#c3baa4',
          600: '#928b7b',
          700: '#625c52',
          800: '#312e29',
          900: '#181715',
        },
        // Legacy mappings for backward compatibility
        primary: {
          DEFAULT: '#468189', // Teal
        },
        secondary: {
          DEFAULT: '#77ACA2', // Muted Teal
        },
        accent: {
          DEFAULT: '#031926', // Ink Black
        },
        background: {
          main: '#031926', // Ink Black
          card: '#9DBEBB', // Ash Grey with opacity
          DEFAULT: '#031926',
        },
      },
      backgroundColor: {
        'main': '#031926', // Ink Black
        'card': 'rgba(157, 190, 187, 0.15)', // Ash Grey with 15% opacity
        'card-hover': 'rgba(157, 190, 187, 0.25)', // Ash Grey with 25% opacity
        'button': '#468189', // Teal
        'button-hover': '#77ACA2', // Muted Teal
      },
      textColor: {
        'primary': '#F4E9CD', // Vanilla Cream
        'secondary': '#9DBEBB', // Ash Grey
        'button': '#031926', // Ink Black on buttons
      },
      borderColor: {
        'default': '#9DBEBB', // Ash Grey
        'card': 'rgba(157, 190, 187, 0.3)', // Ash Grey with 30% opacity
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
      },
    },
  },
  plugins: [],
}
