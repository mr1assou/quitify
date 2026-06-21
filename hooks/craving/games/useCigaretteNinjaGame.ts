import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  CIGARETTE_NINJA_BOSS_AT_SEC,
  CIGARETTE_NINJA_COMBO_WINDOW_MS,
  CIGARETTE_NINJA_DURATION_SEC,
  CIGARETTE_NINJA_MIN_SLICE_PX,
  CIGARETTE_NINJA_OBJECT_CONFIG,
  CIGARETTE_NINJA_SPAWN_BATCH_MAX,
  CIGARETTE_NINJA_SPAWN_BATCH_MIN,
  CIGARETTE_NINJA_TARGET_SCORE,
} from "@/constants/craving/games/cigaretteNinja";
import {
  advanceFlyingObject,
  createFlyingObject,
  isOffScreen,
  maxObjectsForElapsed,
  objectRadius,
  segmentIntersectsCircle,
  spawnIntervalForElapsed,
  type FieldSize,
  type NinjaFlyingObject,
} from "@/utils/craving/games/cigaretteNinjaMath";

export type CigaretteNinjaStatus =
  | "idle"
  | "playing"
  | "won"
  | "finished"
  | "timedOut";

export type NinjaSliceBurst = {
  id: string;
  x: number;
  y: number;
  combo: number;
};

export type NinjaTrailPoint = { x: number; y: number };

type State = {
  status: CigaretteNinjaStatus;
  objects: NinjaFlyingObject[];
  score: number;
  combo: number;
  bestCombo: number;
  secondsLeft: number;
  destroyed: number;
  lastHitAt: number;
  bursts: NinjaSliceBurst[];
  trail: NinjaTrailPoint[];
  elapsedMs: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "tick"; dt: number; field: FieldSize }
  | { type: "spawn"; object: NinjaFlyingObject }
  | { type: "spawnBatch"; objects: NinjaFlyingObject[] }
  | { type: "slice"; segment: NinjaTrailPoint[]; at: number }
  | { type: "clearBurst"; id: string }
  | { type: "setTrail"; trail: NinjaTrailPoint[] }
  | { type: "secondTick" };

function createInitialState(): State {
  return {
    status: "idle",
    objects: [],
    score: 0,
    combo: 0,
    bestCombo: 0,
    secondsLeft: CIGARETTE_NINJA_DURATION_SEC,
    destroyed: 0,
    lastHitAt: 0,
    bursts: [],
    trail: [],
    elapsedMs: 0,
  };
}

function applySliceHit(
  state: State,
  object: NinjaFlyingObject,
  at: number,
): State {
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const withinCombo =
    state.lastHitAt > 0 && at - state.lastHitAt <= CIGARETTE_NINJA_COMBO_WINDOW_MS;
  const combo = withinCombo ? state.combo + 1 : 1;
  const comboBonus = Math.max(0, combo - 1);
  const scoreGain = config.score + comboBonus * 5;
  const nextHealth = object.health - 1;
  const destroyedNow = nextHealth <= 0;

  const objects = destroyedNow
    ? state.objects.filter((o) => o.id !== object.id)
    : state.objects.map((o) =>
        o.id === object.id ? { ...o, health: nextHealth } : o,
      );

  const burst: NinjaSliceBurst = {
    id: `burst-${object.id}-${at}`,
    x: object.x,
    y: object.y,
    combo,
  };

  const next: State = {
    ...state,
    objects,
    score: state.score + scoreGain,
    combo: destroyedNow ? combo : state.combo,
    bestCombo: destroyedNow ? Math.max(state.bestCombo, combo) : state.bestCombo,
    destroyed: destroyedNow ? state.destroyed + 1 : state.destroyed,
    lastHitAt: destroyedNow ? at : state.lastHitAt,
    bursts: [...state.bursts, burst],
  };

  if (next.score >= CIGARETTE_NINJA_TARGET_SCORE) {
    return { ...next, status: "won", combo: 0, objects: [] };
  }

  return next;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...createInitialState(),
        status: "playing",
        secondsLeft: CIGARETTE_NINJA_DURATION_SEC,
      };
    case "reset":
      return createInitialState();
    case "finish": {
      if (state.status !== "playing") return state;
      const won = state.score >= CIGARETTE_NINJA_TARGET_SCORE;
      return {
        ...state,
        status: won ? "won" : "finished",
        objects: [],
        combo: 0,
      };
    }
    case "secondTick": {
      if (state.status !== "playing") return state;
      const secondsLeft = state.secondsLeft - 1;
      if (secondsLeft <= 0) {
        const won = state.score >= CIGARETTE_NINJA_TARGET_SCORE;
        return {
          ...state,
          status: won ? "won" : "timedOut",
          secondsLeft: 0,
          objects: [],
          combo: 0,
        };
      }
      return { ...state, secondsLeft };
    }
    case "tick": {
      if (state.status !== "playing") return state;
      const elapsedMs = state.elapsedMs + action.dt;
      const objects = state.objects
        .map((o) => advanceFlyingObject(o, action.field, action.dt))
        .filter((o) => !isOffScreen(o, action.field));
      return { ...state, objects, elapsedMs };
    }
    case "spawn":
      if (state.status !== "playing") return state;
      return { ...state, objects: [...state.objects, action.object] };
    case "spawnBatch":
      if (state.status !== "playing" || action.objects.length === 0) return state;
      return { ...state, objects: [...state.objects, ...action.objects] };
    case "slice": {
      if (state.status !== "playing" || action.segment.length < 2) return state;
      const start = action.segment[action.segment.length - 2];
      const end = action.segment[action.segment.length - 1];
      const sliceLen = Math.hypot(end.x - start.x, end.y - start.y);
      if (sliceLen < CIGARETTE_NINJA_MIN_SLICE_PX) return state;

      let next = state;
      for (const object of state.objects) {
        const current = next.objects.find((o) => o.id === object.id);
        if (!current) continue;
        const hit = segmentIntersectsCircle(
          start.x,
          start.y,
          end.x,
          end.y,
          current.x,
          current.y,
          objectRadius(current.kind),
        );
        if (hit) {
          next = applySliceHit(next, current, action.at);
        }
      }
      return next;
    }
    case "setTrail":
      return { ...state, trail: action.trail };
    case "clearBurst":
      return {
        ...state,
        bursts: state.bursts.filter((b) => b.id !== action.id),
      };
    default:
      return state;
  }
}

