export type MissionTaskType =
  | "manual"
  | "no-smoke-today"
  | "handle-craving-today"
  | "log-craving-session";

export type MissionTask = {
  id: string;
  label: string;
  type: MissionTaskType;
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

export type TodayMission = {
  mission: Mission;
  tasks: ResolvedTask[];
  completedCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
  toggleTask: (taskId: string, value: boolean) => void;
};
