import { memo } from "react";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { GridCell } from "@/hooks/useCalmFocusPuzzleGame";

const IS_ANDROID = Platform.OS === "android";

type Props = {
  row: number;
  col: number;
  cellSize: number;
  cell: GridCell;
  hoverRow: SharedValue<number>;
  hoverCol: SharedValue<number>;
  hoverValid: SharedValue<number>;
  dragShape: SharedValue<number[]>;
};

function PuzzleCellImpl({
  row,
  col,
  cellSize,
  cell,
  hoverRow,
  hoverCol,
  hoverValid,
  dragShape,
}: Props) {
  const { resolved } = useTheme();
  const emptyBg = resolved === "dark" ? "#1A1F1C" : "#F4F7F1";
  const emptyBorder = resolved === "dark" ? "#252E2A" : "#E2E8DE";

  const hoverStyle = useAnimatedStyle(() => {
    const oR = hoverRow.value;
    const oC = hoverCol.value;
    const shape = dragShape.value;
    let inShape = false;
    for (let i = 0; i < shape.length; i += 2) {
      if (oR + shape[i] === row && oC + shape[i + 1] === col) {
        inShape = true;
        break;
      }
    }
    if (!inShape) {
      return { opacity: withTiming(0, { duration: 90 }) };
    }
    const valid = hoverValid.value === 1;
    return {
      opacity: withTiming(valid ? 0.55 : 0.4, { duration: 90 }),
      backgroundColor: valid ? "#7CE0B0" : "#F09090",
    };
  });

  return (
    <Animated.View
      style={{
        width: cellSize,
        height: cellSize,
        borderRadius: 8,
        backgroundColor: cell.filled ? (cell.color ?? emptyBg) : emptyBg,
        borderWidth: cell.filled ? 0 : 1,
        borderColor: emptyBorder,
        overflow: "hidden",
        ...(cell.filled && !IS_ANDROID
          ? {
              shadowColor: cell.color ?? "#000",
              shadowOpacity: 0.35,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
            }
          : null),
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            borderRadius: 8,
          },
          hoverStyle,
        ]}
      />
    </Animated.View>
  );
}

export const PuzzleCell = memo(
  PuzzleCellImpl,
  (prev, next) =>
    prev.row === next.row &&
    prev.col === next.col &&
    prev.cellSize === next.cellSize &&
    prev.cell.filled === next.cell.filled &&
    prev.cell.color === next.cell.color,
);
