import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Identidad visual "Concurso Mejor Arepa de Argentina 2026"
        marino:  "#0F2555",
        marino2: "#16336E",
        dorado:  "#D3A73B",
        dorado2: "#EAC65C",
        celeste: "#7FC1E0",
        crema:   "#FFFFFF",
        rojo:    "#C0272D",
      },
    },
  },
  plugins: [],
};
export default config;
