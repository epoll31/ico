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
      backgroundImage: {
        checkered: `
          linear-gradient(45deg, #00000020 25%, transparent 25%),
          linear-gradient(-45deg, #00000020 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #00000020 75%),
          linear-gradient(-45deg, transparent 75%, #00000020 75%)
        `,
      },
      backgroundSize: {
        checkered: "20px 20px",
      },
      backgroundPosition: {
        checkered: "0 0, 0 10px, 10px -10px, -10px 0",
      },
      boxShadow: {
        "xl-center":
          "0 0 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px rgb(0 0 0 / 0.1)",
        center: "0 0 3px 0 rgb(0 0 0 / 0.1), 0 0 2px 0 rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
