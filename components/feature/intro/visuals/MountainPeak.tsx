import { View } from "react-native";
import Svg, { Circle, Path, Polygon } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const W = 320;
const H = 220;
const PATH_D =
  "M 60 198 C 80 188 88 174 100 158 C 112 140 122 124 132 110 C 142 96 150 80 162 64";

type Props = { active?: boolean };

/** Static mountain hero for the first intro slide (no enter/loop animation). */
export function MountainPeak(_props: Props) {
  const { colors } = useTheme();

  return (
    <View className="w-full items-center" style={{ height: H }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Polygon points="200,200 270,90 320,200" fill={colors.secondary} />
        <Polygon points="20,200 162,40 280,200" fill={colors.primary} />

        <Path
          d={PATH_D}
          stroke={colors.background}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 9"
        />

        <Path
          d="M 162 40 L 162 76"
          stroke={colors.background}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
        <Polygon points="162,42 188,50 174,58" fill={colors.background} />

        <Circle cx={142} cy={28} r={2.8} fill={colors.primary} />
        <Circle cx={196} cy={36} r={2.2} fill={colors.primary} />
        <Circle cx={210} cy={70} r={1.8} fill={colors.primary} />
        <Circle cx={130} cy={56} r={1.6} fill={colors.primary} />
      </Svg>
    </View>
  );
}
