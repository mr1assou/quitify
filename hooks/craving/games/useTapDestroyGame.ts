import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  TAP_DESTROY_CIGARETTE_LIFETIME_MS,
  TAP_DESTROY_COMBO_WINDOW_MS,
  TAP_DESTROY_DURATION_SEC,
  TAP_DESTROY_INITIAL_BURST,
  TAP_DESTROY_MAX_ON_SCREEN,
  TAP_DESTROY_SPAWN_INTERVAL_MIN_MS,
  TAP_DESTROY_SPAWN_INTERVAL_MS,
} from "@/constants/craving/games/tapDestroy";
import { pickTapDestroySpawnPosition } from "@/utils/craving/games/tapDestroySpawn";

export type TapDestroyStatus = "idle" | "playing" | "finished";

export type TapDestroyCigarette = {
  id: string;
  /** Normalized 0..1 inside the play area. */
  x: number;
  y: number;
  /** Degrees, -40..40. */
  rotation: number;
};

export type TapDestroyDestroyResult = {
  scoreGain: number;
  combo: number;
};

type State = {
  status: TapDestroyStatus;
  score: number;
  combo: number;
  bestCombo: number;
  secondsLeft: number;
  cigarettes: TapDestroyCigarette[];
  lastHitAt: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "tick" }
  | { type: "spawn"; cig: TapDestroyCigarette }
  | { type: "destroy"; id: string; at: number }
  | { type: "expire"; id: string };

const initialState: State = {
  status: "idle",
  score: 0,
  combo: 0,
  bestCombo: 0,
  secondsLeft: TAP_DESTROY_DURATION_SEC,
  cigarettes: [],
  lastHitAt: 0,
};

function spawnIntervalForScore(score: number): number {
  const speedUp = Math.floor(score / 4) * 28;
  return Math.max(
    TAP_DESTROY_SPAWN_INTERVAL_MIN_MS,
    TAP_DESTROY_SPAWN_INTERVAL_MS - speedUp,
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...initialState,
        status: "playing",
        secondsLeft: TAP_DESTROY_DURATION_SEC,
      };
    case "reset":
      return initialState;
    case "finish":
      if (state.status !== "playing") return state;
      return { ...state, status: "finished", cigarettes: [] };
    case "tick": {
      if (state.status !== "playing") return state;
      const secondsLeft = state.secondsLeft - 1;
      if (secondsLeft <= 0) {
        return { ...state, secondsLeft: 0, status: "finished", cigarettes: [] };
      }
      return { ...state, secondsLeft };
    }
    case "spawn":
      if (state.status !== "playing") return state;
      if (state.cigarettes.length >= TAP_DESTROY_MAX_ON_SCREEN) return state;
      return { ...state, cigarettes: [...state.cigarettes, action.cig] };
    case "destroy": {
      if (state.status !== "playing") return state;
      if (!state.cigarettes.some((c) => c.id === action.id)) return state;
      const withinCombo =
        state.lastHitAt > 0 &&
        action.at - state.lastHitAt <= TAP_DESTROY_COMBO_WINDOW_MS;
      const combo = withinCombo ? state.combo + 1 : 1;
      const scoreGain = 1 + Math.max(0, combo - 1);
      return {
        ...state,
        score: state.score + scoreGain,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        lastHitAt: action.at,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
      };
    }
    case "expire":
      return {
        ...state,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
        combo: 0,
      };
    default:
      return state;
  }
}

/** State + side-effects for the "Tap to Destroy Cigarettes" mini-game. */
export function useTapDestroyGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const counterRef = useRef(0);
  const scoreRef = useRef(0);
  const stateRef = useRef(state);
  const expireTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  scoreRef.current = state.score;
  stateRef.current = state;

  const clearAllTimers = useCallback(() => {
    expireTimersRef.current.forEach((t) => clearTimeout(t));
    expireTimersRef.current.clear();
  }, []);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") {
      clearAllTimers();
      return;
    }

    const burstBufferRef: TapDestroyCigarette[] = [];

    const spawnOne = (duringBurst = false) => {
      counterRef.current += 1;
      const id = `cig-${Date.now()}-${counterRef.current}`;
      const existing = duringBurst
        ? [...stateRef.current.cigarettes, ...burstBufferRef]
        : stateRef.current.cigarettes;
      const { x, y } = pickTapDestroySpawnPosition(existing, {
        spreadOnly: duringBurst,
      });
      const cig: TapDestroyCigarette = {
        id,
        x,
        y,
        rotation: Math.random() * 80 - 40,
      };
      if (duringBurst) {
        burstBufferRef.push(cig);
      }
      dispatch({ type: "spawn", cig });
      const timer = setTimeout(() => {
        expireTimersRef.current.delete(id);
        dispatch({ type: "expire", id });
      }, TAP_DESTROY_CIGARETTE_LIFETIME_MS);
      expireTimersRef.current.set(id, timer);
    };

    for (let i = 0; i < TAP_DESTROY_INITIAL_BURST; i += 1) {
      spawnOne(true);
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNext = () => {
      spawnOne();
      timeoutId = setTimeout(
        scheduleNext,
        spawnIntervalForScore(scoreRef.current),
      );
    };
    timeoutId = setTimeout(
      scheduleNext,
      spawnIntervalForScore(scoreRef.current),
    );

    return () => {
      clearTimeout(timeoutId);
      clearAllTimers();
    };
  }, [state.status, clearAllTimers]);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  const destroy = useCallback((id: string): TapDestroyDestroyResult | null => {
    const timer = expireTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      expireTimersRef.current.delete(id);
    }

    const at = Date.now();
    const before = stateRef.current;
    if (before.status !== "playing") return null;
    if (!before.cigarettes.some((c) => c.id === id)) return null;

    const withinCombo =
      before.lastHitAt > 0 && at - before.lastHitAt <= TAP_DESTROY_COMBO_WINDOW_MS;
    const combo = withinCombo ? before.combo + 1 : 1;
    const scoreGain = 1 + Math.max(0, combo - 1);

    dispatch({ type: "destroy", id, at });
    return {
      scoreGain,
      combo,
    };
  }, []);

  return {
    status: state.status,
    score: state.score,
    combo: state.combo,
    bestCombo: state.bestCombo,
    secondsLeft: state.secondsLeft,
    cigarettes: state.cigarettes,
    start,
    reset,
    finish,
    destroy,
  };
}
