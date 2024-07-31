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
          background: {
            DEFAULT: '#FFFFFF',
          },
          text: {
            DEFAULT: '#333333', 
          },
          border: {
            DEFAULT: '#DDDDDD'
          },
          button: {

          }
        },
        dark: {
          background: {
            DEFAULT: '#262626'
          },
          text: {
            DEFAULT: '#F7F7F7',
          },
          border: {
            
          },
          button: {

          }
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

