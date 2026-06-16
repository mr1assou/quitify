import { useCallback, useEffect, useReducer, useRef } from "react";

import {
  COLOR_SWITCH_COLOR_ORDER,
  COLOR_SWITCH_GRAVITY,
  COLOR_SWITCH_JUMP_FORCE,
  COLOR_SWITCH_MAX_FALL_SPEED,
  COLOR_SWITCH_OBSTACLE_SPACING,
  COLOR_SWITCH_PASS_SCORE,
  COLOR_SWITCH_SPAWN_AHEAD,
  COLOR_SWITCH_STAR_SCORE,
  type ColorSwitchColor,
} from "@/constants/craving/games/colorSwitch";
import {
  advanceObstacle,
  anchorScreenY,
  ballScreenPosition,
  checkObstacleCollision,
  createInitialWorld,
  createObstacle,
  nextColor,
  obstaclePassed,
  shouldSpawnObstacle,
  tryCollectOrb,
  tryCollectStar,
  worldToScreenY,
  type ColorSwitchDeathReason,
  type ColorSwitchObstacle,
  type ColorSwitchOrb,
  type FieldSize,
} from "@/utils/craving/games/colorSwitchMath";

export type ColorSwitchStatus = "idle" | "playing" | "dead" | "finished";

type State = {
  status: ColorSwitchStatus;
  ballWorldY: number;
  ballVy: number;
  ballColor: ColorSwitchColor;
  obstacles: ColorSwitchObstacle[];
  orbs: ColorSwitchOrb[];
  nextWorldY: number;
  score: number;
  obstacleIndex: number;
  deathReason: ColorSwitchDeathReason | null;
  hasJumped: boolean;
  cameraWorldY: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "jump" }
  | { type: "tick"; dt: number; field: FieldSize };

function createPlayingState(): State {
  const startColor = COLOR_SWITCH_COLOR_ORDER[Math.floor(Math.random() * COLOR_SWITCH_COLOR_ORDER.length)];
  const world = createInitialWorld(startColor);
  return {
    status: "playing",
    ballWorldY: 0,
    ballVy: 0,
    ballColor: startColor,
    obstacles: world.obstacles,
    orbs: world.orbs,
    nextWorldY: world.nextWorldY,
    score: 0,
    obstacleIndex: world.obstacles.length,
    deathReason: null,
    hasJumped: false,
    cameraWorldY: 0,
  };
}

