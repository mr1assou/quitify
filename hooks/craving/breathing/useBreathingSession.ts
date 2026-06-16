import { router } from "expo-router";
import { useCallback, useState } from "react";

import { useBreathingCycle } from "@/hooks/craving/breathing/useBreathingCycle";
import { useBreathingSessionTimer } from "@/hooks/craving/breathing/useBreathingSessionTimer";

/** Session lifecycle: idle → active breathing + elapsed timer → finish. */
export function useBreathingSession() {
  const [isStarted, setIsStarted] = useState(false);
  const breathing = useBreathingCycle({ autoStart: false });
  const timer = useBreathingSessionTimer(isStarted);

  const { start: startBreathing, reset: resetBreathing } = breathing;
  const { start: startTimer, reset: resetTimer } = timer;

  const startSession = useCallback(() => {
    setIsStarted(true);
    startTimer();
    startBreathing();
  }, [startTimer, startBreathing]);

  const finishSession = useCallback(() => {
    resetBreathing();
    resetTimer();
    setIsStarted(false);
    router.replace("/(tabs)");
  }, [resetBreathing, resetTimer]);

  return {
    isStarted,
    startSession,
    finishSession,
    elapsedMs: timer.elapsedMs,
    breathing,
  };
}
