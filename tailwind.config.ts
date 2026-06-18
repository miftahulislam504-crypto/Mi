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
        "space-black": "#00000f",
        "nebula-blue": "#0a0a2e",
        "star-white": "#e8f0ff",
        "core-blue": "#4a9eff",
        "community-green": "#00ff88",
        "commerce-orange": "#ff6b35",
        "business-purple": "#9b59ff",
      },
      fontFamily: {
        space: ["var(--font-space)", "monospace"],
        display: ["var(--font-display)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
