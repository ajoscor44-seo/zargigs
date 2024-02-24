/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false,
  theme: {
    screens: {
      sm: "480px",
      // => @media (min-width: 480px) { ... }

      md: "576px",
      // => @media (min-width: 576px) { ... }

      lg: "768px",
      // => @media (min-width: 768px) { ... }

      xl: "1024px",
      // => @media (min-width: 1024px) { ... }

      "2xl": "1680px",
      // => @media (min-width: 1680px) { ... }
    },
    extend: {
      colors: {
        primary: "#3D9970",
        primaryLight: "#14FF95",
        dark: "#000000",
      },
      fontFamily: {
        primary: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
