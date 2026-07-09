import { usePremiumLimitedSwipeableSession } from "./usePremiumLimitedSwipeableSession";

/** Swipeable motivational quotes for the craving tool. */
export function useMotivationCardsSession() {
  return usePremiumLimitedSwipeableSession("motivation-cards");
}
