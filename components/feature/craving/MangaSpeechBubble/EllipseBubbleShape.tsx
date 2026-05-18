import { Path, Svg } from "react-native-svg";

type Props = {
  width: number;
  height: number;
  stroke: string;
  fill: string;
  /** Where the tail base sits along the bottom edge (0 = left, 1 = right). */
  tailAnchor?: number;
  /** Horizontal offset of the tail tip from the base center (negative = points left). */
  tailTipOffsetX?: number;
  /** Vertical drop of the tail tip below the ellipse. */
  tailTipOffsetY?: number;
  /** Width of the tail base where it meets the ellipse. */
  tailBaseWidth?: number;
  strokeWidth?: number;
};

/** Smooth oval speech bubble with a single pointed tail (single SVG path). */
export function EllipseBubbleShape({
  width,
  height,
  stroke,
  fill,
  tailAnchor = 0.22,
  tailTipOffsetX = -14,
  tailTipOffsetY = 22,
  tailBaseWidth = 28,
  strokeWidth = 1.5,
}: Props) {
  const pad = strokeWidth / 2;
  const ellipseW = width - pad * 2;
  const ellipseH = height - pad * 2 - Math.max(tailTipOffsetY, 0);
  const cx = pad + ellipseW / 2;
  const cy = pad + ellipseH / 2;
  const rx = ellipseW / 2;
  const ry = ellipseH / 2;

  const baseCenterX = pad + tailAnchor * ellipseW;
  const baseLeftX = baseCenterX - tailBaseWidth / 2;
  const baseRightX = baseCenterX + tailBaseWidth / 2;

  // y on lower half of the ellipse for a given x
  const yOnEllipse = (x: number) =>
    cy + ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));

  const baseLeftY = yOnEllipse(baseLeftX);
  const baseRightY = yOnEllipse(baseRightX);
  const tipX = baseCenterX + tailTipOffsetX;
  const tipY = pad + ellipseH + tailTipOffsetY;

  // Arc from baseRight over the top to baseLeft, down to tip, back up to baseRight.
  const d = [
    `M ${baseRightX.toFixed(2)} ${baseRightY.toFixed(2)}`,
    `A ${rx} ${ry} 0 1 0 ${baseLeftX.toFixed(2)} ${baseLeftY.toFixed(2)}`,
    `L ${tipX.toFixed(2)} ${tipY.toFixed(2)}`,
    `Z`,
  ].join(" ");

  return (
    <Svg width={width} height={height}>
      <Path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
