import Svg, { Circle } from "react-native-svg";

import {
  COLOR_SWITCH_COLOR_ORDER,
  COLOR_SWITCH_ORB_RADIUS,
  COLOR_SWITCH_PALETTE,
} from "@/constants/craving/games/colorSwitch";

type Props = {
  x: number;
  y: number;
};

export function ColorSwitchOrbSprite({ x, y }: Props) {
  const size = COLOR_SWITCH_ORB_RADIUS * 4;
  const cx = size / 2;
  const cy = size / 2;

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
      <Circle cx={cx} cy={cy} r={COLOR_SWITCH_ORB_RADIUS + 5} fill="#FFFFFF18" />
      <Circle cx={cx} cy={cy} r={COLOR_SWITCH_ORB_RADIUS} fill="#1A1A28" />
      {COLOR_SWITCH_COLOR_ORDER.map((color, index) => {
        const angle = (index / COLOR_SWITCH_COLOR_ORDER.length) * Math.PI * 2;
        const dotR = COLOR_SWITCH_ORB_RADIUS * 0.55;
        return (
          <Circle
            key={color}
            cx={cx + Math.sin(angle) * dotR}
            cy={cy - Math.cos(angle) * dotR}
            r={4.5}
            fill={COLOR_SWITCH_PALETTE[color]}
          />
        );
      })}
    </Svg>
  );
}
