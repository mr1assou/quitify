export const ACHIEVEMENT_SECTIONS = [
  { id: "rank", label: "Rank" },
  { id: "badges", label: "Badges" },
] as const;

export type AchievementSection = (typeof ACHIEVEMENT_SECTIONS)[number]["id"];
