import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        iron: "#18201c",
        field: "#365f35",
        brass: "#c88f36",
        clay: "#965d41",
        skycut: "#2f637a",
        paper: "#f7f5ec",
      },
      boxShadow: {
        premium: "0 28px 80px rgba(20, 28, 22, 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
