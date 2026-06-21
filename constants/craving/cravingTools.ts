import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export type CravingToolId =
  | "tips"
  | "motivation-cards"
  | "relax-sound"
  | "games";

/** Visual style for craving tool cards — mapped to app theme in CravingToolCard. */
export type CravingToolVariant = "soft" | "warm" | "bold" | "outline";

export type CravingTool = {
  id: CravingToolId;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: CravingToolVariant;
  href: Href;
};

export const CRAVING_TOOLS: readonly CravingTool[] = [
  {
    id: "tips",
    label: "Tips",
    description: "Practical advice",
    icon: "bulb-outline",
    variant: "outline",
    href: "/craving-tools/tips",
  },
  {
    id: "motivation-cards",
    label: "Motivational cards",
    description: "Quick boosts",
    icon: "albums-outline",
    variant: "bold",
    href: "/craving-tools/motivation-cards",
  },
  {
    id: "relax-sound",
    label: "Relax sound",
    description: "Soothing ambient sounds",
    icon: "musical-notes-outline",
    variant: "soft",
    href: "/craving-tools/relax-sound",
  },
  {
    id: "games",
    label: "Games",
    description: "Distract your mind",
    icon: "game-controller-outline",
    variant: "warm",
    href: "/craving-tools/games",
  },
] as const;

export function getCravingTool(id: CravingToolId): CravingTool {
  const tool = CRAVING_TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown craving tool: ${id}`);
  return tool;
}