/** Fruit-Ninja-style craving battle — swipe to slice flying cigarettes. */
export function useCigaretteNinjaGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const counterRef = useRef(0);
  const fieldRef = useRef<FieldSize>({ width: 0, height: 0 });
  const spawnAtRef = useRef(0);
  const bossSpawnedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const objectsCountRef = useRef(0);

  objectsCountRef.current = state.objects.length;

  const setFieldSize = useCallback((width: number, height: number) => {
    fieldRef.current = { width, height };
  }, []);

  useEffect(() => {
    if (state.status !== "playing") {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    bossSpawnedRef.current = false;
    spawnAtRef.current = performance.now();
    lastFrameRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - lastFrameRef.current);
      lastFrameRef.current = now;
      const field = fieldRef.current;

      if (field.width > 0 && field.height > 0) {
        dispatch({ type: "tick", dt, field });

        const elapsedMs = now - spawnAtRef.current;
        if (
          !bossSpawnedRef.current &&
          elapsedMs >= CIGARETTE_NINJA_BOSS_AT_SEC * 1000
        ) {
          bossSpawnedRef.current = true;
          counterRef.current += 1;
          dispatch({
            type: "spawn",
            object: createFlyingObject(
              `boss-${counterRef.current}`,
              field,
              { forceBoss: true },
            ),
          });
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleSpawn = () => {
      const field = fieldRef.current;
      if (field.width <= 0 || field.height <= 0) {
        timeoutId = setTimeout(scheduleSpawn, 50);
        return;
      }

      const elapsedMs = performance.now() - spawnAtRef.current;
      const maxObjects = maxObjectsForElapsed(elapsedMs);
      const slotsLeft = maxObjects - objectsCountRef.current;
      if (slotsLeft > 0) {
        const batchSize =
          CIGARETTE_NINJA_SPAWN_BATCH_MIN +
          Math.floor(
            Math.random() *
              (CIGARETTE_NINJA_SPAWN_BATCH_MAX - CIGARETTE_NINJA_SPAWN_BATCH_MIN + 1),
          );
        const toSpawn = Math.min(batchSize, slotsLeft);
        const objects: NinjaFlyingObject[] = [];
        for (let i = 0; i < toSpawn; i += 1) {
          counterRef.current += 1;
          objects.push(createFlyingObject(`obj-${counterRef.current}`, field));
        }
        dispatch({ type: "spawnBatch", objects });
      }
      timeoutId = setTimeout(scheduleSpawn, spawnIntervalForElapsed(elapsedMs));
    };

    scheduleSpawn();
    return () => clearTimeout(timeoutId);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "secondTick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  const trailRef = useRef<NinjaTrailPoint[]>([]);

  const extendSwipe = useCallback((x: number, y: number) => {
    trailRef.current = [...trailRef.current.slice(-10), { x, y }];
    dispatch({ type: "setTrail", trail: trailRef.current });
    if (trailRef.current.length >= 2) {
      dispatch({ type: "slice", segment: trailRef.current, at: Date.now() });
    }
  }, []);

  const endSwipe = useCallback(() => {
    trailRef.current = [];
    dispatch({ type: "setTrail", trail: [] });
  }, []);

  const clearBurst = useCallback((id: string) => {
    dispatch({ type: "clearBurst", id });
  }, []);

  return {
    status: state.status,
    objects: state.objects,
    score: state.score,
    combo: state.combo,
    bestCombo: state.bestCombo,
    secondsLeft: state.secondsLeft,
    destroyed: state.destroyed,
    bursts: state.bursts,
    trail: state.trail,
    start,
    reset,
    finish,
    setFieldSize,
    extendSwipe,
    endSwipe,
    clearBurst,
  };
}
