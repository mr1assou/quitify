import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  BUBBLE_SHOOTER_DANGER_ROW,
  BUBBLE_SHOOTER_SHOTS_BETWEEN_PUSH,
  BUBBLE_SHOOTER_TOTAL_BUBBLES,
} from "@/constants/craving/games/bubbleShooter";
import {
  createProjectile,
  resolvePlacement,
  stepProjectile,
  type Projectile,
} from "@/utils/craving/games/bubbleShooterEngine";
import {
  addCeilingRowFromPool,
  aimAngleFromTouch,
  cellKey,
  computeBubbleRadius,
  countGridBubbles,
  createBatchGrid,
  gridOrigin,
  hasBubbleAtOrBelowRow,
  pickShooterColor,
  shooterPosition,
  type BubbleColor,
  type BubbleGrid,
} from "@/utils/craving/games/bubbleShooterGrid";

export type BubbleShooterStatus =
  | "idle"
  | "playing"
  | "won"
  | "lost"
  | "finished";

type State = {
  status: BubbleShooterStatus;
  grid: BubbleGrid;
  currentColor: BubbleColor;
  nextColor: BubbleColor;
  projectile: Projectile | null;
  aimAngle: number;
  shotsLanded: number;
  poppedTotal: number;
  bubblesInPool: number;
  fieldWidth: number;
  fieldHeight: number;
  canShoot: boolean;
};

type Action =
  | { type: "start" }
  | { type: "finish" }
  | { type: "setFieldSize"; width: number; height: number }
  | { type: "setAim"; angle: number }
  | { type: "shoot" }
  | { type: "tick"; deltaMs: number }
  | { type: "stuck"; row: number; col: number; color: BubbleColor };

function freshColors(grid: BubbleGrid): {
  current: BubbleColor;
  next: BubbleColor;
} {
  const current = pickShooterColor(grid);
  let next = pickShooterColor(grid);
  while (next === current) {
    next = pickShooterColor(grid);
  }
  return { current, next };
}

function startSession(): Pick<
  State,
  | "grid"
  | "currentColor"
  | "nextColor"
  | "poppedTotal"
  | "shotsLanded"
  | "bubblesInPool"
> {
  const { grid, spawned } = createBatchGrid(BUBBLE_SHOOTER_TOTAL_BUBBLES);
  const colors = freshColors(grid);

  return {
    grid,
    currentColor: colors.current,
    nextColor: colors.next,
    poppedTotal: 0,
    shotsLanded: 0,
    bubblesInPool: BUBBLE_SHOOTER_TOTAL_BUBBLES - spawned,
  };
}

function initialState(): State {
  const session = startSession();

  return {
    status: "idle",
    ...session,
    projectile: null,
    aimAngle: -Math.PI / 2,
    fieldWidth: 0,
    fieldHeight: 0,
    canShoot: true,
  };
}

function fieldMetrics(state: State) {
  const radius = computeBubbleRadius(state.fieldWidth || 320);
  const origin = gridOrigin(state.fieldWidth || 320, radius);
  const shooter = shooterPosition(
    state.fieldWidth || 320,
    state.fieldHeight || 480,
    radius,
  );
  return { radius, origin, shooter };
}

