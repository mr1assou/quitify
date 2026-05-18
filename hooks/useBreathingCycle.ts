import { useCallback, useEffect, useRef, useState } from "react";

import { BREATHING_PHASES, type BreathingPhase } from "@/constants/breathing";

type Options = {
  /** Start the cycle as soon as the hook mounts. */
  autoStart?: boolean;
};

type State = {
  phase: BreathingPhase;
  phaseIndex: number;
  cycle: number;
  isRunning: boolean;
};

/**
 * Drives the breathing loop: phase progression, cycle counter, and play/pause.
 * Animation should react to the returned `phase` (e.g. via shared values).
 */
export function useBreathingCycle({ autoStart = false }: Options = {}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    const current = BREATHING_PHASES[phaseIndex];
    timeoutRef.current = setTimeout(() => {
      setPhaseIndex((prev) => {
        const next = (prev + 1) % BREATHING_PHASES.length;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, current.durationMs);

    return clearTimer;
  }, [isRunning, phaseIndex]);

  const reset = useCallback(() => {
    clearTimer();
    setPhaseIndex(0);
    setCycle(1);
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setPhaseIndex(0);
    setCycle(1);
    setIsRunning(true);
  }, []);

  const toggle = useCallback(() => setIsRunning((r) => !r), []);

  const state: State = {
    phase: BREATHING_PHASES[phaseIndex],
    phaseIndex,
    cycle,
    isRunning,
  };

  return { ...state, toggle, reset, start };
}
