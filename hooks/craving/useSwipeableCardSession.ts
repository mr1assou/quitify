import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useApp } from "@/context/AppContext";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { MOTIVATION_QUOTES } from "@/constants/craving/motivationQuotes";
import { TIP_QUOTES } from "@/constants/craving/tipQuotes";
import { updateUserPreferences } from "@/services/auth/preferencesApi";
import { getAccessToken } from "@/utils/auth/authStorage";

export type SwipeableCardToolId = "motivation-cards" | "tips";

const QUOTES_BY_TOOL = {
  "motivation-cards": MOTIVATION_QUOTES,
  tips: TIP_QUOTES,
} as const satisfies Record<SwipeableCardToolId, readonly MotivationQuote[]>;

function normalizeIndex(index: number, total: number): number {
  if (total === 0) return 0;
  return ((index % total) + total) % total;
}

function savedIndexForTool(
  tool: SwipeableCardToolId,
  account: ReturnType<typeof useApp>["state"]["account"],
): number {
  if (!account) return 0;
  return tool === "motivation-cards"
    ? (account.motivationCardIndex ?? 0)
    : (account.tipsCardIndex ?? 0);
}

/** Swipeable cards with index restored from the server and saved on screen exit. */
export function useSwipeableCardSession(tool: SwipeableCardToolId) {
  const quotes = QUOTES_BY_TOOL[tool];
  const total = quotes.length;
  const { state, setAccount } = useApp();
  const savedIndex = savedIndexForTool(tool, state.account);

  const [currentIndex, setCurrentIndex] = useState(() =>
    normalizeIndex(savedIndex, total),
  );

  const savedRef = useRef(savedIndex);
  const currentRef = useRef(currentIndex);
  const swipedRef = useRef(false);
  const accountRef = useRef(state.account);
  accountRef.current = state.account;

  useEffect(() => {
    currentRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    savedRef.current = savedIndex;
    if (!swipedRef.current) {
      setCurrentIndex(normalizeIndex(savedIndex, total));
    }
  }, [savedIndex, total]);

  const goToIndex = useCallback(
    (index: number) => {
      if (total === 0) return;
      swipedRef.current = true;
      setCurrentIndex(normalizeIndex(index, total));
    },
    [total],
  );

  const persistOnLeave = useCallback(async () => {
    if (!swipedRef.current) return;

    const nextIndex = currentRef.current;
    if (nextIndex === savedRef.current) return;

    const token = await getAccessToken();
    if (!token) return;

    const payload =
      tool === "motivation-cards"
        ? { motivationCardIndex: nextIndex }
        : { tipsCardIndex: nextIndex };

    try {
      await updateUserPreferences(payload);
      savedRef.current = nextIndex;
      swipedRef.current = false;

      const account = accountRef.current;
      if (account) {
        setAccount({ ...account, ...payload });
      }
    } catch {
      // Keep local progress; will retry on the next visit.
    }
  }, [setAccount, tool]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        void persistOnLeave();
      };
    }, [persistOnLeave]),
  );

  return {
    quotes,
    currentIndex,
    goToIndex,
  };
}
