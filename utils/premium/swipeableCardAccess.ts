/** Number of swipeable cards free users can view (indices 0 … count − 1). */
export const FREE_SWIPEABLE_CARD_COUNT = 2;

export function isSwipeableCardIndexUnlocked(
  index: number,
  isPremium: boolean,
): boolean {
  if (isPremium) return true;
  return index >= 0 && index < FREE_SWIPEABLE_CARD_COUNT;
}

export function maxUnlockedSwipeableCardIndex(isPremium: boolean): number {
  if (isPremium) return Number.POSITIVE_INFINITY;
  return FREE_SWIPEABLE_CARD_COUNT - 1;
}
