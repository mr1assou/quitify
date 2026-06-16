import type { RecoveryRingDefinition } from "@/types/progress/recovery";

export const RECOVERY_RINGS: readonly RecoveryRingDefinition[] = [
  {
    id: "nicotine",
    icon: { family: "ionicons", name: "water" },
    label: "Nicotine Cleared",
    accent: "primary",
  },
  {
    id: "breathing",
    icon: { family: "ionicons", name: "fitness-outline" },
    label: "Breathing Recovery",
    accent: "accent",
  },
  {
    id: "heart",
    icon: { family: "ionicons", name: "heart" },
    label: "Heart Health",
    accent: "primary",
  },
];
