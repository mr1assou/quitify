import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import {
  BUBBLE_SHOOTER_LOGO_IMAGE,
  DRAG_CIGARETTES_TRASH_LOGO_IMAGE,
  MEMORY_MATCH_LOGO_IMAGE,
  REFLEX_TAP_LOGO_IMAGE,
  TAP_DESTROY_LOGO_IMAGE,
} from "@/constants/craving/games/cravingGameAssets";

export type CravingGameId =
  | "tap-destroy-cigarettes"
  | "memory-match"
  | "reflex-tap"
  | "drag-cigarettes-trash"
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
    id: "tap-destroy-cigarettes",
    title: "Tap to Destroy Cigarettes",
    description: "Smash cigarettes fast and chain combos.",
    duration: "5 min",
    icon: "flame-outline",
    logoImage: TAP_DESTROY_LOGO_IMAGE,
    href: "/craving-tools/games/tap-destroy-cigarettes",
    available: true,
    palette: {
      light: { background: "#FFE2D4", iconColor: "#C25525" },
      dark: { background: "#3A1E12", iconColor: "#F0A57E" },
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
    id: "drag-cigarettes-trash",
    title: "Color Switch",
    description: "Tap to fly through matching colors. Avoid the wrong shade.",
    duration: "Endless",
    icon: "color-palette-outline",
    logoImage: DRAG_CIGARETTES_TRASH_LOGO_IMAGE,
    href: "/craving-tools/games/drag-cigarettes-trash",
    available: true,
    palette: {
      light: { background: "#FFE0E0", iconColor: "#B23A3A" },
      dark: { background: "#3A1818", iconColor: "#F09090" },
    },
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    description: "Pop 2,000 bubbles in batches before they reach the line.",
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
