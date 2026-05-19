import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { ShapeRenderer } from "@/components/feature/craving/games/calm-focus-puzzle/ShapeRenderer";
import { PUZZLE_GRID_GAP } from "@/constants/calmFocusPuzzle";
import type { TrayPiece } from "@/hooks/useCalmFocusPuzzleGame";

type Props = {
  piece: TrayPiece | null;
  cellSize: number;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  dragActive: SharedValue<number>;
  boardLeft: SharedValue<number>;
  boardTop: SharedValue<number>;
};

/** Floating shape that follows the finger while dragging.
 *
 * `dragX`/`dragY` are in window coordinates (from gesture `absoluteX/Y`).
 * The layer itself is positioned absolutely inside `PuzzleBoard`, so we
 * subtract the board's window offset when applying the transform.
 */
export function PuzzleDragLayer({
  piece,
  cellSize,
  dragX,
  dragY,
  dragActive,
  boardLeft,
  boardTop,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.value - boardLeft.value },
      { translateY: dragY.value - boardTop.value },
    ],
    opacity: dragActive.value === 1 ? 1 : 0,
  }));

  if (!piece) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
        },
        animatedStyle,
      ]}
    >
      <ShapeRenderer
        shape={piece.shape}
        rotation={piece.rotation}
        color={piece.color}
        cellSize={cellSize}
        gap={PUZZLE_GRID_GAP}
      />
    </Animated.View>
  );
}
