import Svg, { Circle } from "react-native-svg";

import {
  COLOR_SWITCH_BALL_RADIUS,
  COLOR_SWITCH_PALETTE,
  type ColorSwitchColor,
} from "@/constants/craving/games/colorSwitch";

type Props = {
  x: number;
  y: number;
  color: ColorSwitchColor;
};

export function ColorSwitchBall({ x, y, color }: Props) {
  const size = COLOR_SWITCH_BALL_RADIUS * 4;
  const cx = size / 2;
  const cy = size / 2;
  const fill = COLOR_SWITCH_PALETTE[color];

  return (
    <Svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
      }}
    >
      <Circle cx={cx} cy={cy} r={COLOR_SWITCH_BALL_RADIUS + 5} fill={`${fill}33`} />
      <Circle cx={cx} cy={cy} r={COLOR_SWITCH_BALL_RADIUS} fill={fill} />
      <Circle
        cx={cx - 3}
        cy={cy - 3}
        r={COLOR_SWITCH_BALL_RADIUS * 0.28}
        fill="#FFFFFF"
        opacity={0.75}
      />
    </Svg>
  );
}
