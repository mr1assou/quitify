export type QuitPlanTaskType =
  | "action"
  | "breathing"
  | "fact"
  | "journal"
  | "game"
  | "checkin"
  | "audio"
  | "reward"
  | "social";

export type QuitPlanTask = {
  id: string;
  type: QuitPlanTaskType;
  title: string;
  text: string;
};

export type QuitPlanDay = {
  day: number;
  title: string;
  intro: string;
  tasks: QuitPlanTask[];
};

export type QuitPlanChapter = {
  chapter: number;
  name: string;
  role: string;
  day_start: number;
  day_end: number;
  days: QuitPlanDay[];
};

export type QuitPlan = {
  app_name: string;
  plan_name: string;
  total_days: number;
  chapters: QuitPlanChapter[];
};

export type ResolvedPlanTask = QuitPlanTask & { done: boolean; note?: string };