function resolveRound(
  state: State,
  grid: BubbleGrid,
  poppedThisShot: number,
  shotsLanded: number,
  nextShooterColor: BubbleColor,
): State {
  const poppedTotal = Math.min(
    BUBBLE_SHOOTER_TOTAL_BUBBLES,
    state.poppedTotal + poppedThisShot,
  );
  let bubblesInPool = state.bubblesInPool;

  if (poppedTotal >= BUBBLE_SHOOTER_TOTAL_BUBBLES) {
    return {
      ...state,
      status: "won",
      grid,
      poppedTotal,
      shotsLanded,
      bubblesInPool,
      currentColor: nextShooterColor,
      projectile: null,
      canShoot: false,
    };
  }

  if (
    shotsLanded % BUBBLE_SHOOTER_SHOTS_BETWEEN_PUSH === 0 &&
    countGridBubbles(grid) > 0
  ) {
    const ceiling = addCeilingRowFromPool(grid, bubblesInPool);
    grid = ceiling.grid;
    bubblesInPool = ceiling.poolLeft;
  }

  if (countGridBubbles(grid) === 0 && bubblesInPool > 0) {
    const batch = createBatchGrid(bubblesInPool);
    grid = batch.grid;
    bubblesInPool -= batch.spawned;
  }

  const colors = freshColors(grid);
  let nextColor = colors.next;
  while (nextColor === nextShooterColor) {
    nextColor = pickShooterColor(grid);
  }

  const hitDanger = hasBubbleAtOrBelowRow(grid, BUBBLE_SHOOTER_DANGER_ROW);
  const status: BubbleShooterStatus = hitDanger ? "lost" : "playing";

  return {
    ...state,
    status,
    grid,
    poppedTotal,
    shotsLanded,
    bubblesInPool,
    currentColor: nextShooterColor,
    nextColor,
    projectile: null,
    canShoot: status === "playing",
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start": {
      const session = startSession();
      return {
        ...initialState(),
        status: "playing",
        ...session,
        fieldWidth: state.fieldWidth,
        fieldHeight: state.fieldHeight,
      };
    }

    case "finish": {
      if (state.status !== "playing") return state;
      return { ...state, status: "finished", projectile: null, canShoot: false };
    }

    case "setFieldSize":
      return {
        ...state,
        fieldWidth: action.width,
        fieldHeight: action.height,
      };

    case "setAim":
      if (state.status !== "playing" || state.projectile) return state;
      return { ...state, aimAngle: action.angle };

    case "shoot": {
      if (
        state.status !== "playing" ||
        !state.canShoot ||
        state.projectile ||
        state.fieldWidth <= 0
      ) {
        return state;
      }

      const { shooter } = fieldMetrics(state);
      return {
        ...state,
        canShoot: false,
        projectile: createProjectile(
          shooter.x,
          shooter.y,
          state.aimAngle,
          state.currentColor,
        ),
      };
    }

    case "tick": {
      if (state.status !== "playing" || !state.projectile || state.fieldWidth <= 0) {
        return state;
      }

      const { radius, origin } = fieldMetrics(state);
      const result = stepProjectile(
        state.projectile,
        action.deltaMs,
        state.fieldWidth,
        origin.y,
        radius,
        origin.x,
        origin.y,
        state.grid,
      );

      if (result.kind === "moving") {
        return { ...state, projectile: result.projectile };
      }

      return reducer(
        { ...state, projectile: null },
        {
          type: "stuck",
          row: result.row,
          col: result.col,
          color: result.color,
        },
      );
    }

    case "stuck": {
      if (state.status !== "playing") return state;

      if (state.grid[cellKey(action.row, action.col)]) {
        return { ...state, projectile: null, canShoot: true };
      }

      const placement = resolvePlacement(
        state.grid,
        action.row,
        action.col,
        action.color,
      );

      return resolveRound(
        state,
        placement.grid,
        placement.popped,
        state.shotsLanded + 1,
        state.nextColor,
      );
    }

    default:
      return state;
  }
}

/** Bubble Shooter craving mini-game — clear bubbles in batches. */
export function useBubbleShooterGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    if (state.status !== "playing" || !state.projectile) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    lastFrameRef.current = performance.now();

    const frame = (now: number) => {
      const deltaMs = Math.min(32, now - lastFrameRef.current);
      lastFrameRef.current = now;
      dispatch({ type: "tick", deltaMs });
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [state.status, state.projectile]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  const setFieldSize = useCallback((width: number, height: number) => {
    dispatch({ type: "setFieldSize", width, height });
  }, []);

  const aimAt = useCallback(
    (touchX: number, touchY: number) => {
      if (state.fieldWidth <= 0) return;
      const { shooter } = fieldMetrics(state);
      const angle = aimAngleFromTouch(shooter.x, shooter.y, touchX, touchY);
      dispatch({ type: "setAim", angle });
    },
    [state.fieldWidth, state.fieldHeight],
  );

  const shoot = useCallback(() => dispatch({ type: "shoot" }), []);

  const radius =
    state.fieldWidth > 0 ? computeBubbleRadius(state.fieldWidth) : 16;
  const origin =
    state.fieldWidth > 0
      ? gridOrigin(state.fieldWidth, radius)
      : { x: 0, y: 0 };
  const shooter =
    state.fieldWidth > 0 && state.fieldHeight > 0
      ? shooterPosition(state.fieldWidth, state.fieldHeight, radius)
      : { x: 0, y: 0 };

  const bubblesOnBoard = countGridBubbles(state.grid);
  const bubblesRemaining = Math.max(
    0,
    BUBBLE_SHOOTER_TOTAL_BUBBLES - state.poppedTotal,
  );
  const clearProgress =
    (state.poppedTotal / BUBBLE_SHOOTER_TOTAL_BUBBLES) * 100;

  return {
    status: state.status,
    grid: state.grid,
    currentColor: state.currentColor,
    nextColor: state.nextColor,
    projectile: state.projectile,
    aimAngle: state.aimAngle,
    shotsLanded: state.shotsLanded,
    poppedTotal: state.poppedTotal,
    bubblesOnBoard,
    bubblesInPool: state.bubblesInPool,
    bubblesRemaining,
    totalBubbles: BUBBLE_SHOOTER_TOTAL_BUBBLES,
    clearProgress,
    canShoot: state.canShoot,
    fieldWidth: state.fieldWidth,
    fieldHeight: state.fieldHeight,
    radius,
    origin,
    shooter,
    start,
    finish,
    setFieldSize,
    aimAt,
    shoot,
  };
}
