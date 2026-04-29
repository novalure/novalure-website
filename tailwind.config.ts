import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07080B",
        graphite: "#111318",
        steel: "#1B2029",
        mist: "#F4F6FA",
        line: "#DDE3EC",
        gold: "#FFD43B",
        amberdeep: "#9A7100"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 28px 90px rgba(0, 0, 0, 0.32)",
        card: "0 20px 60px rgba(8, 13, 24, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
