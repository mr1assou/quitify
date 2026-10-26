import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import {
  CIGARETTE_NINJA_BOSS_AT_SEC,
  CIGARETTE_NINJA_COMBO_WINDOW_MS,
  CIGARETTE_NINJA_DURATION_SEC,
  CIGARETTE_NINJA_MIN_SLICE_PX,
  CIGARETTE_NINJA_OBJECT_CONFIG,
  CIGARETTE_NINJA_TARGET_SCORE,
} from "@/constants/craving/games/cigaretteNinja";
import {
  createSliceTarget,
  objectRadius,
  segmentIntersectsCircle,
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

type Positions = Record<string, { x: number; y: number }>;

/** How long a normal target stays on screen before it hides. */
const TARGET_VISIBLE_MS = 3500;
const BOSS_VISIBLE_MS = 6000;
/** Few targets at once so the screen stays light. */
const MAX_VISIBLE = 4;

type State = {
  status: CigaretteNinjaStatus;
  /** Targets currently showing. They stay still until sliced or hidden. */
  objects: NinjaFlyingObject[];
  score: number;
  combo: number;
  bestCombo: number;
  secondsLeft: number;
  destroyed: number;
  lastHitAt: number;
  bursts: NinjaSliceBurst[];
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "spawn"; object: NinjaFlyingObject }
  | { type: "spawnBatch"; objects: NinjaFlyingObject[] }
  | { type: "removeObjects"; ids: string[] }
  | { type: "slice"; hits: Positions; at: number }
  | { type: "clearBurst"; id: string }
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
  };
}

function applySliceHit(
  state: State,
  object: NinjaFlyingObject,
  at: { x: number; y: number },
  now: number,
): State {
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const withinCombo =
    state.lastHitAt > 0 && now - state.lastHitAt <= CIGARETTE_NINJA_COMBO_WINDOW_MS;
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
    id: `burst-${object.id}-${now}`,
    x: at.x,
    y: at.y,
    combo,
  };

  const next: State = {
    ...state,
    objects,
    score: state.score + scoreGain,
    combo: destroyedNow ? combo : state.combo,
    bestCombo: destroyedNow ? Math.max(state.bestCombo, combo) : state.bestCombo,
    destroyed: destroyedNow ? state.destroyed + 1 : state.destroyed,
    lastHitAt: destroyedNow ? now : state.lastHitAt,
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
    case "spawn":
      if (state.status !== "playing") return state;
      return { ...state, objects: [...state.objects, action.object] };
    case "spawnBatch":
      if (state.status !== "playing" || action.objects.length === 0) return state;
      return { ...state, objects: [...state.objects, ...action.objects] };
    case "removeObjects": {
      if (action.ids.length === 0) return state;
      const gone = new Set(action.ids);
      const objects = state.objects.filter((o) => !gone.has(o.id));
      if (objects.length === state.objects.length) return state;
      return { ...state, objects };
    }
    case "slice": {
      if (state.status !== "playing") return state;
      let next = state;
      for (const object of state.objects) {
        const pos = action.hits[object.id];
        if (!pos) continue;
        const current = next.objects.find((o) => o.id === object.id);
        if (!current) continue;
        next = applySliceHit(next, current, pos, action.at);
      }
      return next;
    }
    case "clearBurst":
      return {
        ...state,
        bursts: state.bursts.filter((b) => b.id !== action.id),
      };
    default:
      return state;
  }
}

/**
 * Swipe to slice targets that appear, then hide.
 * Nothing falls and nothing animates every frame.
 */
