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
        primary: "#795548",
        "primary-dark": "#3E2723",
        "primary-light": "#A1887F",
        secondary: "#BC9C88",
        foreground: "#2A1A12",
        "muted-foreground": "#7A6E66",
        /** Warm coral accent — replaces green for win / unlocked states */
        accent: "#E0825A",
        "accent-soft": "#F4D6C5",
        alert: "#DC3545",
        section: "#F8F5F2",
        border: "#EFE6DF",
        /** Dark palette (paired via `dark:` variant) */
        /** Craving tool card backgrounds (light) */
        "craving-breathing": "#E3F4EF",
        "craving-games": "#ECE8F8",
        "craving-cards": "#FBF0E6",
        "craving-videos": "#FCE8E8",
        d: {
          bg: "#100D0B",
          surface: "#1B1613",
          elevated: "#2A211D",
          text: "#F5EFE9",
          muted: "#A89F97",
          border: "#2E2622",
          primary: "#D7B8A3",
          accent: "#F09775",
          "accent-soft": "#3A2A21",
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
