/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",    // móviles pequeños
        sm: "640px",    // móviles normales
        md: "768px",    // tablets
        lg: "1024px",   // portátiles
        xl: "1280px",   // pantallas grandes
        "2xl": "1536px" // monitores
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "3rem",
          "2xl": "4rem"
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#1c1c1e",     
        secondary: "#f5f5f7",   
        accent: "#0071e3",      
        dark: "#000000",
        light: "#ffffff",
      },
    },
  },
  plugins: [],
};
