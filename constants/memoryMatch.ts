import type { Ionicons } from "@expo/vector-icons";

export type MemorySymbol = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Light + dark tint for the icon when revealed. */
  color: { light: string; dark: string };
};

/** Six healthy, motivational symbols → six matching pairs (12 cards). */
export const MEMORY_SYMBOLS: readonly MemorySymbol[] = [
  {
    id: "heart",
    icon: "heart",
    color: { light: "#E0825A", dark: "#F09775" },
  },
  {
    id: "star",
    icon: "star",
    color: { light: "#C8A03C", dark: "#F0C96A" },
  },
  {
    id: "lung",
    icon: "fitness",
    color: { light: "#3B7A6A", dark: "#84CDB5" },
  },
  {
    id: "trophy",
    icon: "trophy",
    color: { light: "#B57C2A", dark: "#E8BE7A" },
  },
  {
    id: "water",
    icon: "water",
    color: { light: "#2E89A8", dark: "#84CDE4" },
  },
  {
    id: "sparkles",
    icon: "sparkles",
    color: { light: "#6A3FB0", dark: "#C4A6F0" },
  },
] as const;

export const MEMORY_MATCH_DURATION_SEC = 75;
export const MEMORY_MATCH_PAIR_COUNT = MEMORY_SYMBOLS.length;
export const MEMORY_MATCH_CARD_COUNT = MEMORY_MATCH_PAIR_COUNT * 2;
