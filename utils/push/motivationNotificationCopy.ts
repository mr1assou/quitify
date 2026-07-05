import { pickMotivationForLocalNotification } from "@/utils/push/pickMotivationForLocalNotification";

function firstName(username: string | null | undefined): string {
  return username?.trim().split(/\s+/)[0] || "Friend";
}

export function buildMotivationLocalNotificationCopy(input: {
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
  sequenceIndex: number;
}): { title: string; body: string } {
  const name = firstName(input.username);
  const line = pickMotivationForLocalNotification({
    userId: input.userId,
    motivationCardIndex: input.motivationCardIndex,
    sequenceIndex: input.sequenceIndex,
  });

  return {
    title: `❤️ We believe in you, ${name}`,
    body: line,
  };
}