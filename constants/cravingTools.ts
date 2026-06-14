import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export type CravingToolId =
  | "breathing"
  | "games"
  | "motivation-cards";

export type CravingToolColors = {
  /** Card background on the craving session grid. */
  background: string;
  /** Small tile behind the icon. */
  iconBackground: string;
  /** Icon stroke color. */
  iconColor: string;
};

export type CravingTool = {
  id: CravingToolId;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Light theme colors. */
  colors: CravingToolColors;
  /** Dark theme colors. */
  darkColors: CravingToolColors;
  href: Href;
};

export const CRAVING_TOOLS: readonly CravingTool[] = [
  {
    id: "breathing",
    label: "Breathing",
    description: "Calm your body",
    icon: "leaf-outline",
    colors: {
      background: "#E3F4EF",
      iconBackground: "#FFFFFFB3",
      iconColor: "#1F6B58",
    },
    darkColors: {
      background: "#1A2E28",
      iconBackground: "#FFFFFF1A",
      iconColor: "#7CDABF",
    },
    href: "/craving-tools/breathing",
  },
  {
    id: "games",
    label: "Games",
    description: "Distract your mind",
    icon: "game-controller-outline",
    colors: {
      background: "#ECE8F8",
      iconBackground: "#FFFFFFB3",
      iconColor: "#5142A7",
    },
    darkColors: {
      background: "#252033",
      iconBackground: "#FFFFFF1A",
      iconColor: "#BBAEEC",
    },
    href: "/craving-tools/games",
  },
  {
    id: "motivation-cards",
    label: "Motivational cards",
    description: "Quick boosts",
    icon: "albums-outline",
    colors: {
      background: "#FBF0E6",
      iconBackground: "#FFFFFFB3",
      iconColor: "#9A5A1F",
    },
    darkColors: {
      background: "#332A22",
      iconBackground: "#FFFFFF1A",
      iconColor: "#E8B27B",
    },
    href: "/craving-tools/motivation-cards",
  },
] as const;

export function getCravingTool(id: CravingToolId): CravingTool {
  const tool = CRAVING_TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown craving tool: ${id}`);
  return tool;
}
