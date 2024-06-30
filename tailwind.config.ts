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
      },
      keyframes: {
        dash: {
          to: {
            "stroke-dashoffset": "-300",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
