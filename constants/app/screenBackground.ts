/** Full-screen gradient stops — shared with paywall and main app canvas. */
export const SCREEN_GRADIENT = {
  light: {
    top: "#FFFBF7",
    mid: "#FFF4E8",
    bottom: "#FFE8D1",
  },
  dark: {
    top: "#221810",
    mid: "#1A1410",
    bottom: "#120E0A",
  },
} as const;

/** Native splash letterbox color (solid — OS does not support gradient splash). */
export const SPLASH_BACKGROUND = {
  light: SCREEN_GRADIENT.light.top,
  dark: SCREEN_GRADIENT.dark.mid,
} as const;

export type ScreenGradientStops = (typeof SCREEN_GRADIENT)["light"];
