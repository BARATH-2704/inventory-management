import type { Config } from "tailwindcss";
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];

// Tailwind default only goes 50–900
const safeShades = ["50","100","200","300","400","500","600","700","800","900"];

const generateThemeObject = (colors: any, invert = false) => {
  const theme: any = {};

  baseColors.forEach((color) => {
    theme[color] = {};
    safeShades.forEach((shade, i) => {
      const mappedShade = invert ? safeShades[safeShades.length - 1 - i] : shade;
      theme[color][shade] = colors[color]?.[mappedShade] ?? "#000000";
    });
  });

  return theme;
};

const lightTheme = generateThemeObject(colors, false);
const darkTheme = generateThemeObject(colors, true);

const themes = {
  light: {
    ...lightTheme,
    white: "#ffffff",
  },
  dark: {
    ...darkTheme,
    // FIXED: removed gray["950"] and gray["50"]
    white: "#111111",
    black: "#f5f5f5",
  },
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    createThemes(themes),
  ],
};

export default config;
