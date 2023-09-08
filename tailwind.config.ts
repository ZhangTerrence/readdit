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
        primary: "#F1F3F4",
        secondary: "#DEE1E6",
        tertiary: "#535353",
        contrast: "#202124",
      },
    },
  },
  plugins: [],
};
export default config;
