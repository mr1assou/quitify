export type Badge = {
  id: string;
  name: string;
  description: string;
  daysRequired: number;
  /** Total Freedom Points required alongside the streak milestone. */
  fpRequired: number;
  goalsCompletedRequired: number;
  accent: string;
  premium?: boolean;
};

export type BadgeProgress = {
  current: Badge | null;
  next: Badge | null;
  /** 0..1 between the previous and next milestone. */
  progress: number;
};

export type HealthMilestone = {
  id: string;
  hoursRequired: number;
  title: string;
  body: string;
};
