import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  DRAG_CIGARETTES_COMBO_WINDOW_MS,
  DRAG_CIGARETTES_DURATION_SEC,
  DRAG_CIGARETTES_MAX_ON_SCREEN,
  DRAG_CIGARETTES_SPAWN_INTERVAL_MS,
} from "@/constants/dragCigarettes";

export type DragCigarettesStatus = "idle" | "playing" | "finished";

export type DragCigarette = {
  id: string;
  /** Normalized 0..1 inside the play area. */
  xRatio: number;
  yRatio: number;
  /** Initial rotation in degrees. */
  rotation: number;
};

type State = {
  status: DragCigarettesStatus;
  cigarettes: DragCigarette[];
  secondsLeft: number;
  trashed: number;
  combo: number;
  bestCombo: number;
  lastTrashAt: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "spawn"; cigarette: DragCigarette }
  | { type: "trash"; id: string; at: number }
  | { type: "release"; id: string };

const initialState: State = {
  status: "idle",
  cigarettes: [],
  secondsLeft: DRAG_CIGARETTES_DURATION_SEC,
  trashed: 0,
  combo: 0,
  bestCombo: 0,
  lastTrashAt: 0,
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
        return {
          ...state,
          status: "finished",
          secondsLeft: 0,
          cigarettes: [],
          combo: 0,
        };
      }
      return { ...state, secondsLeft: next };
    }
    case "spawn":
      if (state.status !== "playing") return state;
      if (state.cigarettes.length >= DRAG_CIGARETTES_MAX_ON_SCREEN) return state;
      return { ...state, cigarettes: [...state.cigarettes, action.cigarette] };
    case "trash": {
      if (state.status !== "playing") return state;
      if (!state.cigarettes.some((c) => c.id === action.id)) return state;
      const withinCombo =
        state.lastTrashAt > 0 &&
        action.at - state.lastTrashAt <= DRAG_CIGARETTES_COMBO_WINDOW_MS;
      const combo = withinCombo ? state.combo + 1 : 1;
      return {
        ...state,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
        trashed: state.trashed + 1,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        lastTrashAt: action.at,
      };
    }
    case "release":
      return {
        ...state,
        cigarettes: state.cigarettes.filter((c) => c.id !== action.id),
      };
    default:
      return state;
  }
}

/** State + side-effects for the Drag Cigarettes to Trash mini-game. */
export function useDragCigarettesGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const counterRef = useRef(0);

  // Countdown.
  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // Spawner. Spawns enough to keep the field interesting but never spammy.
  useEffect(() => {
    if (state.status !== "playing") return;

    const spawnOne = () => {
      counterRef.current += 1;
      const id = `cig-${Date.now()}-${counterRef.current}`;
      const cigarette: DragCigarette = {
        id,
        xRatio: 0.08 + Math.random() * 0.84,
        // Spawn in the upper 2/3 to leave room for the trash at the bottom.
        yRatio: 0.04 + Math.random() * 0.62,
        rotation: Math.random() * 60 - 30,
      };
      dispatch({ type: "spawn", cigarette });
    };

    spawnOne();
    const id = setInterval(spawnOne, DRAG_CIGARETTES_SPAWN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const trash = useCallback(
    (id: string) => dispatch({ type: "trash", id, at: Date.now() }),
    [],
  );
  const release = useCallback(
    (id: string) => dispatch({ type: "release", id }),
    [],
  );

  return {
    status: state.status,
    cigarettes: state.cigarettes,
    secondsLeft: state.secondsLeft,
    totalSeconds: DRAG_CIGARETTES_DURATION_SEC,
    trashed: state.trashed,
    combo: state.combo,
    bestCombo: state.bestCombo,
    start,
    reset,
    trash,
    release,
  };
}
