import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { ShapeRenderer } from "@/components/feature/craving/games/calm-focus-puzzle/ShapeRenderer";
import {
  PUZZLE_DRAG_LIFT_PX,
  PUZZLE_GRID_GAP,
  PUZZLE_GRID_SIZE,
  rotateShape,
  shapeBoundingBox,
} from "@/constants/calmFocusPuzzle";
import { useTheme } from "@/context/ThemeContext";
import type { TrayPiece } from "@/hooks/useCalmFocusPuzzleGame";

type Props = {
  trayIndex: number;
  piece: TrayPiece | null;
  slotWidth: number;
  slotHeight: number;
  cellSize: number;
  trayCellSize: number;
  isDragging: boolean;
  onRotate: (trayIndex: number) => void;

  // Drag SVs
  dragActive: SharedValue<number>;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  dragShape: SharedValue<number[]>;
  hoverRow: SharedValue<number>;
  hoverCol: SharedValue<number>;
  hoverValid: SharedValue<number>;
  gridLeftSV: SharedValue<number>;
  gridTopSV: SharedValue<number>;
  gridCellsSV: SharedValue<number[]>;

  // JS callbacks
  beginDragJS: (idx: number) => void;
  endDragJS: (idx: number, valid: boolean, row: number, col: number) => void;
}; export function PuzzleTraySlot({
  trayIndex,
  piece,
  slotWidth,
  slotHeight,
  cellSize,
  trayCellSize,
  isDragging,
  onRotate,
  dragActive,
  dragX,
  dragY,
  dragShape,
  hoverRow,
  hoverCol,
  hoverValid,
  gridLeftSV,
  gridTopSV,
  gridCellsSV,
  beginDragJS,
  endDragJS,
}: Props) {
  const { resolved } = useTheme();
  const slotBg = resolved === "dark" ? "#181D1B" : "#F1F5EE";
  const slotBorder = resolved === "dark" ? "#252E2A" : "#E2E8DE";

  // Rebuild the gesture whenever the piece OR its rotation changes so the
  // captured bbox / flat-shape stays in sync.
  const pan = useMemo(() => {
    if (!piece) return null;
    const rotated = rotateShape(piece.shape, piece.rotation);
    const { rows, cols } = shapeBoundingBox(rotated);
    const stride = cellSize + PUZZLE_GRID_GAP;
    const pieceW = cols * cellSize + (cols - 1) * PUZZLE_GRID_GAP;
    const pieceH = rows * cellSize + (rows - 1) * PUZZLE_GRID_GAP;
    const flat: number[] = [];
    for (const [r, c] of rotated) flat.push(r, c);

    const computeHover = (
      absX: number,
      absY: number,
    ): { row: number; col: number; valid: number } => {
      "worklet";
      const tlX = absX - pieceW / 2;
      const tlY = absY - pieceH - PUZZLE_DRAG_LIFT_PX;
      const relX = tlX - gridLeftSV.value;
      const relY = tlY - gridTopSV.value;
      const col = Math.round(relX / stride);
      const row = Math.round(relY / stride);
      let valid = 1;
      for (let i = 0; i < flat.length; i += 2) {
        const rr = row + flat[i];
        const cc = col + flat[i + 1];
        if (
          rr < 0 ||
          cc < 0 ||
          rr >= PUZZLE_GRID_SIZE ||
          cc >= PUZZLE_GRID_SIZE
        ) {
          valid = 0;
          break;
        }
        if (gridCellsSV.value[rr * PUZZLE_GRID_SIZE + cc] === 1) {
          valid = 0;
          break;
        }
      }
      return { row, col, valid };
    };

    return Gesture.Pan()
      .activeOffsetX([-3, 3])
      .activeOffsetY([-3, 3])
      .onStart((e) => {
        "worklet";
        dragActive.value = 1;
        dragShape.value = flat;
        dragX.value = e.absoluteX - pieceW / 2;
        dragY.value = e.absoluteY - pieceH - PUZZLE_DRAG_LIFT_PX;
        const h = computeHover(e.absoluteX, e.absoluteY);
        hoverRow.value = h.row;
        hoverCol.value = h.col;
        hoverValid.value = h.valid;
        runOnJS(beginDragJS)(trayIndex);
      })
      .onUpdate((e) => {
        "worklet";
        dragX.value = e.absoluteX - pieceW / 2;
        dragY.value = e.absoluteY - pieceH - PUZZLE_DRAG_LIFT_PX;
        const h = computeHover(e.absoluteX, e.absoluteY);
        hoverRow.value = h.row;
        hoverCol.value = h.col;
        hoverValid.value = h.valid;
      })
      .onEnd(() => {
        "worklet";
        const valid = hoverValid.value === 1;
        const row = hoverRow.value;
        const col = hoverCol.value;
        dragActive.value = 0;
        dragShape.value = [];
        hoverRow.value = -1;
        hoverCol.value = -1;
        hoverValid.value = 0;
        runOnJS(endDragJS)(trayIndex, valid, row, col);
      })
      .onFinalize(() => {
        "worklet";
        dragActive.value = 0;
        dragShape.value = [];
        hoverRow.value = -1;
        hoverCol.value = -1;
        hoverValid.value = 0;
      });
  }, [
    piece,
    cellSize,
    trayIndex,
    beginDragJS,
    endDragJS,
    dragActive,
    dragShape,
    dragX,
    dragY,
    hoverRow,
    hoverCol,
    hoverValid,
    gridLeftSV,
    gridTopSV,
    gridCellsSV,
  ]);

  const pieceStyle = useAnimatedStyle(() => ({
    opacity: isDragging ? 0.25 : 1,
  }));

  const handleRotate = () => {
    Haptics.selectionAsync().catch(() => {});
    onRotate(trayIndex);
  };

  return (
    <View
      style={{
        width: slotWidth,
        height: slotHeight,
        borderRadius: 18,
        backgroundColor: slotBg,
        borderWidth: 1,
        borderColor: slotBorder,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {piece && pan ? (
        <>
          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                {
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                },
                pieceStyle,
              ]}
            >
              <ShapeRenderer
                shape={piece.shape}
                rotation={piece.rotation}
                color={piece.color}
                cellSize={trayCellSize}
                gap={2}
              />
            </Animated.View>
          </GestureDetector>
          <Pressable
            onPress={handleRotate}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Rotate piece"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 26,
              height: 26,
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: resolved === "dark" ? "#252E2A" : "#FFFFFFcc",
            }}
          >
            <Ionicons
              name="refresh"
              size={14}
              color={resolved === "dark" ? "#A4D7A7" : "#3B7A3B"}
            />
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
