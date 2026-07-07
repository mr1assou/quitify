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
        background: "#F7F4F0",
        primary: "#FF7A00",
        "primary-dark": "#CC6200",
        "primary-light": "#FF9933",
        secondary: "#E8A86A",
        foreground: "#3D3630",
        "muted-foreground": "#7A7066",
        accent: "#FF7A00",
        "accent-soft": "#EDE4DA",
        alert: "#DC3545",
        section: "#FBF8F5",
        elevated: "#F3EFE9",
        border: "#E5DDD4",
        /** Craving tool card backgrounds (light) — softened for less glare */
        "craving-breathing": "#E8F2EE",
        "craving-games": "#EEEAF4",
        "craving-cards": "#F3EBE3",
        "craving-videos": "#F5E8E8",
        d: {
          bg: "#1A1410",
          surface: "#252018",
          elevated: "#2F261E",
          text: "#F7F0E8",
          muted: "#B8A99A",
          border: "#3D3228",
          primary: "#FF7A00",
          accent: "#FF7A00",
          "accent-soft": "#2E2218",
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
