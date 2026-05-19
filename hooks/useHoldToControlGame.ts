import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  HOLD_TO_CONTROL_TICK_MS,
  HOLD_TO_CONTROL_TOTAL_WAVES,
  HOLD_TO_CONTROL_WAVE_BONUS,
  HOLD_TO_CONTROL_WAVE_PAUSE_MS,
  HOLD_TO_CONTROL_WAVE_SCORE,
  HOLD_TO_CONTROL_WAVE_SEC,
} from "@/constants/holdToControl";

export type HoldToControlStatus = "idle" | "playing" | "finished";

/** Between waves we show a short success state. */
export type HoldPhase = "ready" | "holding" | "wave-done";

type State = {
  status: HoldToControlStatus;
  phase: HoldPhase;
  roundIndex: number;
  /** 0..1 progress for the current hold. */
  holdProgress: number;
  isHolding: boolean;
  completedWaves: number;
  score: number;
  totalHoldMs: number;
  streak: number;
  bestStreak: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "press" }
  | { type: "release" }
  | { type: "tick"; elapsedMs: number }
  | { type: "wave-complete" }
  | { type: "wave-done-dismiss" };

function waveTargetMs(roundIndex: number): number {
  const sec = HOLD_TO_CONTROL_WAVE_SEC[roundIndex] ?? 8;
  return sec * 1000;
}

const initialState: State = {
  status: "idle",
  phase: "ready",
  roundIndex: 0,
  holdProgress: 0,
  isHolding: false,
  completedWaves: 0,
  score: 0,
  totalHoldMs: 0,
  streak: 0,
  bestStreak: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { ...initialState, status: "playing" };
    case "reset":
      return initialState();
    case "finish":
      return { ...state, status: "finished", isHolding: false };
    case "press":
      if (state.status !== "playing" || state.phase === "wave-done") return state;
      return { ...state, phase: "holding", isHolding: true };
    case "release":
      if (state.status !== "playing" || !state.isHolding) return state;
      // Released early — reset progress for this wave, break streak.
      return {
        ...state,
        phase: "ready",
        isHolding: false,
        holdProgress: 0,
        streak: 0,
      };
    case "tick": {
      if (state.status !== "playing" || !state.isHolding) return state;
      const target = waveTargetMs(state.roundIndex);
      const progress = Math.min(1, action.elapsedMs / target);
      return {
        ...state,
        holdProgress: progress,
        totalHoldMs: state.totalHoldMs + HOLD_TO_CONTROL_TICK_MS,
      };
    }
    case "wave-complete": {
      if (state.status !== "playing") return state;
      const nextRound = state.roundIndex + 1;
      const waveScore =
        HOLD_TO_CONTROL_WAVE_SCORE +
        state.roundIndex * HOLD_TO_CONTROL_WAVE_BONUS;
      const newStreak = state.streak + 1;
      const newBest = Math.max(state.bestStreak, newStreak);
      if (nextRound >= HOLD_TO_CONTROL_TOTAL_WAVES) {
        return {
          ...state,
          status: "finished",
          phase: "ready",
          isHolding: false,
          holdProgress: 1,
          completedWaves: state.completedWaves + 1,
          score: state.score + waveScore,
          streak: newStreak,
          bestStreak: newBest,
        };
      }
      return {
        ...state,
        phase: "wave-done",
        isHolding: false,
        holdProgress: 0,
        roundIndex: nextRound,
        completedWaves: state.completedWaves + 1,
        score: state.score + waveScore,
        streak: newStreak,
        bestStreak: newBest,
      };
    }
    case "wave-done-dismiss":
      if (state.phase !== "wave-done") return state;
      return { ...state, phase: "ready" };
    default:
      return state;
  }
}

/** State + side-effects for the Hold-to-Control Challenge mini-game. */
export function useHoldToControlGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const holdStartedAtRef = useRef<number | null>(null);
  const wavePauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Progress tick while finger is down.
  useEffect(() => {
    if (state.status !== "playing" || !state.isHolding) {
      holdStartedAtRef.current = null;
      return;
    }
    if (holdStartedAtRef.current == null) {
      holdStartedAtRef.current = Date.now();
    }
    const id = setInterval(() => {
      if (holdStartedAtRef.current == null) return;
      const elapsed = Date.now() - holdStartedAtRef.current;
      const target = waveTargetMs(state.roundIndex);
      dispatch({ type: "tick", elapsedMs: elapsed });
      if (elapsed >= target) {
        holdStartedAtRef.current = null;
        dispatch({ type: "wave-complete" });
      }
    }, HOLD_TO_CONTROL_TICK_MS);
    return () => clearInterval(id);
  }, [state.status, state.isHolding, state.roundIndex]);

  // Auto-advance after wave-done celebration.
  useEffect(() => {
    if (state.phase !== "wave-done") return;
    wavePauseTimerRef.current = setTimeout(() => {
      dispatch({ type: "wave-done-dismiss" });
    }, HOLD_TO_CONTROL_WAVE_PAUSE_MS);
    return () => {
      if (wavePauseTimerRef.current) {
        clearTimeout(wavePauseTimerRef.current);
        wavePauseTimerRef.current = null;
      }
    };
  }, [state.phase, state.roundIndex]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);
  const press = useCallback(() => dispatch({ type: "press" }), []);
  const release = useCallback(() => dispatch({ type: "release" }), []);

  const currentWaveSec =
    HOLD_TO_CONTROL_WAVE_SEC[state.roundIndex] ??
    HOLD_TO_CONTROL_WAVE_SEC[HOLD_TO_CONTROL_WAVE_SEC.length - 1];

  return {
    status: state.status,
    phase: state.phase,
    roundIndex: state.roundIndex,
    totalWaves: HOLD_TO_CONTROL_TOTAL_WAVES,
    currentWaveSec,
    holdProgress: state.holdProgress,
    isHolding: state.isHolding,
    completedWaves: state.completedWaves,
    score: state.score,
    totalHoldMs: state.totalHoldMs,
    streak: state.streak,
    bestStreak: state.bestStreak,
    start,
    reset,
    finish,
    press,
    release,
  };
}
