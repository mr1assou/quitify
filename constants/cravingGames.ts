import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ImageSourcePropType } from "react-native";

import {
  CALM_FOCUS_PUZZLE_LOGO_IMAGE,
  DRAG_CIGARETTES_TRASH_LOGO_IMAGE,
  HOLD_TO_CONTROL_LOGO_IMAGE,
  MEMORY_MATCH_LOGO_IMAGE,
  REFLEX_TAP_LOGO_IMAGE,
  TAP_DESTROY_LOGO_IMAGE,
} from "@/constants/cravingGameAssets";

export type CravingGameId =
  | "tap-destroy-cigarettes"
  | "memory-match"
  | "reflex-tap"
  | "drag-cigarettes-trash"
  | "calm-focus-puzzle"
  | "hold-to-control"
  | "tic-tac-toe"
  | "puzzle";

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
  href: Href;
  /** When false, card is visible but not tappable yet. */
  available: boolean;
  palette: CravingGamePalette;
};

export const CRAVING_GAMES: readonly CravingGame[] = [
  {
    id: "tap-destroy-cigarettes",
    title: "Tap to Destroy Cigarettes",
    description: "Smash cigarettes by tapping them as fast as you can.",
    duration: "~1 min",
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
    duration: "~2 min",
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
    title: "Reflex Tap Game",
    description: "Tap the right target before it disappears.",
    duration: "~1 min",
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
    title: "Drag Cigarettes to Trash",
    description: "Drag every cigarette into the trash bin.",
    duration: "~1 min",
    icon: "trash-outline",
    logoImage: DRAG_CIGARETTES_TRASH_LOGO_IMAGE,
    href: "/craving-tools/games/drag-cigarettes-trash",
    available: true,
    palette: {
      light: { background: "#FFE0E0", iconColor: "#B23A3A" },
      dark: { background: "#3A1818", iconColor: "#F09090" },
    },
  },
  {
    id: "calm-focus-puzzle",
    title: "Calm Focus Puzzle",
    description: "Solve a soft, slow puzzle to calm your mind.",
    duration: "~2 min",
    icon: "extension-puzzle-outline",
    logoImage: CALM_FOCUS_PUZZLE_LOGO_IMAGE,
    href: "/craving-tools/games/calm-focus-puzzle",
    available: true,
    palette: {
      light: { background: "#E5F1E1", iconColor: "#3B7A3B" },
      dark: { background: "#16291A", iconColor: "#A4D7A7" },
    },
  },
  {
    id: "hold-to-control",
    title: "Hold-to-Control Challenge",
    description: "Press and hold to feel back in control.",
    duration: "~1 min",
    icon: "hand-left-outline",
    logoImage: HOLD_TO_CONTROL_LOGO_IMAGE,
    href: "/craving-tools/games/hold-to-control",
    available: true,
    palette: {
      light: { background: "#EFE3FB", iconColor: "#6A3FB0" },
      dark: { background: "#241830", iconColor: "#C4A6F0" },
    },
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Play a quick round to shift your focus.",
    duration: "~2 min",
    icon: "apps-outline",
    logoImage: TAP_DESTROY_LOGO_IMAGE,
    href: "/craving-tools/games/tic-tac-toe",
    available: true,
    palette: {
      light: { background: "#FFEBF1", iconColor: "#C03A6B" },
      dark: { background: "#33161F", iconColor: "#F3A0BD" },
    },
  },
  {
    id: "puzzle",
    title: "Puzzle",
    description: "Slide pieces and rebuild the picture.",
    duration: "~2 min",
    icon: "shapes-outline",
    logoImage: TAP_DESTROY_LOGO_IMAGE,
    href: "/craving-tools/games/puzzle",
    available: true,
    palette: {
      light: { background: "#E0F0EE", iconColor: "#1F6B6B" },
      dark: { background: "#0F2A2A", iconColor: "#8FD3D3" },
    },
  },
] as const;

export function getCravingGame(id: string): CravingGame | undefined {
  return CRAVING_GAMES.find((g) => g.id === id);
}
