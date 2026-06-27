import { useWindowDimensions, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { SCREEN_GRADIENT } from "@/constants/app/screenBackground";

type Props = {
  isDark: boolean;
  /** Soft brand orbs behind content (paywall only — use inline orbs there). */
  showOrbs?: boolean;
};

export function AppScreenBackground({ isDark, showOrbs = false }: Props) {
  const { width, height } = useWindowDimensions();
  const stops = isDark ? SCREEN_GRADIENT.dark : SCREEN_GRADIENT.light;
  const gradId = isDark ? "appScreenGradDark" : "appScreenGradLight";

  return (
    <>
      <Svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0.15" y2="1">
            <Stop offset="0" stopColor={stops.top} stopOpacity={1} />
            <Stop offset="0.55" stopColor={stops.mid} stopOpacity={1} />
            <Stop offset="1" stopColor={stops.bottom} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${gradId})`} />
      </Svg>

      {showOrbs ? (
        <>
          <View
            pointerEvents="none"
            className="absolute -right-12 top-20 h-56 w-56 rounded-full bg-primary/15 dark:bg-primary/20"
          />
          <View
            pointerEvents="none"
            className="absolute -left-20 top-[38%] h-48 w-48 rounded-full bg-primary/8 dark:bg-primary/12"
          />
          <View
            pointerEvents="none"
            className="absolute -right-8 bottom-32 h-40 w-40 rounded-full bg-secondary/20 dark:bg-secondary/10"
          />
        </>
      ) : null}
    </>
  );
}