function createInitialState(): State {
  return {
    status: "idle",
    ballWorldY: 0,
    ballVy: 0,
    ballColor: COLOR_SWITCH_COLOR_ORDER[0],
    obstacles: [],
    orbs: [],
    nextWorldY: 0,
    score: 0,
    obstacleIndex: 0,
    deathReason: null,
    hasJumped: false,
    cameraWorldY: 0,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return createPlayingState();
    case "reset":
      return createInitialState();
    case "finish":
      if (state.status !== "playing") return state;
      return { ...state, status: "finished" };
    case "jump":
      if (state.status !== "playing") return state;
      return {
        ...state,
        ballVy: COLOR_SWITCH_JUMP_FORCE,
        hasJumped: true,
      };
    case "tick": {
      if (state.status !== "playing") return state;

      const dtScale = Math.min(action.dt, 32) / 16;
      let obstacles = state.obstacles.map((obstacle) =>
        advanceObstacle(obstacle, dtScale),
      );

      // If the player has not jumped yet, do not run physics, collisions or gravity.
      // This allows them to start the game at their own pace and prevents falling instantly.
      if (!state.hasJumped) {
        return {
          ...state,
          obstacles,
        };
      }

      let ballVy = state.ballVy - COLOR_SWITCH_GRAVITY * dtScale;
      if (ballVy < COLOR_SWITCH_MAX_FALL_SPEED) {
        ballVy = COLOR_SWITCH_MAX_FALL_SPEED;
      }
      const ballWorldY = state.ballWorldY + ballVy * dtScale;

      const anchorY = anchorScreenY(action.field);
      const threshold = anchorY - action.field.height * 0.4;
      const cameraWorldY = Math.max(state.cameraWorldY, ballWorldY - threshold);

      const ballScreen = ballScreenPosition(
        action.field,
        ballWorldY,
        cameraWorldY,
      );

      // Fall death happens if the ball falls off the bottom of the screen (field height + safety margin)
      if (ballScreen.y > action.field.height + 40) {
        return {
          ...state,
          status: "dead",
          ballWorldY,
          ballVy,
          deathReason: "fall",
          cameraWorldY,
        };
      }

      let score = state.score;
      let ballColor = state.ballColor;
      let obstacleIndex = state.obstacleIndex;
      let nextWorldY = state.nextWorldY;
      let orbs = state.orbs;

      for (const obstacle of obstacles) {
        const screenY = worldToScreenY(
          obstacle.worldY,
          cameraWorldY,
          anchorY,
        );
        if (screenY < -120 || screenY > action.field.height + 120) continue;

        const collision = checkObstacleCollision(
          obstacle,
          ballScreen.x,
          ballScreen.y,
          screenY,
          ballColor,
          ballWorldY,
        );
        if (collision === "fatal") {
          return {
            ...state,
            status: "dead",
            ballWorldY,
            ballVy,
            obstacles,
            orbs,
            deathReason: "collision",
            cameraWorldY,
          };
        }
      }

      obstacles = obstacles.map((obstacle) => {
        const screenY = worldToScreenY(
          obstacle.worldY,
          cameraWorldY,
          anchorY,
        );
        let next = obstacle;

        if (tryCollectStar(obstacle, ballScreen.x, ballScreen.y, ballScreen.x, screenY)) {
          score += COLOR_SWITCH_STAR_SCORE;
          next = { ...next, starCollected: true };
        }

        if (obstaclePassed(next, ballWorldY)) {
          score += COLOR_SWITCH_PASS_SCORE;
          next = { ...next, passed: true };
        }

        return next;
      });

      orbs = orbs.map((orb) => {
        const screenY = worldToScreenY(orb.worldY, cameraWorldY, anchorY);
        if (!tryCollectOrb(orb, ballScreen.x, ballScreen.y, screenY, ballScreen.x)) {
          return orb;
        }
        ballColor = nextColor(ballColor);
        score += 1;
        return { ...orb, collected: true };
      });

      while (shouldSpawnObstacle(ballWorldY, nextWorldY, COLOR_SWITCH_SPAWN_AHEAD)) {
        obstacles.push(
          createObstacle(`obs-${obstacleIndex}`, nextWorldY, obstacleIndex),
        );
        obstacleIndex += 1;
        nextWorldY += COLOR_SWITCH_OBSTACLE_SPACING;

        // Spawn a color orb between every obstacle
        orbs.push({
          id: `orb-${obstacleIndex}`,
          worldY: nextWorldY - COLOR_SWITCH_OBSTACLE_SPACING * 0.5,
          collected: false,
        });
      }

      // Filter out obstacles/orbs that are far below the camera Y (more than 1.5 screen heights).
      // This caps the array sizes to ~3-4 elements, preventing infinite memory growth and lag.
      const minWorldY = cameraWorldY - action.field.height * 1.5;
      obstacles = obstacles.filter((o) => o.worldY > minWorldY);
      orbs = orbs.filter((o) => o.worldY > minWorldY);

      return {
        ...state,
        ballWorldY,
        ballVy,
        ballColor,
        obstacles,
        orbs,
        nextWorldY,
        score,
        obstacleIndex,
        cameraWorldY,
      };
    }
    default:
      return state;
  }
}

/** Endless tap-to-fly color matching — Color Switch style. */
export function useColorSwitchGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const fieldRef = useRef<FieldSize>({ width: 0, height: 0 });
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);

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

    lastFrameRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(48, now - lastFrameRef.current);
      lastFrameRef.current = now;
      const field = fieldRef.current;
      if (field.width > 0 && field.height > 0) {
        dispatch({ type: "tick", dt, field });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);
  const jump = useCallback(() => dispatch({ type: "jump" }), []);

  return {
    status: state.status,
    ballWorldY: state.ballWorldY,
    cameraWorldY: state.cameraWorldY,
    ballColor: state.ballColor,
    obstacles: state.obstacles,
    orbs: state.orbs,
    score: state.score,
    deathReason: state.deathReason,
    start,
    reset,
    finish,
    jump,
    setFieldSize,
  };
}
