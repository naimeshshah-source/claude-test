import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdfcf7",
        ink: "#1a1a1a",
        "gain-green": "#1f8a3a",
        "loss-red": "#c8341c",
      },
      fontFamily: {
        caveat: ["var(--font-caveat)", "cursive"],
        kalam: ["var(--font-kalam)", "cursive"],
      },
      boxShadow: {
        sketch: "2px 2px 0 #1a1a1a",
        "sketch-lg": "3px 3px 0 #1a1a1a",
      },
    },
  },
  plugins: [],
};

export default config;
