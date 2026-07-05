import { smokeFreeDaysInProgressFromStreakStart } from "@/utils/goals/goalStreakProgress";
import { dailyContentSlot } from "@/utils/push/dailyContentSlot";
import { pickMotivationForLocalNotification } from "@/utils/push/pickMotivationForLocalNotification";

function firstName(username: string | null | undefined): string {
  return username?.trim().split(/\s+/)[0] || "Friend";
}

function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}

export function buildMotivationLocalNotificationCopy(input: {
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
  streakStart: number | null | undefined;
  fireAt: Date;
}): { title: string; body: string } {
  const name = firstName(input.username);
  const rotationSlot = dailyContentSlot(input.fireAt);
  const line = pickMotivationForLocalNotification({
    userId: input.userId,
    rotationSlot,
    motivationCardIndex: input.motivationCardIndex,
  });
  const days = input.streakStart
    ? smokeFreeDaysInProgressFromStreakStart(input.streakStart, input.fireAt.getTime())
    : 0;
  const streakLine = days > 0 ? ` ${days} ${pluralize(days, "day")} strong.` : "";

  return {
    title: `❤️ We believe in you, ${name}`,
    body: `${line}${streakLine}`,
  };
}
