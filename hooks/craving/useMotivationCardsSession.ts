import { router } from "expo-router";
import { useCallback, useState } from "react";

import { MOTIVATION_QUOTES } from "@/constants/craving/motivationQuotes";
import { useElapsedTimer } from "@/hooks/shared/useElapsedTimer";

/** Idle → active session for the motivational-cards tool. */
export function useMotivationCardsSession() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timer = useElapsedTimer(isStarted);

  const { start: startTimer, reset: resetTimer } = timer;

  const startSession = useCallback(() => {
    setIsStarted(true);
    setCurrentIndex(0);
    startTimer();
  }, [startTimer]);

  const finishSession = useCallback(() => {
    resetTimer();
    setIsStarted(false);
    setCurrentIndex(0);
    router.back();
  }, [resetTimer]);

  const goToIndex = useCallback((index: number) => {
    if (MOTIVATION_QUOTES.length === 0) return;
    const safe = ((index % MOTIVATION_QUOTES.length) + MOTIVATION_QUOTES.length) %
      MOTIVATION_QUOTES.length;
    setCurrentIndex(safe);
  }, []);

  return {
    isStarted,
    startSession,
    finishSession,
    elapsedMs: timer.elapsedMs,
    quotes: MOTIVATION_QUOTES,
    currentIndex,
    goToIndex,
  };
}
