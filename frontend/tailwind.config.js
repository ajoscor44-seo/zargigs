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
      backgroundImage: {
        "instagram-gradient":
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)",
      },
      animation: {
        "pulse-size": "pulse-size 2s infinite",
        "grow-and-fade": "grow-and-fade 3s infinite",
        "scale-up": "scaleUp 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
      },
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(0.75)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
