import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import {
  BREATHING_LOGO_IMAGE,
  BUBBLE_SHOOTER_LOGO_IMAGE,
  MEMORY_MATCH_LOGO_IMAGE,
  REFLEX_TAP_LOGO_IMAGE,
} from "@/constants/craving/games/cravingGameAssets";

export type CravingGameId =
  | "breathing"
  | "memory-match"
  | "reflex-tap"
  | "bubble-shooter";

export type CravingGamePalette = {
  light: { background: string; iconColor: string };
  dark: { background: string; iconColor: string };
};

export type CravingGame = {
  id: CravingGameId;
  title: string;
  description: string;
  /** Short label e.g. "~1 min". */
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Optional artwork for list cards (falls back to icon). */
  logoImage?: ImageSourcePropType;
  /** How the hub card fills its logo area. Use `cover` for tall assets. */
  logoCardFit?: "contain" | "cover";
  href: Href;
  /** When false, card is visible but not tappable yet. */
  available: boolean;
  palette: CravingGamePalette;
};

export const CRAVING_GAMES: readonly CravingGame[] = [
  {
    id: "breathing",
    title: "Breathing Exercise",
    description: "Calm your body with guided breathing.",
    duration: "2–5 min",
    icon: "leaf-outline",
    logoImage: BREATHING_LOGO_IMAGE,
    href: "/craving-tools/games/breathing",
    available: true,
    palette: {
      light: { background: "#E8F5EC", iconColor: "#2E7D4E" },
      dark: { background: "#1A2E22", iconColor: "#7BC99A" },
    },
  },
  {
    id: "memory-match",
    title: "Memory Match Game",
    description: "Flip and match pairs to focus your mind.",
    duration: "3 min",
    icon: "grid-outline",
    logoImage: MEMORY_MATCH_LOGO_IMAGE,
    href: "/craving-tools/games/memory-match",
    available: true,
    palette: {
      light: { background: "#E3EBFF", iconColor: "#3A60C6" },
      dark: { background: "#1A2238", iconColor: "#9FB6F0" },
    },
  },
  {
    id: "reflex-tap",
    title: "Cigarette Ninja",
    description: "Swipe to slice flying cigarettes. Reach the score goal to win.",
    duration: "2:50",
    icon: "flash-outline",
    logoImage: REFLEX_TAP_LOGO_IMAGE,
    href: "/craving-tools/games/reflex-tap",
    available: true,
    palette: {
      light: { background: "#FFF1D6", iconColor: "#B07A1E" },
      dark: { background: "#3A2E14", iconColor: "#E8C57A" },
    },
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    description: "Pop 4,000 bubbles in batches before they reach the line.",
    duration: "Open play",
    icon: "ellipse-outline",
    logoImage: BUBBLE_SHOOTER_LOGO_IMAGE,
    logoCardFit: "cover",
    href: "/craving-tools/games/bubble-shooter",
    available: true,
    palette: {
      light: { background: "#E8F4FF", iconColor: "#2B7FD4" },
      dark: { background: "#142433", iconColor: "#8FC4F5" },
    },
  },
] as const;

export function getCravingGame(id: string): CravingGame | undefined {
  return CRAVING_GAMES.find((g) => g.id === id);
}
