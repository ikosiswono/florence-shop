/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heavenly: {
          blue: "#0B8FCB",
          cyan: "#28D8E8",
          gold: "#DDBB72",
          "gold-light": "#F3E3A6",
          white: "#F8FBFF",
          ocean: "#063A60",
          midnight: "#061B35",
          purple: "#7664B5",
          "dark-glass": "rgba(5, 20, 40, 0.75)",
          card: "rgba(6, 27, 53, 0.75)",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Cormorant Garamond", "serif"],
        heading: ["Cinzel", "serif"],
        sans: ["Inter", "Poppins", "sans-serif"],
        nav: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(40, 216, 232, 0.35)",
        "glow-gold": "0 0 25px rgba(221, 187, 114, 0.4)",
        "glow-purple": "0 0 25px rgba(118, 100, 181, 0.4)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3E3A6 0%, #DDBB72 50%, #B88E3E 100%)",
        "cyan-gradient": "linear-gradient(135deg, #A8F5FF 0%, #28D8E8 50%, #0B8FCB 100%)",
        "purple-gradient": "linear-gradient(135deg, #A797E8 0%, #7664B5 50%, #4D3994 100%)",
      },
    },
  },
  plugins: [],
};
