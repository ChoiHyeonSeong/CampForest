/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'landing-bg-lg': "url('@assets/images/landing-lg.png')",
        'landing-bg': "url('@assets/images/landing-bg-big.webp')",
        'landing-bg-sm': "url('@assets/images/landing-sm.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'sun': '0 0 90px 90px rgba(255,248,216, 0.2)',
      },
      animation: {
        'shake': 'shake 0.5s 3',
        'clouds1': 'clouds1 110s linear infinite',
        'clouds2': 'clouds2 100s linear infinite',
        'slideIn': 'slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounceY': 'bounceY 2s infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        clouds1: {
          'to': { backgroundPosition: '200%' },
        },
        clouds2: {
          'to': { backgroundPosition: '-200%' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      colors: {
        light: {
          text: {
            DEFAULT: '#333333',
            secondary: '#666666',
            white: '#FFFFFF'
          },
          border: {
            DEFAULT: '#EEEEEE',
            1: '#CCCCCC',
            2: '#AAAAAA',
            3: '#333333',
            icon: '#666666'
          },
          signature: {
            DEFAULT: '#FF7F50',
            hover: '#FF6025'
          },
          black: '#333333',
          gray: {
	          DEFAULT: '#EEEEEE',
	          1: '#CCCCCC',
	          2: '#AAAAAA',
	          3: '#333333',
          },
          white: '#FFFFFF',
          heart: '#FF5B62',
          warning: '#FF0000',
          star: '#FFD233',
          reviewcard: '#FFF7ED',
          bgbasic : '#f3f4f6',
          anchor: {
            DEFAULT: '#3982FF',
            hover: '#355388'
          },
          background: '#FFFFFF'
        },

        dark: {
          text: {
            DEFAULT: '#E0E0E0',
            secondary: '#A0A0A0',
            white: '#262626'
          },
          border: {
            DEFAULT: '#333333',
            1: '#444444',
            2: '#666666',
            3: '#CCCCCC',
            icon: '#999999',
          },
          signature: {
            DEFAULT: '#FF9770',
            hover: '#FFB195'
          },
          black: '#E0E0E0',
          gray: {
	          DEFAULT: '#333333',
            1: '#444444',
            2: '#666666',
            3: '#CCCCCC',
          },
          white: '#262626',
          heart: '#FF7F84',
          warning: '#FF5555',
          star: '#FFC107',
          reviewcard: '#615E5B',
          bgbasic : '#121212',
          anchor: {
            DEFAULT: '#6BA4FF',
            hover: '#9CC3FF'
          },
          background: '#111111'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  mode: "jit",
};

