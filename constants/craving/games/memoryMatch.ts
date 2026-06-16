import type { Ionicons } from "@expo/vector-icons";

export type MemorySymbol = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Light + dark tint for the icon when revealed. */
  color: { light: string; dark: string };
};

import { BRAND_ORANGE } from "@/constants/app/theme";

/** Six healthy, motivational symbols → matching pairs on the board. */
export const MEMORY_SYMBOLS: readonly MemorySymbol[] = [
  {
    id: "heart",
    icon: "heart",
    color: { light: BRAND_ORANGE, dark: "#FF9933" },
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
  {
    id: "leaf",
    icon: "leaf-outline",
    color: { light: "#3D8B4A", dark: "#8FD49A" },
  },
  {
    id: "sun",
    icon: "sunny-outline",
    color: { light: "#C48A1E", dark: "#F0C96A" },
  },
  {
    id: "bike",
    icon: "bicycle-outline",
    color: { light: "#2E6B8A", dark: "#7EC0E8" },
  },
  {
    id: "medal",
    icon: "medal-outline",
    color: { light: "#9A6B1F", dark: "#E8C07A" },
  },
] as const;

/** Round length — 3 minutes. */
export const MEMORY_MATCH_DURATION_SEC = 3 * 60;

/** Seconds to memorize all cards before play begins. */
export const MEMORY_MATCH_PREVIEW_SEC = 10;

export const MEMORY_MATCH_PAIR_COUNT = MEMORY_SYMBOLS.length;
export const MEMORY_MATCH_CARD_COUNT = MEMORY_MATCH_PAIR_COUNT * 2;
