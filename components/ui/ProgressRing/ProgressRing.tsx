import { useEffect, type ReactNode } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  /** Track (background) stroke color. */
  trackColor?: string;
  /** Progress (foreground) stroke color. */
  color?: string;
  /** Optional content rendered inside the ring (numbers, icons). */
  children?: ReactNode;
  duration?: number;
  /**
   * If true, the arc only sweeps the bottom 270° (top is open).
   * Matches the "speedometer" hero rings on the inspiration screens.
   */
  openTop?: boolean;
};

export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 10,
  trackColor: trackColorProp,
  color: colorProp,
  children,
  duration = 900,
  openTop = false,
}: Props) {
  const { colors } = useTheme();
  const trackColor = trackColorProp ?? colors.section;
  const color = colorProp ?? colors.primary;

  const radius = (size - strokeWidth) / 2;
  const sweep = openTop ? 0.75 : 1;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * sweep;
  const gapLength = circumference - arcLength;

  const v = useSharedValue(progress);
  useEffect(() => {
    v.value = withTiming(Math.min(1, Math.max(0, progress)), { duration });
  }, [progress, duration, v]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: arcLength * (1 - v.value),
  }));

  const rotation = openTop ? 135 : -90;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: `${rotation}deg` }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View className="items-center justify-center">{children}</View>
    </View>
  );
}
