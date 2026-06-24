export type MissionTaskType =
  | "manual"
  | "no-smoke-today"
  | "handle-craving-today"
  | "log-craving-session";

export type MissionTask = {
  id: string;
  label: string;
  type: MissionTaskType;
  /** Longer guidance shown on the plan task swipe card. */
  detail?: string;
};

export type Mission = {
  day: number;
  title: string;
  description: string;
  tasks: MissionTask[];
};

export type MissionLog = {
  dayKey: string;
  missionDay: number;
  taskStates: Record<string, boolean>;
  completedAt?: number;
};

export type ResolvedTask = MissionTask & { done: boolean };

import type { ResolvedPlanTask } from "./quitPlan";

export type TodayMission = {
  day: number;
  title: string;
  intro: string;
  tasks: ResolvedPlanTask[];
  completedCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
  toggleTask: (taskId: string, value: boolean) => void;
};
