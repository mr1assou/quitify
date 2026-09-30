import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  runOnJS,
  useFrameCallback,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

import {
  CIGARETTE_NINJA_BOSS_AT_SEC,
  CIGARETTE_NINJA_COMBO_WINDOW_MS,
  CIGARETTE_NINJA_DURATION_SEC,
  CIGARETTE_NINJA_GRAVITY,
  CIGARETTE_NINJA_MIN_SLICE_PX,
  CIGARETTE_NINJA_OBJECT_CONFIG,
  CIGARETTE_NINJA_SPAWN_BATCH_MAX,
  CIGARETTE_NINJA_SPAWN_BATCH_MIN,
  CIGARETTE_NINJA_TARGET_SCORE,
  CIGARETTE_NINJA_TERMINAL_VY,
} from "@/constants/craving/games/cigaretteNinja";
import {
  createFlyingObject,
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

/** Per-object motion state, advanced on the UI thread every frame. */
export type NinjaPhysics = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  /** Set on the UI thread once the object left the field (awaiting removal). */
  offscreen: boolean;
};

export type NinjaPhysicsMap = Record<string, NinjaPhysics>;

type Positions = Record<string, { x: number; y: number }>;

type State = {
  status: CigaretteNinjaStatus;
  /** Which objects exist + their health. Positions live in `physics` (UI thread). */
  objects: NinjaFlyingObject[];
  score: number;
  combo: number;
  bestCombo: number;
  secondsLeft: number;
  destroyed: number;
  lastHitAt: number;
  bursts: NinjaSliceBurst[];
  trail: NinjaTrailPoint[];
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "spawn"; object: NinjaFlyingObject }
  | { type: "spawnBatch"; objects: NinjaFlyingObject[] }
  | { type: "removeObjects"; ids: string[] }
  | { type: "slice"; segment: NinjaTrailPoint[]; at: number; positions: Positions }
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
      if (state.status !== "playing" || action.segment.length < 2) return state;
      const start = action.segment[action.segment.length - 2];
      const end = action.segment[action.segment.length - 1];
      const sliceLen = Math.hypot(end.x - start.x, end.y - start.y);
      if (sliceLen < CIGARETTE_NINJA_MIN_SLICE_PX) return state;

      let next = state;
      for (const object of state.objects) {
        const current = next.objects.find((o) => o.id === object.id);
        if (!current) continue;
        const pos = action.positions[current.id];
        if (!pos) continue;
        const hit = segmentIntersectsCircle(
          start.x,
          start.y,
          end.x,
          end.y,
          pos.x,
          pos.y,
          objectRadius(current.kind),
        );
        if (hit) {
          next = applySliceHit(next, current, pos, action.at);
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

function physicsFromObject(object: NinjaFlyingObject): NinjaPhysics {
  return {
    x: object.x,
    y: object.y,
    vx: object.vx,
    vy: object.vy,
    rotation: object.rotation,
    rotationSpeed: object.rotationSpeed,
    size: CIGARETTE_NINJA_OBJECT_CONFIG[object.kind].size,
    offscreen: false,
  };
}

/**
 * Fruit-Ninja-style craving battle — swipe to slice flying cigarettes.
 *
 * Motion runs on the UI thread (Reanimated frame callback + shared values);
 * React state only changes on spawn, slice, off-screen removal and the clock.
 */
export function useCigaretteNinjaGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const counterRef = useRef(0);
  const fieldRef = useRef<FieldSize>({ width: 0, height: 0 });
  const spawnAtRef = useRef(0);
  const bossSpawnedRef = useRef(false);
  const objectsCountRef = useRef(0);

  /** UI-thread motion state, keyed by object id. */
  const physics: SharedValue<NinjaPhysicsMap> = useSharedValue<NinjaPhysicsMap>({});
  const fieldSize = useSharedValue<FieldSize>({ width: 0, height: 0 });

  objectsCountRef.current = state.objects.length;

  const setFieldSize = useCallback(
    (width: number, height: number) => {
      fieldRef.current = { width, height };
      fieldSize.value = { width, height };
    },
    [fieldSize],
  );

  // Keep the UI-thread physics map in sync with the objects React knows about:
  // add entries for new spawns, drop entries for sliced / cleared objects.
  useEffect(() => {
    const alive: Record<string, NinjaPhysics> = {};
    for (const object of state.objects) {
      alive[object.id] = physicsFromObject(object);
    }
    physics.modify((current) => {
      "worklet";
      const map = current as NinjaPhysicsMap;
      for (const id in map) {
        if (!(id in alive)) delete map[id];
      }
      for (const id in alive) {
        if (!(id in map)) map[id] = alive[id];
      }
      return current;
    });
  }, [physics, state.objects]);

  const removeOffscreen = useCallback((ids: string[]) => {
    dispatch({ type: "removeObjects", ids });
  }, []);

  // Per-frame integration on the UI thread. No React re-render per frame.
  const onFrame = useCallback(
    (info: { timeSincePreviousFrame: number | null }) => {
      "worklet";
      const field = fieldSize.value;
      if (field.width <= 0 || field.height <= 0) return;

      // Same integration as advanceFlyingObject: clamp step to 32ms.
      const dt = Math.min(32, info.timeSincePreviousFrame ?? 16);
      const scale = dt / 16;
      const gone: string[] = [];
      const map = physics.value;

      for (const id in map) {
        const o = map[id];
        if (o.offscreen) continue;
        o.x += o.vx * scale;
        o.y += o.vy * scale;
        o.vy = Math.min(
          CIGARETTE_NINJA_TERMINAL_VY,
          o.vy + CIGARETTE_NINJA_GRAVITY * scale,
        );
        o.rotation += o.rotationSpeed * scale;

        const pad = o.size * 0.6;
        if (o.y > field.height + pad || o.x < -pad || o.x > field.width + pad) {
          // Mark instead of deleting: React removes it from `objects`, and the
          // sync effect then drops it from this map. Report only once.
          o.offscreen = true;
          gone.push(id);
        }
      }

      // Same object reference; force listeners (animated styles) to update.
      physics.modify(undefined, true);

      if (gone.length > 0) runOnJS(removeOffscreen)(gone);
    },
    [fieldSize, physics, removeOffscreen],
  );

  const frame = useFrameCallback(onFrame, false);

  useEffect(() => {
    const playing = state.status === "playing";
    if (playing) {
      bossSpawnedRef.current = false;
      spawnAtRef.current = performance.now();
    } else {
      physics.value = {};
    }
    frame.setActive(playing);
  }, [frame, physics, state.status]);

  // Boss spawn ~70% through the session (checked on a cheap timer, not per frame).
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
        object: createFlyingObject(`boss-${counterRef.current}`, field, {
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

  const extendSwipe = useCallback(
    (x: number, y: number) => {
      trailRef.current = [...trailRef.current.slice(-10), { x, y }];
      dispatch({ type: "setTrail", trail: trailRef.current });
      if (trailRef.current.length >= 2) {
        // Snapshot current UI-thread positions for hit testing.
        const map = physics.value;
        const positions: Positions = {};
        for (const id in map) {
          positions[id] = { x: map[id].x, y: map[id].y };
        }
        dispatch({
          type: "slice",
          segment: trailRef.current,
          at: Date.now(),
          positions,
        });
      }
    },
    [physics],
  );

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
    physics,
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
