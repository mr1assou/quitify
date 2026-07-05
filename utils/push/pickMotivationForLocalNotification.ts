import { MOTIVATION_QUOTES } from "@/constants/craving/motivationQuotes";

function pickFromList<T>(items: readonly T[], seed: number): T {
  return items[((seed % items.length) + items.length) % items.length]!;
}

export function pickMotivationForLocalNotification(input: {
  userId: number;
  motivationCardIndex: number;
  /** Monotonic slot index so each scheduled notification gets different copy. */
  sequenceIndex: number;
}): string {
  const seed = input.userId + input.motivationCardIndex + input.sequenceIndex;
  return pickFromList(MOTIVATION_QUOTES, seed).text;
}
