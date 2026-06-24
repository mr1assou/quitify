type LockedDayCopy = {
  title: string;
  message: string;
};

/** Copy shown when the user taps a locked plan day on the map. */
export function getPlanDayLockedCopy(
  day: number,
  previousDayComplete: boolean,
): LockedDayCopy {
  if (day <= 1) {
    return {
      title: "Not available yet",
      message: "Your plan unlocks when your quit day begins. Start your quit journey to open Day 1.",
    };
  }

  const previousDay = day - 1;

  if (!previousDayComplete) {
    return {
      title: `Day ${day} is locked`,
      message: `Finish all tasks on Day ${previousDay} first. After that, Day ${day} will open at 7:00 AM in your local time.`,
    };
  }

  return {
    title: `Day ${day} opens at 7:00 AM`,
    message: `You finished Day ${previousDay}. Day ${day} will open at 7:00 AM in your local time.`,
  };
}
