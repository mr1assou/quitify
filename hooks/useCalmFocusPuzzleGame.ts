import { useCallback, useEffect, useReducer } from "react";

import {
  PUZZLE_CELL_SCORE,
  PUZZLE_DURATION_SEC,
  PUZZLE_FULL_CLEAR_BONUS,
  PUZZLE_GRID_SIZE,
  PUZZLE_LINE_BONUS,
  PUZZLE_MULTI_LINE_BONUS,
  PUZZLE_SHAPES,
  PUZZLE_TRAY_SIZE,
  type Rotation,
  type ShapeCells,
  rotateShape,
} from "@/constants/calmFocusPuzzle";

export type CalmPuzzleStatus = "idle" | "playing" | "finished";

export type TrayPiece = {
  /** Unique id per spawn. */
  id: string;
  shapeId: string;
  shape: ShapeCells;
  color: string;
  rotation: Rotation;
};

export type GridCell = {
  filled: boolean;
  color: string | null;
};

type State = {
  status: CalmPuzzleStatus;
  cells: GridCell[][];
  tray: (TrayPiece | null)[];
  score: number;
  linesCleared: number;
  combo: number;
  bestCombo: number;
  secondsLeft: number;
  /** Increments on every line clear — UI can hook into this. */
  lineClearTick: number;
  /** Increments when the player completes a full clear. */
  fullClearTick: number;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "finish" }
  | { type: "rotate"; trayIndex: number }
  | { type: "place"; trayIndex: number; row: number; col: number }
  | { type: "refresh-tray" };

function makeEmptyGrid(): GridCell[][] {
  return Array.from({ length: PUZZLE_GRID_SIZE }, () =>
    Array.from({ length: PUZZLE_GRID_SIZE }, () => ({
      filled: false,
      color: null,
    })),
  );
}

function randomPiece(): TrayPiece {
  const def = PUZZLE_SHAPES[Math.floor(Math.random() * PUZZLE_SHAPES.length)];
  const rotation = (Math.floor(Math.random() * 4) as Rotation) ?? 0;
  return {
    id: `${def.id}-${Math.random().toString(36).slice(2, 8)}`,
    shapeId: def.id,
    shape: def.shape,
    color: def.color,
    rotation,
  };
}

function refillTray(): TrayPiece[] {
  return Array.from({ length: PUZZLE_TRAY_SIZE }, () => randomPiece());
}

function initialState(): State {
  return {
    status: "idle",
    cells: makeEmptyGrid(),
    tray: refillTray(),
    score: 0,
    linesCleared: 0,
    combo: 0,
    bestCombo: 0,
    secondsLeft: PUZZLE_DURATION_SEC,
    lineClearTick: 0,
    fullClearTick: 0,
  };
}

function tryPlace(
  cells: GridCell[][],
  piece: TrayPiece,
  row: number,
  col: number,
): { cells: GridCell[][]; ok: boolean } {
  const rotated = rotateShape(piece.shape, piece.rotation);
  for (const [dr, dc] of rotated) {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || c < 0 || r >= PUZZLE_GRID_SIZE || c >= PUZZLE_GRID_SIZE) {
      return { cells, ok: false };
    }
    if (cells[r][c].filled) return { cells, ok: false };
  }
  const next = cells.map((row2) => row2.map((cell) => ({ ...cell })));
  for (const [dr, dc] of rotated) {
    next[row + dr][col + dc] = { filled: true, color: piece.color };
  }
  return { cells: next, ok: true };
}

function clearLines(cells: GridCell[][]): {
  cells: GridCell[][];
  lines: number;
} {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];
  for (let r = 0; r < PUZZLE_GRID_SIZE; r += 1) {
    if (cells[r].every((c) => c.filled)) rowsToClear.push(r);
  }
  for (let c = 0; c < PUZZLE_GRID_SIZE; c += 1) {
    if (cells.every((row) => row[c].filled)) colsToClear.push(c);
  }
  const lines = rowsToClear.length + colsToClear.length;
  if (lines === 0) return { cells, lines: 0 };
  const next = cells.map((row) => row.map((cell) => ({ ...cell })));
  for (const r of rowsToClear) {
    for (let c = 0; c < PUZZLE_GRID_SIZE; c += 1) {
      next[r][c] = { filled: false, color: null };
    }
  }
  for (const c of colsToClear) {
    for (let r = 0; r < PUZZLE_GRID_SIZE; r += 1) {
      next[r][c] = { filled: false, color: null };
    }
  }
  return { cells: next, lines };
}

const ALL_ROTATIONS: readonly Rotation[] = [0, 1, 2, 3];

