type LockedDayCopy = {
  title: string;
  message: string;
};

/** Copy shown when the user taps a locked plan day on the map. */
export function getPlanDayLockedCopy(day: number): LockedDayCopy {
  if (day <= 1) {
    return {
      title: "Not available yet",
      message: "Your plan unlocks when your quit day begins. Start your quit journey to open Day 1.",
    };
  }

  const previousDay = day - 1;

  return {
    title: `Day ${day} is locked`,
    message: `Mark all tasks on Day ${previousDay} as done to open Day ${day}.`,
  };
}
