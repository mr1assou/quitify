import { pickMotivationForLocalNotificationSync } from "@/utils/push/pickMotivationForLocalNotification";
import { DEFAULT_LOCALE } from "@/constants/i18n/languages";
import type { AppLocale } from "@/types/i18n/locale";

function firstName(username: string | null | undefined): string {
  return username?.trim().split(/\s+/)[0] || "Friend";
}

function pickFromList<T>(items: readonly T[], seed: number): T {
  return items[((seed % items.length) + items.length) % items.length]!;
}

/** Rotating local-notification titles (✨ instead of ❤️). */
const MOTIVATION_LOCAL_TITLE_TEMPLATES = [
  (name: string) => `✨ We believe in you, ${name}`,
  (name: string) => `✨ You've got this, ${name}`,
  (name: string) => `✨ Keep going, ${name}`,
  (name: string) => `✨ One day at a time, ${name}`,
  (name: string) => `✨ Proud of you, ${name}`,
] as const;

export function buildMotivationLocalNotificationCopy(input: {
  userId: number;
  username: string | null | undefined;
  motivationCardIndex: number;
  sequenceIndex: number;
  locale?: AppLocale;
}): { title: string; body: string } {
  const name = firstName(input.username);
  const seed = input.userId + input.motivationCardIndex + input.sequenceIndex;
  const titleTemplate = pickFromList(MOTIVATION_LOCAL_TITLE_TEMPLATES, seed);
  const line = pickMotivationForLocalNotificationSync(
    {
      userId: input.userId,
      motivationCardIndex: input.motivationCardIndex,
      sequenceIndex: input.sequenceIndex,
    },
    input.locale ?? DEFAULT_LOCALE,
  );

  return {
    title: titleTemplate(name),
    body: line,
  };
}
