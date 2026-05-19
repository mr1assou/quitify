import { router } from "expo-router";
import { useCallback, useState } from "react";

import { MOTIVATION_VIDEOS } from "@/constants/motivationVideos";
import { useElapsedTimer } from "@/hooks/useElapsedTimer";

/** Idle → active session for the motivational-videos tool. */
export function useMotivationVideosSession() {
  const [isStarted, setIsStarted] = useState(false);
  const timer = useElapsedTimer(isStarted);

  const { start: startTimer, reset: resetTimer } = timer;

  const startSession = useCallback(() => {
    setIsStarted(true);
    startTimer();
  }, [startTimer]);

  const finishSession = useCallback(() => {
    resetTimer();
    setIsStarted(false);
    router.back();
  }, [resetTimer]);

  return {
    isStarted,
    startSession,
    finishSession,
    elapsedMs: timer.elapsedMs,
    videos: MOTIVATION_VIDEOS,
  };
}
