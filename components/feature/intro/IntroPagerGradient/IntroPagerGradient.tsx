import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import type { ThemeColors } from "@/constants/app/theme";

type Props = {
  width: number;
  height: number;
  colors: ThemeColors;
  isDark: boolean;
  gradientIdSuffix: string;
};

export function IntroPagerGradient({
  width,
  height,
  colors,
  isDark,
  gradientIdSuffix,
}: Props) {
  const top = colors.background;
  const mid = colors.section;
  const bottom = isDark ? "#161210" : colors.border;
  const gid = `introPagerGrad_${gradientIdSuffix}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} stopOpacity={1} />
          <Stop offset="0.45" stopColor={mid} stopOpacity={1} />
          <Stop offset="1" stopColor={bottom} stopOpacity={1} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${gid})`} />
    </Svg>
  );
}
