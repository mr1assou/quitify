import { useCallback, useEffect } from "react";

import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import {
  isSwipeableCardIndexUnlocked,
  maxUnlockedSwipeableCardIndex,
} from "@/utils/premium/swipeableCardAccess";

import {
  useSwipeableCardSession,
  type SwipeableCardToolId,
} from "./useSwipeableCardSession";

/** Swipeable card session with a free-tier swipe limit before paywall. */
export function usePremiumLimitedSwipeableSession(tool: SwipeableCardToolId) {
  const { isPremium, requirePremium } = usePremiumGate();
  const session = useSwipeableCardSession(tool);

  const goToIndex = useCallback(
    (index: number) => {
      if (!isSwipeableCardIndexUnlocked(index, isPremium)) {
        requirePremium();
        return;
      }
      session.goToIndex(index);
    },
    [isPremium, requirePremium, session.goToIndex],
  );

  const canGoToIndex = useCallback(
    (index: number) => isSwipeableCardIndexUnlocked(index, isPremium),
    [isPremium],
  );

  useEffect(() => {
    if (isPremium) return;
    const maxIndex = maxUnlockedSwipeableCardIndex(isPremium);
    if (session.currentIndex > maxIndex) {
      session.goToIndex(maxIndex);
    }
  }, [isPremium, session.currentIndex, session.goToIndex]);

  return {
    ...session,
    goToIndex,
    canGoToIndex,
    requirePremium,
    /** Always show full catalog size (e.g. 2/1500); free users still only unlock 2 cards. */
    displayTotal: session.quotes.length,
  };
}
