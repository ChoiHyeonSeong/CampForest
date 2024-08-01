/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s 3', // 애니메이션 이름과 지속 시간 설정
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
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
          white: '#FFFFFF',
          heart: '#FF5B62',
          warning: '#FF0000',
          anchor: {
            DEFAULT: '#3982FF',
            hover: '#355388'
          },
        },

        dark: {
          text: {
            DEFAULT: '#E0E0E0',
            secondary: '#A0A0A0',
            white: '#FFFFFF'
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
          white: '#262626',
          heart: '#FF7F84',
          warning: '#FF5555',
          anchor: {
            DEFAULT: '#6BA4FF',
            hover: '#9CC3FF'
          },
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

