import { useEffect, useState } from "react";

type Options = {
  totalSeconds: number;
  /** Start counting immediately when the session opens. */
  autoStart?: boolean;
};

export function useCravingCountdown({ totalSeconds, autoStart = true }: Options) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;

    const id = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, remainingSeconds]);

  const isComplete = remainingSeconds <= 0;

  return {
    totalSeconds,
    remainingSeconds,
    isComplete,
    isRunning,
    pause: () => setIsRunning(false),
    resume: () => {
      if (!isComplete) setIsRunning(true);
    },
  };
}
