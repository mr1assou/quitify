/**
 * Runtime color palettes for SVG / Ionicons / native props.
 * Tailwind `className` uses `dark:` variants separately (see tailwind.config.js).
 *
 * Brand palette is warm brown + cream. The `accent` slot is a coral terracotta
 * used for "win / unlocked / resisted" — intentionally NOT green.
 */
export const lightColors = {
  background: "#FFFFFF",
  primary: "#795548",
  primaryDark: "#3E2723",
  primaryLight: "#A1887F",
  secondary: "#BC9C88",
  foreground: "#2A1A12",
  mutedForeground: "#7A6E66",
  accent: "#E0825A",
  accentSoft: "#F4D6C5",
  alert: "#DC3545",
  section: "#F8F5F2",
  border: "#EFE6DF",
  white: "#FFFFFF",
} as const;

export const darkColors = {
  background: "#100D0B",
  primary: "#D7B8A3",
  primaryDark: "#F5E9DF",
  primaryLight: "#EDD9C8",
  secondary: "#8D735F",
  foreground: "#F5EFE9",
  mutedForeground: "#A89F97",
  accent: "#F09775",
  accentSoft: "#3A2A21",
  alert: "#EF5350",
  section: "#1B1613",
  border: "#2E2622",
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