function anyPieceFits(
  cells: GridCell[][],
  tray: (TrayPiece | null)[],
): boolean {
  for (const piece of tray) {
    if (!piece) continue;
    // Try all rotations so the player can always find a spot by rotating.
    for (const rot of ALL_ROTATIONS) {
      const rotated = rotateShape(piece.shape, rot);
      for (let r = 0; r < PUZZLE_GRID_SIZE; r += 1) {
        for (let c = 0; c < PUZZLE_GRID_SIZE; c += 1) {
          let ok = true;
          for (const [dr, dc] of rotated) {
            const rr = r + dr;
            const cc = c + dc;
            if (
              rr < 0 ||
              cc < 0 ||
              rr >= PUZZLE_GRID_SIZE ||
              cc >= PUZZLE_GRID_SIZE ||
              cells[rr][cc].filled
            ) {
              ok = false;
              break;
            }
          }
          if (ok) return true;
        }
      }
    }
  }
  return false;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { ...initialState(), status: "playing" };
    case "reset":
      return initialState();
    case "finish":
      return { ...state, status: "finished" };
    case "tick": {
      if (state.status !== "playing") return state;
      if (state.secondsLeft <= 1) {
        return { ...state, secondsLeft: 0, status: "finished" };
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    }
    case "rotate": {
      const piece = state.tray[action.trayIndex];
      if (!piece) return state;
      const newTray = state.tray.slice();
      newTray[action.trayIndex] = {
        ...piece,
        rotation: ((piece.rotation + 1) % 4) as Rotation,
      };
      return { ...state, tray: newTray };
    }
    case "refresh-tray":
      return { ...state, tray: refillTray() };
    case "place": {
      const piece = state.tray[action.trayIndex];
      if (!piece || state.status !== "playing") return state;
      const { cells: placedCells, ok } = tryPlace(
        state.cells,
        piece,
        action.row,
        action.col,
      );
      if (!ok) return state;

      const placedCount = piece.shape.length;
      let score = state.score + placedCount * PUZZLE_CELL_SCORE;

      const { cells: clearedCells, lines } = clearLines(placedCells);
      let combo = state.combo;
      let bestCombo = state.bestCombo;
      let lineClearTick = state.lineClearTick;
      let fullClearTick = state.fullClearTick;

      if (lines > 0) {
        score += lines * PUZZLE_LINE_BONUS;
        if (lines > 1) score += (lines - 1) * PUZZLE_MULTI_LINE_BONUS;
        combo = state.combo + 1;
        if (combo > bestCombo) bestCombo = combo;
        lineClearTick = state.lineClearTick + 1;
      } else {
        combo = 0;
      }

      // Full board clear bonus.
      const fullyEmpty = clearedCells.every((row) =>
        row.every((cell) => !cell.filled),
      );
      if (fullyEmpty) {
        score += PUZZLE_FULL_CLEAR_BONUS;
        fullClearTick = state.fullClearTick + 1;
      }

      const newTray = state.tray.slice();
      newTray[action.trayIndex] = null;
      const allUsed = newTray.every((p) => p === null);
      let finalTray: (TrayPiece | null)[] = allUsed ? refillTray() : newTray;

      // If nothing in the tray can fit anywhere, calmly refresh.
      if (!anyPieceFits(clearedCells, finalTray)) {
        finalTray = refillTray();
      }

      return {
        ...state,
        cells: clearedCells,
        tray: finalTray,
        score,
        linesCleared: state.linesCleared + lines,
        combo,
        bestCombo,
        lineClearTick,
        fullClearTick,
      };
    }
    default:
      return state;
  }
}

/** State + side-effects for the Calm Focus Puzzle block-fit mini-game. */
export function useCalmFocusPuzzleGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const finish = useCallback(() => dispatch({ type: "finish" }), []);
  const rotate = useCallback(
    (trayIndex: number) => dispatch({ type: "rotate", trayIndex }),
    [],
  );
  const place = useCallback(
    (trayIndex: number, row: number, col: number) =>
      dispatch({ type: "place", trayIndex, row, col }),
    [],
  );

  return {
    status: state.status,
    cells: state.cells,
    tray: state.tray,
    score: state.score,
    linesCleared: state.linesCleared,
    combo: state.combo,
    bestCombo: state.bestCombo,
    secondsLeft: state.secondsLeft,
    totalSeconds: PUZZLE_DURATION_SEC,
    lineClearTick: state.lineClearTick,
    fullClearTick: state.fullClearTick,
    start,
    reset,
    finish,
    rotate,
    place,
  };
}
