import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Polygon, Rect } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const SIZE = 280;
const CENTER = SIZE / 2;
const R_OUTER = 110;
const R_MID = 78;
const R_INNER = 48;
const STROKE = 12;

const C_OUTER = 2 * Math.PI * R_OUTER;
const C_MID = 2 * Math.PI * R_MID;
const C_INNER = 2 * Math.PI * R_INNER;
const C_PULSE_DASH = 2 * Math.PI * 24 * 4;

const ARROW_FROM = -120;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { active: boolean };

export function TargetArrow({ active }: Props) {
  const { colors } = useTheme();
  const ringOuter = useSharedValue(0);
  const ringMid = useSharedValue(0);
  const ringInner = useSharedValue(0);
  const bullseye = useSharedValue(0);
  const arrow = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (active) {
      ringOuter.value = 0;
      ringMid.value = 0;
      ringInner.value = 0;
      bullseye.value = 0;
      arrow.value = 0;
      pulse.value = 0;

      ringOuter.value = withTiming(1, { duration: 480 });
      ringMid.value = withDelay(160, withTiming(1, { duration: 480 }));
      ringInner.value = withDelay(320, withTiming(1, { duration: 480 }));
      bullseye.value = withDelay(
        520,
        withTiming(1, {
          duration: 380,
          easing: Easing.out(Easing.back(1.6)),
        }),
      );
      arrow.value = withDelay(
        980,
        withTiming(1, {
          duration: 520,
          easing: Easing.in(Easing.cubic),
        }),
      );
      pulse.value = withDelay(
        1500,
        withSequence(
          withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 0 }),
        ),
      );
    } else {
      ringOuter.value = 0;
      ringMid.value = 0;
      ringInner.value = 0;
      bullseye.value = 0;
      arrow.value = 0;
      pulse.value = 0;
    }
  }, [active, ringOuter, ringMid, ringInner, bullseye, arrow, pulse]);

  const outerProps = useAnimatedProps(() => ({
    strokeDashoffset: C_OUTER * (1 - ringOuter.value),
  }));
  const midProps = useAnimatedProps(() => ({
    strokeDashoffset: C_MID * (1 - ringMid.value),
  }));
  const innerProps = useAnimatedProps(() => ({
    strokeDashoffset: C_INNER * (1 - ringInner.value),
  }));

  const bullseyeStyle = useAnimatedStyle(() => ({
    opacity: bullseye.value,
    transform: [{ scale: bullseye.value }],
  }));

  const arrowStyle = useAnimatedStyle(() => {
    const inv = 1 - arrow.value;
    return {
      opacity: arrow.value > 0 ? 1 : 0,
      transform: [
        { translateX: ARROW_FROM * inv },
        { translateY: ARROW_FROM * inv },
      ],
    };
  });

  const pulseProps = useAnimatedProps(() => {
    const p = pulse.value;
    return {
      r: 24 + p * 86,
      opacity: p > 0.001 ? (1 - p) * 0.55 : 0,
    };
  });

  return (
    <View
      className="w-full items-center justify-center"
      style={{ height: SIZE }}
    >
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <G transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={R_OUTER}
              stroke={colors.secondary}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C_OUTER} ${C_OUTER}`}
              animatedProps={outerProps}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={R_MID}
              stroke={colors.primary}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C_MID} ${C_MID}`}
              animatedProps={midProps}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={R_INNER}
              stroke={colors.secondary}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${C_INNER} ${C_INNER}`}
              animatedProps={innerProps}
            />
          </G>

          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            r={24}
            stroke={colors.primary}
            strokeWidth={3}
            fill="none"
            strokeDasharray={`${C_PULSE_DASH} ${C_PULSE_DASH}`}
            animatedProps={pulseProps}
          />
        </Svg>

        <Animated.View
          pointerEvents="none"
          style={[
            bullseyeStyle,
            {
              position: "absolute",
              width: SIZE,
              height: SIZE,
              left: 0,
              top: 0,
            },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={CENTER} cy={CENTER} r={20} fill={colors.primary} />
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            arrowStyle,
            {
              position: "absolute",
              width: SIZE,
              height: SIZE,
              left: 0,
              top: 0,
            },
          ]}
        >
          <Svg width={SIZE} height={SIZE}>
            <G transform={`translate(${CENTER} ${CENTER}) rotate(45)`}>
              <Rect
                x={-46}
                y={-3}
                width={68}
                height={6}
                rx={3}
                fill={colors.primary}
              />
              <Polygon points="22,-12 44,0 22,12" fill={colors.primary} />
              <Polygon
                points="-46,-9 -36,0 -46,9 -56,0"
                fill={colors.primary}
              />
            </G>
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}
