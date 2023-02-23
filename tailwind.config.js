/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
            '0%': {
              transform: 'translateX(0)'
             
            },
            '100%': {
              transform: 'translate(-50%)'
            },
        }
    },
    animation: {
        wiggle: 'marquee 20s linear infinite running',
    }
    },
  },
  plugins: [],
}
