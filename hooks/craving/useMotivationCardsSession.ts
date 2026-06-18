import { useSwipeableCardSession } from "./useSwipeableCardSession";

/** Swipeable motivational quotes for the craving tool. */
export function useMotivationCardsSession() {
  return useSwipeableCardSession("motivation-cards");
}
