import { Platform, View } from "react-native";

import {
  rotateShape,
  shapeBoundingBox,
  type Rotation,
  type ShapeCells,
} from "@/constants/calmFocusPuzzle";

const IS_ANDROID = Platform.OS === "android";

type Props = {
  shape: ShapeCells;
  rotation: Rotation;
  color: string;
  cellSize: number;
  gap?: number;
  opacity?: number;
};

/** Pure visual: draws a shape as a grid of coloured tiles. */
export function ShapeRenderer({
  shape,
  rotation,
  color,
  cellSize,
  gap = 2,
  opacity = 1,
}: Props) {
  const rotated = rotateShape(shape, rotation);
  const { rows, cols } = shapeBoundingBox(rotated);
  const w = cols * cellSize + (cols - 1) * gap;
  const h = rows * cellSize + (rows - 1) * gap;
  const filled = new Set(rotated.map(([r, c]) => `${r}:${c}`));

  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (!filled.has(`${r}:${c}`)) continue;
      tiles.push(
        <View
          key={`${r}:${c}`}
          style={{
            position: "absolute",
            left: c * (cellSize + gap),
            top: r * (cellSize + gap),
            width: cellSize,
            height: cellSize,
            borderRadius: Math.max(4, cellSize * 0.18),
            backgroundColor: color,
            ...(IS_ANDROID
              ? null
              : {
                  shadowColor: color,
                  shadowOpacity: 0.4,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                }),
          }}
        />,
      );
    }
  }

  return <View style={{ width: w, height: h, opacity }}>{tiles}</View>;
}
