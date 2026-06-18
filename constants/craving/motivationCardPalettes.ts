import type { MotivationCardPalette } from "./motivationCardTypes";

/** Gradient palette per quote category (15 themes). */
export const MOTIVATION_CATEGORY_PALETTES = {
  "Health & Body": {
    gradientTop: "#B5E8B5",
    gradientBottom: "#5BB07C",
    text: "#0F2117",
    muted: "#0F211799",
    accent: "#FFFFFF66",
  },
  "Freedom & Control": {
    gradientTop: "#8FB7FF",
    gradientBottom: "#4A78DC",
    text: "#0B1531",
    muted: "#0B153199",
    accent: "#FFFFFF66",
  },
  "Money & Savings": {
    gradientTop: "#FFE48A",
    gradientBottom: "#E0A23C",
    text: "#231806",
    muted: "#23180699",
    accent: "#FFFFFF66",
  },
  "Family & Loved Ones": {
    gradientTop: "#FFC8D6",
    gradientBottom: "#E55C82",
    text: "#240914",
    muted: "#24091499",
    accent: "#FFFFFF66",
  },
  "Strength & Willpower": {
    gradientTop: "#FFB58A",
    gradientBottom: "#E87B4F",
    text: "#1A1209",
    muted: "#1A120999",
    accent: "#FFFFFF66",
  },
  "Progress & Milestones": {
    gradientTop: "#9CE6E6",
    gradientBottom: "#3C9D9D",
    text: "#062323",
    muted: "#06232399",
    accent: "#FFFFFF66",
  },
  "Confidence & Self-Image": {
    gradientTop: "#D5B8FF",
    gradientBottom: "#8E63D6",
    text: "#160B2D",
    muted: "#160B2D99",
    accent: "#FFFFFF66",
  },
  "Future & Long-Term Life": {
    gradientTop: "#A8C4FF",
    gradientBottom: "#5A7FD4",
    text: "#0D1A3D",
    muted: "#0D1A3D99",
    accent: "#FFFFFF66",
  },
  "Craving Mindset": {
    gradientTop: "#FFBCA8",
    gradientBottom: "#D96B4A",
    text: "#2A1008",
    muted: "#2A100899",
    accent: "#FFFFFF66",
  },
  "Quick Boosts": {
    gradientTop: "#FFF0A0",
    gradientBottom: "#F0C030",
    text: "#2A2000",
    muted: "#2A200099",
    accent: "#FFFFFF66",
  },
  "Self-Care & Wellbeing": {
    gradientTop: "#C8F0E0",
    gradientBottom: "#6BB89A",
    text: "#0A2418",
    muted: "#0A241899",
    accent: "#FFFFFF66",
  },
  "Identity & New Beginnings": {
    gradientTop: "#E0C8FF",
    gradientBottom: "#9B6FD4",
    text: "#1A0D2E",
    muted: "#1A0D2E99",
    accent: "#FFFFFF66",
  },
  "Resilience & Setbacks": {
    gradientTop: "#7EB8E8",
    gradientBottom: "#3A7AB8",
    text: "#081828",
    muted: "#08182899",
    accent: "#FFFFFF66",
  },
  "Energy & Vitality": {
    gradientTop: "#A0F0C8",
    gradientBottom: "#40B878",
    text: "#082818",
    muted: "#08281899",
    accent: "#FFFFFF66",
  },
  "Reflection & Gratitude": {
    gradientTop: "#FFD8B0",
    gradientBottom: "#E09050",
    text: "#281808",
    muted: "#28180899",
    accent: "#FFFFFF66",
  },
} as const satisfies Record<string, MotivationCardPalette>;

export type MotivationCardCategory = keyof typeof MOTIVATION_CATEGORY_PALETTES;
