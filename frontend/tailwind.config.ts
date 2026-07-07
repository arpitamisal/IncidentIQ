import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        panel: "#18181B",
        borderSoft: "#27272A",
      }
    },
  },
  plugins: [],
};
export default config;
