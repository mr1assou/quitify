import { useCallback, useEffect, useReducer, useRef } from "react";

export const TAP_DESTROY_DURATION_SEC = 60;
const SPAWN_INTERVAL_MS = 950;
const CIGARETTE_LIFETIME_MS = 3800;
const MAX_ON_SCREEN = 5;

export type TapDestroyStatus = "idle" | "playing" | "finished";

export type TapDestroyCigarette = {
  id: string;
  /** Normalized 0..1 inside the play area. */
  x: number;
  y: number;
  /** Degrees, -40..40. */
  rotation: number;
};

type State = {
  status: TapDestroyStatus;
  score: number;
  secondsLeft: number;
  cigarettes: TapDestroyCigarette[];
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "spawn"; cig: TapDestroyCigarette }
  | { type: "destroy"; id: string }
  | { type: "expire"; id: string };

const initialState: State = {
  status: "idle",
  score: 0,
  secondsLeft: TAP_DESTROY_DURATION_SEC,
  cigarettes: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { ...initialState, status: "playing" };
    case "reset":
      return initialState;
    case "tick": {
      if (state.status !== "playing") return state;
      const next = state.secondsLeft - 1;
      if (next <= 0) {
        return { ...state, status: "finished", secondsLeft: 0, cigarettes: [] };
      }
      return { ...state, secondsLeft: next };
    }
    case "spawn":
      if (state.status !== "playing") return state;
      if (state.cigarettes.length >= MAX_ON_SCREEN) return state;
      return { ...state, cigarettes: [...state.cigarettes, action.cig] };
    case "destroy": {
      if (state.status !== "playing") return state;
      if (!state.cigarettes.some((c) => c.id === action.id)) return state;
      return {
        ...state,
        score: state.score + 1,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
      };
    }
    case "expire":
      return {
        ...state,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
      };
    default:
      return state;
  }
}

/** State + side-effects for the "Tap to Destroy Cigarettes" mini-game. */
export function useTapDestroyGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const counterRef = useRef(0);

  // 1-second countdown tick.
  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // Periodic cigarette spawner with auto-expiry.
  useEffect(() => {
    if (state.status !== "playing") return;

    const spawnOne = () => {
      counterRef.current += 1;
      const id = `cig-${Date.now()}-${counterRef.current}`;
      const cig: TapDestroyCigarette = {
        id,
        x: 0.05 + Math.random() * 0.9,
        y: 0.05 + Math.random() * 0.9,
        rotation: Math.random() * 80 - 40,
      };
      dispatch({ type: "spawn", cig });
      setTimeout(
        () => dispatch({ type: "expire", id }),
        CIGARETTE_LIFETIME_MS,
      );
    };

    spawnOne();
    const id = setInterval(spawnOne, SPAWN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const destroy = useCallback(
    (id: string) => dispatch({ type: "destroy", id }),
    [],
  );

  return {
    status: state.status,
    score: state.score,
    secondsLeft: state.secondsLeft,
    cigarettes: state.cigarettes,
    totalSeconds: TAP_DESTROY_DURATION_SEC,
    start,
    reset,
    destroy,
  };
}
