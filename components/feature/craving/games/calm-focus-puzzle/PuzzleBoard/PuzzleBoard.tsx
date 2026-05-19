import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { PuzzleCell } from "@/components/feature/craving/games/calm-focus-puzzle/PuzzleCell";
import { PuzzleDragLayer } from "@/components/feature/craving/games/calm-focus-puzzle/PuzzleDragLayer";
import { PuzzleTraySlot } from "@/components/feature/craving/games/calm-focus-puzzle/PuzzleTraySlot";
import {
  PUZZLE_GRID_GAP,
  PUZZLE_GRID_SIZE,
  PUZZLE_SIDE_PADDING,
} from "@/constants/calmFocusPuzzle";
import type {
  GridCell,
  TrayPiece,
} from "@/hooks/useCalmFocusPuzzleGame";

type Props = {
  cells: GridCell[][];
  tray: (TrayPiece | null)[];
  onPlace: (trayIndex: number, row: number, col: number) => void;
  onRotate: (trayIndex: number) => void;
  lineClearTick: number;
  fullClearTick: number;
};

export function PuzzleBoard({
  cells,
  tray,
  onPlace,
  onRotate,
  lineClearTick,
  fullClearTick,
}: Props) {
  const { width: winW } = useWindowDimensions();

  // Responsive cell size. Reserve 12px breathing room either side.
  const horizontalRoom = winW - PUZZLE_SIDE_PADDING * 2;
  const cellSize = Math.floor(
    (horizontalRoom - PUZZLE_GRID_GAP * (PUZZLE_GRID_SIZE - 1)) /
      PUZZLE_GRID_SIZE,
  );
  const trayCellSize = Math.max(14, Math.floor(cellSize * 0.5));

  const gridWidth =
    cellSize * PUZZLE_GRID_SIZE + PUZZLE_GRID_GAP * (PUZZLE_GRID_SIZE - 1);

  // Shared values driving the drag system on the UI thread.
  const dragActive = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const dragShape = useSharedValue<number[]>([]);
  const hoverRow = useSharedValue(-1);
  const hoverCol = useSharedValue(-1);
  const hoverValid = useSharedValue(0);
  const gridLeftSV = useSharedValue(0);
  const gridTopSV = useSharedValue(0);
  const boardLeftSV = useSharedValue(0);
  const boardTopSV = useSharedValue(0);
  const gridCellsSV = useSharedValue<number[]>(
    new Array(PUZZLE_GRID_SIZE * PUZZLE_GRID_SIZE).fill(0),
  );

  // Mirror cells to a flat 0/1 grid so the UI thread can validate placements.
  useEffect(() => {
    const flat: number[] = [];
    for (let r = 0; r < PUZZLE_GRID_SIZE; r += 1) {
      for (let c = 0; c < PUZZLE_GRID_SIZE; c += 1) {
        flat.push(cells[r][c].filled ? 1 : 0);
      }
    }
    gridCellsSV.value = flat;
  }, [cells, gridCellsSV]);

  // Haptic on line clear / full clear.
  useEffect(() => {
    if (lineClearTick === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
  }, [lineClearTick]);
  useEffect(() => {
    if (fullClearTick === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }, [fullClearTick]);

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const gridRef = useRef<View>(null);
  const boardRef = useRef<View>(null);
  const measureGrid = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.measureInWindow((x, y) => {
      gridLeftSV.value = x;
      gridTopSV.value = y;
    });
  }, [gridLeftSV, gridTopSV]);
  const measureBoard = useCallback(() => {
    if (!boardRef.current) return;
    boardRef.current.measureInWindow((x, y) => {
      boardLeftSV.value = x;
      boardTopSV.value = y;
    });
  }, [boardLeftSV, boardTopSV]);

  const beginDragJS = useCallback((idx: number) => {
    setDraggingIdx(idx);
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const endDragJS = useCallback(
    (idx: number, valid: boolean, row: number, col: number) => {
      setDraggingIdx(null);
      if (valid) {
        onPlace(idx, row, col);
      } else {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        ).catch(() => {});
      }
    },
    [onPlace],
  );

  const draggingPiece = draggingIdx !== null ? tray[draggingIdx] : null;

  const slotWidth = (gridWidth - 16) / 3;
  const slotHeight = Math.max(96, trayCellSize * 4 + 24);

  return (
    <View
      ref={boardRef}
      onLayout={measureBoard}
      className="flex-1"
      pointerEvents="box-none"
    >
      <View className="items-center pt-2">
        <View
          ref={gridRef}
          onLayout={measureGrid}
          style={{
            width: gridWidth,
            backgroundColor: "transparent",
          }}
        >
          {cells.map((row, r) => (
            <View
              key={`row-${r}`}
              style={{
                flexDirection: "row",
                gap: PUZZLE_GRID_GAP,
                marginTop: r === 0 ? 0 : PUZZLE_GRID_GAP,
              }}
            >
              {row.map((cell, c) => (
                <PuzzleCell
                  key={`cell-${r}-${c}`}
                  row={r}
                  col={c}
                  cellSize={cellSize}
                  cell={cell}
                  hoverRow={hoverRow}
                  hoverCol={hoverCol}
                  hoverValid={hoverValid}
                  dragShape={dragShape}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View
        className="mt-auto items-center px-4 pb-4 pt-3"
        pointerEvents="box-none"
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            width: gridWidth,
            justifyContent: "space-between",
          }}
        >
          {tray.map((piece, idx) => (
            <PuzzleTraySlot
              key={piece ? piece.id : `empty-${idx}`}
              trayIndex={idx}
              piece={piece}
              slotWidth={slotWidth}
              slotHeight={slotHeight}
              cellSize={cellSize}
              trayCellSize={trayCellSize}
              isDragging={draggingIdx === idx}
              onRotate={onRotate}
              dragActive={dragActive}
              dragX={dragX}
              dragY={dragY}
              dragShape={dragShape}
              hoverRow={hoverRow}
              hoverCol={hoverCol}
              hoverValid={hoverValid}
              gridLeftSV={gridLeftSV}
              gridTopSV={gridTopSV}
              gridCellsSV={gridCellsSV}
              beginDragJS={beginDragJS}
              endDragJS={endDragJS}
            />
          ))}
        </View>
      </View>

      <PuzzleDragLayer
        piece={draggingPiece}
        cellSize={cellSize}
        dragX={dragX}
        dragY={dragY}
        dragActive={dragActive}
        boardLeft={boardLeftSV}
        boardTop={boardTopSV}
      />
    </View>
  );
}
