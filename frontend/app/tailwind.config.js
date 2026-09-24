/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "576px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1680px",
    },
    extend: {
      colors: {
        primary: "#1c933f",
        primaryLight: "#14FF95",
        dark: "#000000",
      },
      fontFamily: {
        sans: ["'Bricolage Grotesque'", "sans-serif"],
        primary: ["'Bricolage Grotesque'", "sans-serif"],
        heading: ["'Bricolage Grotesque'", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
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
