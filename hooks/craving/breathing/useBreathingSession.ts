import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { useBreathingCycle } from "@/hooks/craving/breathing/useBreathingCycle";
import { useBreathingSessionTimer } from "@/hooks/craving/breathing/useBreathingSessionTimer";

/** Session lifecycle: idle → active breathing + elapsed timer → finish. */
export function useBreathingSession() {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const finishingRef = useRef(false);
  const breathing = useBreathingCycle({ autoStart: false });
  const timer = useBreathingSessionTimer(isStarted);

  const { start: startBreathing, reset: resetBreathing } = breathing;
  const { start: startTimer, reset: resetTimer } = timer;

  const startSession = useCallback(() => {
    if (finishingRef.current) return;
    setIsStarted(true);
    startTimer();
    startBreathing();
  }, [startTimer, startBreathing]);

  const finishSession = useCallback(() => {
    // Prevent double/triple taps from stacking Games navigations.
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);

    resetBreathing();
    resetTimer();

    // Pop breathing → Games hub (same as other craving games).
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/craving-tools/games");
    }
  }, [resetBreathing, resetTimer]);

  return {
    isStarted,
    isFinishing,
    startSession,
    finishSession,
    elapsedMs: timer.elapsedMs,
    breathing,
  };
}
