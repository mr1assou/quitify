import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const SIZE = 280;
const CENTER = SIZE / 2;
const R = 96;
const STROKE = 8;
const C = 2 * Math.PI * R;
const TICK_COUNT = 12;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { active: boolean };

export function Stopwatch({ active }: Props) {
  const { colors } = useTheme();
  const dial = useSharedValue(0);
  const ticks = useSharedValue(0);
  const center = useSharedValue(0);
  const handAngle = useSharedValue(0);

  useEffect(() => {
    if (active) {
      dial.value = 0;
      ticks.value = 0;
      center.value = 0;
      handAngle.value = 0;

      dial.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      ticks.value = withDelay(620, withTiming(1, { duration: 380 }));
      center.value = withDelay(
        780,
        withTiming(1, {
          duration: 320,
          easing: Easing.out(Easing.back(1.6)),
        }),
      );
      handAngle.value = withDelay(
        900,
        withRepeat(
          withTiming(360, { duration: 1500, easing: Easing.linear }),
          -1,
          false,
        ),
      );
    } else {
      dial.value = 0;
      ticks.value = 0;
      center.value = 0;
      handAngle.value = 0;
    }
  }, [active, dial, ticks, center, handAngle]);

  const dialProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - dial.value),
  }));

  const ticksStyle = useAnimatedStyle(() => ({ opacity: ticks.value }));

  const crownStyle = useAnimatedStyle(() => ({
    opacity: dial.value,
    transform: [{ scale: 0.6 + dial.value * 0.4 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: dial.value,
  }));

  const centerStyle = useAnimatedStyle(() => ({
    opacity: center.value,
    transform: [{ scale: center.value }],
  }));

  const handStyle = useAnimatedStyle(() => ({
    opacity: center.value,
    transform: [{ rotate: `${handAngle.value}deg` }],
  }));

  return (
    <View
      className="w-full items-center justify-center"
      style={{ height: SIZE }}
    >
      <View style={{ width: SIZE, height: SIZE }}>
        <Animated.View
          pointerEvents="none"
          style={[
            crownStyle,
            {
              position: "absolute",
              top: 14,
              left: CENTER - 14,
              width: 28,
              height: 14,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            crownStyle,
            {
              position: "absolute",
              top: 4,
              left: CENTER - 8,
              width: 16,
              height: 10,
              borderRadius: 4,
              backgroundColor: colors.primary,
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            ringStyle,
            { position: "absolute", left: 0, top: 0, width: SIZE, height: SIZE },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={R + 2}
              stroke={colors.secondary}
              strokeOpacity={0.35}
              strokeWidth={1.5}
              fill="none"
            />
          </Svg>
        </Animated.View>

        <Svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <G transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={R}
              stroke={colors.primary}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C} ${C}`}
              animatedProps={dialProps}
            />
          </G>
        </Svg>

        <Animated.View
          pointerEvents="none"
          style={[
            ticksStyle,
            { position: "absolute", left: 0, top: 0, width: SIZE, height: SIZE },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            {Array.from({ length: TICK_COUNT }).map((_, i) => {
              const deg = i * (360 / TICK_COUNT);
              const rad = ((deg - 90) * Math.PI) / 180;
              const isMajor = i % 3 === 0;
              const inner = R - (isMajor ? 18 : 10);
              const outer = R - 4;
              return (
                <Line
                  key={deg}
                  x1={CENTER + Math.cos(rad) * inner}
                  y1={CENTER + Math.sin(rad) * inner}
                  x2={CENTER + Math.cos(rad) * outer}
                  y2={CENTER + Math.sin(rad) * outer}
                  stroke={colors.primary}
                  strokeWidth={isMajor ? 4 : 2.5}
                  strokeLinecap="round"
                  strokeOpacity={isMajor ? 1 : 0.55}
                />
              );
            })}
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            handStyle,
            { position: "absolute", left: 0, top: 0, width: SIZE, height: SIZE },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Line
              x1={CENTER}
              y1={CENTER + 12}
              x2={CENTER}
              y2={CENTER - R + 22}
              stroke={colors.primary}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            centerStyle,
            { position: "absolute", left: 0, top: 0, width: SIZE, height: SIZE },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={CENTER} cy={CENTER} r={9} fill={colors.primary} />
            <Circle cx={CENTER} cy={CENTER} r={3.5} fill={colors.background} />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}
