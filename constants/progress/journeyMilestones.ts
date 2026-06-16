/**
 * Journey milestones reinforce the streak ladder.
 * Day numbers are anchored to the user's `streakStart`.
 */
export const JOURNEY_DAYS: readonly { day: number; label: string; description: string }[] = [
  { day: 1, label: "Day 1", description: "You made it through the hardest day." },
  { day: 3, label: "Day 3", description: "Nicotine is leaving your body." },
  { day: 7, label: "1 week", description: "Cravings are already shorter." },
  { day: 14, label: "2 weeks", description: "Breathing feels easier now." },
  { day: 30, label: "1 month", description: "A full month — habits are reforming." },
  { day: 60, label: "2 months", description: "Lungs and circulation are recovering." },
  { day: 90, label: "3 months", description: "Lung capacity has grown noticeably." },
  { day: 180, label: "6 months", description: "Half a year of choosing yourself." },
  { day: 365, label: "1 year", description: "A full year smoke-free." },
];
