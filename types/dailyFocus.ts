import type { Ionicons } from "@expo/vector-icons";

type IonName = keyof typeof Ionicons.glyphMap;

export type AutoMissionId = "smoke-free-today" | "reach-24h" | "avoid-cigarettes";

export type SupportMissionId = "log-craving" | "resist-craving";

export type DailyMissionAccent = "primary" | "accent" | "alert";

export type AutoMissionDefinition = {
  id: AutoMissionId;
  icon: IonName;
  title: string;
  /** Short label used to describe the unit (e.g. "of 24h", "cigs"). */
  unitLabel: (target: number) => string;
  accent: DailyMissionAccent;
};

export type SupportMissionDefinition = {
  id: SupportMissionId;
  icon: IonName;
  title: string;
  /** XP rewarded each time the user advances by one. */
  xpPerStep: number;
  accent: DailyMissionAccent;
};

export type AutoMissionState = {
  id: AutoMissionId;
  title: string;
  icon: IonName;
  current: number;
  target: number;
  /** 0..1 */
  progress: number;
  done: boolean;
  unitLabel: string;
  accent: DailyMissionAccent;
};

export type SupportMissionState = {
  id: SupportMissionId;
  title: string;
  icon: IonName;
  current: number;
  cap: number;
  xpPerStep: number;
  /** 0..1 */
  progress: number;
  capped: boolean;
  accent: DailyMissionAccent;
};

export type DailyFocus = {
  auto: AutoMissionState[];
  support: SupportMissionState[];
  /** Completed auto missions today (used as the headline counter). */
  completedAuto: number;
  totalAuto: number;
  /** Average progress across auto missions. */
  overallProgress: number;
  /** True when every auto mission is done → bonus unlocked. */
  bonusUnlocked: boolean;
  bonusXp: number;
};
