import { SCREEN_GRADIENT } from "./screenBackground";

/** Core brand orange — used for primary actions, links, and highlights. */
export const BRAND_ORANGE = "#FF7A00";

/**
 * Runtime color palettes for SVG / Ionicons / native props.
 * Tailwind `className` uses `dark:` variants separately (see tailwind.config.js).
 */
export const lightColors = {
  background: SCREEN_GRADIENT.light.top,
  primary: BRAND_ORANGE,
  primaryDark: "#CC6200",
  primaryLight: "#FF9933",
  secondary: "#FFB366",
  foreground: "#3A322C",
  mutedForeground: "#8A7B6E",
  accent: BRAND_ORANGE,
  accentSoft: "#FFF0E0",
  alert: "#DC3545",
  section: "#FFFFFF",
  border: "#F0DFCC",
  white: "#FFFFFF",
} as const;

export const darkColors = {
  background: SCREEN_GRADIENT.dark.mid,
  primary: BRAND_ORANGE,
  primaryDark: "#FF9933",
  primaryLight: "#FFB366",
  secondary: "#CC6200",
  foreground: "#F7F0E8",
  mutedForeground: "#B8A99A",
  accent: BRAND_ORANGE,
  accentSoft: "#2E2218",
  alert: "#EF5350",
  section: "#252018",
  border: "#3D3228",
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