export function useCigaretteNinjaGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [trail, setTrail] = useState<NinjaTrailPoint[]>([]);
  const counterRef = useRef(0);
  const fieldRef = useRef<FieldSize>({ width: 0, height: 0 });
  const spawnAtRef = useRef(0);
  const bossSpawnedRef = useRef(false);
  const objectsCountRef = useRef(0);
  const objectsRef = useRef(state.objects);
  const trailRef = useRef<NinjaTrailPoint[]>([]);
  const trailPaintRafRef = useRef<number | null>(null);
  const hideTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  objectsCountRef.current = state.objects.length;
  objectsRef.current = state.objects;

  const setFieldSize = useCallback((width: number, height: number) => {
    fieldRef.current = { width, height };
  }, []);

  const clearTrail = useCallback(() => {
    trailRef.current = [];
    setTrail([]);
    if (trailPaintRafRef.current != null) {
      cancelAnimationFrame(trailPaintRafRef.current);
      trailPaintRafRef.current = null;
    }
  }, []);

  const scheduleTrailPaint = useCallback(() => {
    if (trailPaintRafRef.current != null) return;
    trailPaintRafRef.current = requestAnimationFrame(() => {
      trailPaintRafRef.current = null;
      setTrail(trailRef.current);
    });
  }, []);

  const hideObject = useCallback((id: string) => {
    delete hideTimersRef.current[id];
    dispatch({ type: "removeObjects", ids: [id] });
  }, []);

  useEffect(() => {
    const playing = state.status === "playing";
    if (!playing) {
      for (const id of Object.keys(hideTimersRef.current)) {
        clearTimeout(hideTimersRef.current[id]);
      }
      hideTimersRef.current = {};
      bossSpawnedRef.current = false;
      clearTrail();
      return;
    }

    if (spawnAtRef.current === 0) spawnAtRef.current = performance.now();

    const alive = new Set(state.objects.map((object) => object.id));
    for (const id of Object.keys(hideTimersRef.current)) {
      if (alive.has(id)) continue;
      clearTimeout(hideTimersRef.current[id]);
      delete hideTimersRef.current[id];
    }

    for (const object of state.objects) {
      if (hideTimersRef.current[object.id]) continue;
      const visibleMs = object.kind === "boss" ? BOSS_VISIBLE_MS : TARGET_VISIBLE_MS;
      hideTimersRef.current[object.id] = setTimeout(() => hideObject(object.id), visibleMs);
    }
  }, [clearTrail, hideObject, state.objects, state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => {
      if (bossSpawnedRef.current) return;
      const field = fieldRef.current;
      if (field.width <= 0 || field.height <= 0) return;
      const elapsedMs = performance.now() - spawnAtRef.current;
      if (elapsedMs < CIGARETTE_NINJA_BOSS_AT_SEC * 1000) return;
      bossSpawnedRef.current = true;
      counterRef.current += 1;
      dispatch({
        type: "spawn",
        object: createSliceTarget(`boss-${counterRef.current}`, field, {
          forceBoss: true,
        }),
      });
    }, 250);
    return () => clearInterval(id);
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

      const slotsLeft = MAX_VISIBLE - objectsCountRef.current;
      if (slotsLeft > 0) {
        const toSpawn = Math.min(slotsLeft, 1 + Math.floor(Math.random() * 2));
        const objects: NinjaFlyingObject[] = [];
        for (let i = 0; i < toSpawn; i += 1) {
          counterRef.current += 1;
          objects.push(createSliceTarget(`obj-${counterRef.current}`, field));
        }
        dispatch({ type: "spawnBatch", objects });
      }
      timeoutId = setTimeout(scheduleSpawn, 900);
    };

    scheduleSpawn();
    return () => clearTimeout(timeoutId);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "secondTick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => {
    spawnAtRef.current = performance.now();
    clearTrail();
    dispatch({ type: "start" });
  }, [clearTrail]);

  const reset = useCallback(() => {
    clearTrail();
    dispatch({ type: "reset" });
  }, [clearTrail]);

  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  const extendSwipe = useCallback(
    (x: number, y: number) => {
      trailRef.current = [...trailRef.current.slice(-10), { x, y }];
      scheduleTrailPaint();
      if (trailRef.current.length < 2) return;

      const startPoint = trailRef.current[trailRef.current.length - 2];
      const endPoint = trailRef.current[trailRef.current.length - 1];
      const sliceLen = Math.hypot(
        endPoint.x - startPoint.x,
        endPoint.y - startPoint.y,
      );
      if (sliceLen < CIGARETTE_NINJA_MIN_SLICE_PX) return;

      const hits: Positions = {};
      for (const object of objectsRef.current) {
        const hit = segmentIntersectsCircle(
          startPoint.x,
          startPoint.y,
          endPoint.x,
          endPoint.y,
          object.x,
          object.y,
          objectRadius(object.kind),
        );
        if (hit) hits[object.id] = { x: object.x, y: object.y };
      }
      if (Object.keys(hits).length === 0) return;
      dispatch({ type: "slice", hits, at: Date.now() });
    },
    [scheduleTrailPaint],
  );

  const endSwipe = useCallback(() => {
    clearTrail();
  }, [clearTrail]);

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
    trail,
    start,
    reset,
    finish,
    setFieldSize,
    extendSwipe,
    endSwipe,
    clearBurst,
  };
}
