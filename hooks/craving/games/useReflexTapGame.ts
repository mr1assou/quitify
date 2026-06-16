import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  REFLEX_BAD_CHANCE,
  REFLEX_BAD_TARGETS,
  REFLEX_COMBO_WINDOW_MS,
  REFLEX_GOOD_TARGETS,
  REFLEX_MAX_ON_SCREEN,
  REFLEX_SPAWN_INTERVAL_MS,
  REFLEX_TARGET_LIFETIME_MS,
  REFLEX_TARGET_SIZE_MAX,
  REFLEX_TARGET_SIZE_MIN,
  type ReflexTargetType,
} from "@/constants/craving/games/reflexTap";

export type ReflexStatus = "idle" | "playing" | "finished";

export type ReflexTarget = {
  /** Unique instance id (target type can repeat). */
  id: string;
  type: ReflexTargetType;
  xRatio: number;
  yRatio: number;
  size: number;
  /** Auto-expire time in ms. */
  lifetimeMs: number;
};

type State = {
  status: ReflexStatus;
  targets: ReflexTarget[];
  score: number;
  combo: number;
  bestCombo: number;
  wrongTaps: number;
  lastHitAt: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "spawn"; target: ReflexTarget }
  | { type: "hit"; id: string; at: number }
  | { type: "wrong"; id: string }
  | { type: "expire"; id: string };

const initialState: State = {
  status: "idle",
  targets: [],
  score: 0,
  combo: 0,
  bestCombo: 0,
  wrongTaps: 0,
  lastHitAt: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { ...initialState, status: "playing" };
    case "reset":
      return initialState;
    case "finish":
      if (state.status !== "playing") return state;
      return { ...state, status: "finished", targets: [], combo: 0 };
    case "spawn":
      if (state.status !== "playing") return state;
      if (state.targets.length >= REFLEX_MAX_ON_SCREEN) return state;
      return { ...state, targets: [...state.targets, action.target] };
    case "hit": {
      if (state.status !== "playing") return state;
      const target = state.targets.find((t) => t.id === action.id);
      if (!target || target.type.kind !== "good") return state;
      const withinCombo =
        state.lastHitAt > 0 &&
        action.at - state.lastHitAt <= REFLEX_COMBO_WINDOW_MS;
      const combo = withinCombo ? state.combo + 1 : 1;
      const comboBonus = Math.max(0, combo - 1);
      return {
        ...state,
        targets: state.targets.filter((t) => t.id !== action.id),
        score: state.score + 1 + comboBonus,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        lastHitAt: action.at,
      };
    }
    case "wrong": {
      if (state.status !== "playing") return state;
      const target = state.targets.find((t) => t.id === action.id);
      if (!target || target.type.kind !== "bad") return state;
      return {
        ...state,
        targets: state.targets.filter((t) => t.id !== action.id),
        wrongTaps: state.wrongTaps + 1,
        combo: 0,
      };
    }
    case "expire": {
      const target = state.targets.find((t) => t.id === action.id);
      if (!target) return state;
      return {
        ...state,
        targets: state.targets.filter((t) => t.id !== action.id),
        combo: target.type.kind === "good" ? 0 : state.combo,
      };
    }
    default:
      return state;
  }
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickTargetType(): ReflexTargetType {
  if (Math.random() < REFLEX_BAD_CHANCE) {
    return REFLEX_BAD_TARGETS[
      Math.floor(Math.random() * REFLEX_BAD_TARGETS.length)
    ];
  }
  return REFLEX_GOOD_TARGETS[
    Math.floor(Math.random() * REFLEX_GOOD_TARGETS.length)
  ];
}

/** State + side-effects for the Reflex Tap mini-game. */
export function useReflexTapGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const counterRef = useRef(0);
  const expireTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const clearAllTimers = useCallback(() => {
    expireTimersRef.current.forEach((t) => clearTimeout(t));
    expireTimersRef.current.clear();
  }, []);

  useEffect(() => {
    if (state.status !== "playing") {
      clearAllTimers();
      return;
    }

    const spawnOne = () => {
      counterRef.current += 1;
      const id = `target-${Date.now()}-${counterRef.current}`;
      const type = pickTargetType();
      const size = Math.round(
        randomBetween(REFLEX_TARGET_SIZE_MIN, REFLEX_TARGET_SIZE_MAX),
      );
      const target: ReflexTarget = {
        id,
        type,
        xRatio: 0.05 + Math.random() * 0.9,
        yRatio: 0.05 + Math.random() * 0.9,
        size,
        lifetimeMs: REFLEX_TARGET_LIFETIME_MS,
      };
      dispatch({ type: "spawn", target });
      const timer = setTimeout(() => {
        expireTimersRef.current.delete(id);
        dispatch({ type: "expire", id });
      }, REFLEX_TARGET_LIFETIME_MS);
      expireTimersRef.current.set(id, timer);
    };

    spawnOne();
    const id = setInterval(spawnOne, REFLEX_SPAWN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.status, clearAllTimers]);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  const tap = useCallback((id: string, kind: "good" | "bad") => {
    const timer = expireTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      expireTimersRef.current.delete(id);
    }
    if (kind === "good") {
      dispatch({ type: "hit", id, at: Date.now() });
    } else {
      dispatch({ type: "wrong", id });
    }
  }, []);

  return {
    status: state.status,
    targets: state.targets,
    score: state.score,
    combo: state.combo,
    bestCombo: state.bestCombo,
    wrongTaps: state.wrongTaps,
    start,
    reset,
    finish,
    tap,
  };
}
