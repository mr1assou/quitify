import { memo } from "react";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { BUBBLE_SHOOTER_PALETTE } from "@/constants/craving/games/bubbleShooter";
import type { BubbleColor } from "@/utils/craving/games/bubbleShooterGrid";

type Props = {
  x: number;
  y: number;
  radius: number;
  color: BubbleColor;
};

function BubbleShooterBubbleImpl({ x, y, radius, color }: Props) {
  const palette = BUBBLE_SHOOTER_PALETTE[color];
  const gradientId = `bubble-gradient-${color}`;
  const size = radius * 2;
  const strokeWidth = Math.max(1.25, radius * 0.07);

  return (
    <Svg
      style={{ position: "absolute", left: x - radius, top: y - radius }}
      width={size}
      height={size}
    >
      <Defs>
        <RadialGradient
          id={gradientId}
          cx="32%"
          cy="28%"
          rx="68%"
          ry="68%"
          fx="28%"
          fy="22%"
        >
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <Stop offset="18%" stopColor={palette.fill} stopOpacity="1" />
          <Stop offset="72%" stopColor={palette.fill} stopOpacity="1" />
          <Stop offset="100%" stopColor={palette.shade} stopOpacity="1" />
        </RadialGradient>
      </Defs>

      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill={`url(#${gradientId})`}
        stroke={palette.stroke}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={radius * 0.66}
        cy={radius * 0.58}
        r={radius * 0.2}
        fill="#FFFFFF"
        opacity={0.55}
      />
      <Circle
        cx={radius * 0.54}
        cy={radius * 0.5}
        r={radius * 0.07}
        fill="#FFFFFF"
        opacity={0.9}
      />
    </Svg>
  );
}

export const BubbleShooterBubble = memo(BubbleShooterBubbleImpl);
