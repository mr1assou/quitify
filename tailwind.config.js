/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: "#FF7A00",
        "primary-dark": "#CC6200",
        "primary-light": "#FF9933",
        secondary: "#FFB366",
        foreground: "#171717",
        "muted-foreground": "#737373",
        accent: "#FF7A00",
        "accent-soft": "#FFF0E0",
        alert: "#DC3545",
        section: "#FFFBF7",
        border: "#FFE8D1",
        /** Dark palette (paired via `dark:` variant) */
        /** Craving tool card backgrounds (light) */
        "craving-breathing": "#E3F4EF",
        "craving-games": "#ECE8F8",
        "craving-cards": "#FBF0E6",
        "craving-videos": "#FCE8E8",
        d: {
          bg: "#121212",
          surface: "#1E1E1E",
          elevated: "#262626",
          text: "#F5F5F5",
          muted: "#A3A3A3",
          border: "#333333",
          primary: "#FF7A00",
          accent: "#FF7A00",
          "accent-soft": "#261A0F",
          "craving-breathing": "#1A2E28",
          "craving-games": "#252033",
          "craving-cards": "#332A22",
          "craving-videos": "#332220",
        },
      },
    },
  },
  plugins: [],
};
