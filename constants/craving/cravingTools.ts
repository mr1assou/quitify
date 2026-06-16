import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";

export type CravingToolId =
  | "breathing"
  | "games"
  | "motivation-cards"
  | "tips";

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
    id: "breathing",
    label: "Breathing",
    description: "Calm your body",
    icon: "leaf-outline",
    variant: "soft",
    href: "/craving-tools/breathing",
  },
  {
    id: "games",
    label: "Games",
    description: "Distract your mind",
    icon: "game-controller-outline",
    variant: "warm",
    href: "/craving-tools/games",
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
    id: "tips",
    label: "Tips",
    description: "Practical advice",
    icon: "bulb-outline",
    variant: "outline",
    href: "/craving-tools/tips",
  },
] as const;

export function getCravingTool(id: CravingToolId): CravingTool {
  const tool = CRAVING_TOOLS.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown craving tool: ${id}`);
  return tool;
}
