/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      bebas: ['Bebas Neue', 'sans-serif'],
      inter: ['Inter', 'serif'],
    },
    colors: {
      black: {
        10: "#181818",
        20: "rgba(0, 0, 0, 0.6)",
        30: "rgb(17, 24, 39)",
        40: "#141414",
        50: "rgb(20, 20, 20)",
      },
      gray: {
        10: 'rgb(119, 119, 119)',
        20: 'rgb(156, 163, 175)',
        30: 'rgba(42, 42, 42, 0.5)',
        40: 'rgba(42, 42, 42, 0.6)'
      },
      white: {
        10: 'rgba(255, 255, 255, 1)',
        20: 'rgba(243, 244, 246, 1)',
        30: 'rgb(209, 213, 219)',
      },
      green: {
        10: 'rgba(110, 231, 183, 1)',
      },
      red: {
        10: 'rgb(220, 38, 38)',
        20: 'rgba(185, 28, 28, 1)'
      },
      blue: {
        10: 'rgba(75, 85, 99, 1)',
        20: 'rgb(55, 65, 81)'
      }
    },
  },
  plugins: [],
};
