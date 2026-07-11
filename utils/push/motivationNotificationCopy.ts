import { pickMotivationForLocalNotificationSync } from "@/utils/push/pickMotivationForLocalNotification";
import { DEFAULT_LOCALE } from "@/constants/i18n/languages";
import type { AppLocale } from "@/types/i18n/locale";

function firstName(username: string | null | undefined): string {
  return username?.trim().split(/\s+/)[0] || "Friend";
}

export function buildMotivationLocalNotificationCopy(input: {
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
  sequenceIndex: number;
  locale?: AppLocale;
}): { title: string; body: string } {
  const name = firstName(input.username);
  const line = pickMotivationForLocalNotificationSync(
    {
      userId: input.userId,
      motivationCardIndex: input.motivationCardIndex,
      sequenceIndex: input.sequenceIndex,
    },
    input.locale ?? DEFAULT_LOCALE,
  );

  return {
    title: `❤️ We believe in you, ${name}`,
    body: line,
  };
}
