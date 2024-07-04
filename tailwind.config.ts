import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        dash: "dash 20s linear infinite",
        wiggle: "wiggle 750ms ease-in-out infinite",
      },
      keyframes: {
        dash: {
          to: {
            "stroke-dashoffset": "-300",
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-1deg)",
          },
          "50%": {
            transform: "rotate(1deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
