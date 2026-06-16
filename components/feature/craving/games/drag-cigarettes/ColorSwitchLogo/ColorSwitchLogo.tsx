import Svg, { Circle, Path } from "react-native-svg";

import {
  COLOR_SWITCH_COLOR_ORDER,
  COLOR_SWITCH_PALETTE,
} from "@/constants/craving/games/colorSwitch";

type Props = {
  size: number;
};

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + radius * Math.sin(rad),
    y: cy - radius * Math.cos(rad),
  };
}

function segmentPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const oStart = polar(cx, cy, outerR, startDeg);
  const oEnd = polar(cx, cy, outerR, endDeg);
  const iEnd = polar(cx, cy, innerR, endDeg);
  const iStart = polar(cx, cy, innerR, startDeg);
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

export function ColorSwitchLogo({ size }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.18;

  return (
    <Svg width={size} height={size}>
      {COLOR_SWITCH_COLOR_ORDER.map((color, index) => {
        const start = index * 90;
        const end = start + 90;
        return (
          <Path
            key={color}
            d={segmentPath(cx, cy, innerR, outerR, start, end)}
            fill={COLOR_SWITCH_PALETTE[color]}
          />
        );
      })}
      <Circle cx={cx} cy={cy} r={size * 0.09} fill="#FFFFFF" />
    </Svg>
  );
}
