import type { CravingTip } from "@/types/craving";

export type { CravingTip } from "@/types/craving";

export const CRAVING_TIPS: readonly CravingTip[] = [
  {
    id: "minutes",
    title: "Cravings last minutes",
    body: "Most urges fade in under 5 minutes whether you smoke or not.",
  },
  {
    id: "water",
    title: "Drink water now",
    body: "A glass of cold water blunts the urge and gives your hands something to do.",
  },
  {
    id: "breathe",
    title: "Slow your breath",
    body: "Breathe in for 4, hold 4, out for 6. Your nervous system follows your breath.",
  },
  {
    id: "move",
    title: "Move 60 seconds",
    body: "Stand up. Stretch. Walk to another room. Motion breaks the craving loop.",
  },
  {
    id: "name-it",
    title: "Name the feeling",
    body: "Bored? Stressed? Lonely? The urge is rarely about nicotine alone.",
  },
  {
    id: "delay",
    title: "Delay, don't deny",
    body: "Tell yourself: not now, maybe later. Later almost never comes.",
  },
  {
    id: "future",
    title: "Future you is watching",
    body: "Imagine yourself tomorrow proud you held the line tonight.",
  },
] as const;

export function nextTip(currentId?: string): CravingTip {
  if (!currentId) return CRAVING_TIPS[0];
  const idx = CRAVING_TIPS.findIndex((t) => t.id === currentId);
  return CRAVING_TIPS[(idx + 1) % CRAVING_TIPS.length];
}
