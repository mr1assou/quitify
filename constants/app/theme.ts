/** Core brand orange — used for primary actions, links, and highlights. */
export const BRAND_ORANGE = "#FF7A00";

/**
 * Runtime color palettes for SVG / Ionicons / native props.
 * Tailwind `className` uses `dark:` variants separately (see tailwind.config.js).
 */
export const lightColors = {
  background: "#FFFFFF",
  primary: BRAND_ORANGE,
  primaryDark: "#CC6200",
  primaryLight: "#FF9933",
  secondary: "#FFB366",
  foreground: "#171717",
  mutedForeground: "#737373",
  accent: BRAND_ORANGE,
  accentSoft: "#FFF0E0",
  alert: "#DC3545",
  section: "#FFFBF7",
  border: "#FFE8D1",
  white: "#FFFFFF",
} as const;

export const darkColors = {
  background: "#121212",
  primary: BRAND_ORANGE,
  primaryDark: "#FF9933",
  primaryLight: "#FFB366",
  secondary: "#CC6200",
  foreground: "#F5F5F5",
  mutedForeground: "#A3A3A3",
  accent: BRAND_ORANGE,
  accentSoft: "#261A0F",
  alert: "#EF5350",
  section: "#1E1E1E",
  border: "#333333",
  white: "#FFFFFF",
} as const;

export type ThemeColors = typeof lightColors;
export type ThemeResolved = "light" | "dark";

export function getThemeColors(resolved: ThemeResolved): ThemeColors {
  return resolved === "dark" ? darkColors : lightColors;
}

/** @deprecated Use `useTheme().colors` in components */
export const colors = lightColors;

export type ColorToken = keyof ThemeColors;
