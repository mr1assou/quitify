import type { GoalType } from "@/types/goals/goal";

export type GoalTypeConfig = {
  id: GoalType;
  title: string;
  icon: "cash" | "flame" | "ban";
  presets: readonly number[];
};

export const GOAL_TYPES: readonly GoalTypeConfig[] = [
  {
    id: "money_saved",
    title: "Money saved",
    icon: "cash",
    presets: [25, 50, 100, 200],
  },
  {
    id: "smoke_free_days",
    title: "Smoke-free days",
    icon: "flame",
    presets: [7, 14, 30, 60],
  },
  {
    id: "cigarettes_avoided",
    title: "Cigarettes avoided",
    icon: "ban",
    presets: [50, 100, 200, 500],
  },
] as const;

export function getGoalTypeConfig(type: GoalType): GoalTypeConfig {
  const config = GOAL_TYPES.find((g) => g.id === type);
  if (!config) throw new Error(`Unknown goal type: ${type}`);
  return config;
}
