import { MOTIVATION_QUOTES } from "@/constants/craving/motivationQuotes";

function pickFromList<T>(items: readonly T[], seed: number): T {
  return items[((seed % items.length) + items.length) % items.length]!;
}

export function pickMotivationForLocalNotification(input: {
  userId: number;
  rotationSlot: number;
  motivationCardIndex: number;
}): string {
  const seed = input.userId + input.rotationSlot + input.motivationCardIndex;
  return pickFromList(MOTIVATION_QUOTES, seed).text;
}
