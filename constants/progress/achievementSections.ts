export const ACHIEVEMENT_SECTIONS = [
  { id: "badges", label: "Badges" },
  { id: "rank", label: "Global Rank" },
] as const;

export type AchievementSection = (typeof ACHIEVEMENT_SECTIONS)[number]["id"];
