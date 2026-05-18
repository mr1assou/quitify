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
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const W = 320;
const H = 240;
const STEP_COUNT = 4;
const STEP_W = 60;
const STEP_RISE = 38;
const BASE_X = 30;
const FLOOR_Y = 220;
const STEP0_TOP_Y = 200;
const DOT_R = 9;
const HOP_HEIGHT = 38;

const stepX = (i: number) => BASE_X + i * STEP_W;
const stepTopY = (i: number) => STEP0_TOP_Y - i * STEP_RISE;
const stepCenterX = (i: number) => stepX(i) + STEP_W / 2;

const STEP0_TOP = stepTopY(0);
const STEP1_TOP = stepTopY(1);
const STEP2_TOP = stepTopY(2);
const STEP3_TOP = stepTopY(3);

const STEP0_TARGET_H = FLOOR_Y - STEP0_TOP;
const STEP1_TARGET_H = FLOOR_Y - STEP1_TOP;
const STEP2_TARGET_H = FLOOR_Y - STEP2_TOP;
const STEP3_TARGET_H = FLOOR_Y - STEP3_TOP;

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { active: boolean };

export function AscendingSteps({ active }: Props) {
  const { colors } = useTheme();
  const reveal = useSharedValue(0);
  const dot = useSharedValue(0);
  const check = useSharedValue(0);
  const checkPulse = useSharedValue(0);

  useEffect(() => {
    if (active) {
      reveal.value = 0;
      dot.value = 0;
      check.value = 0;
      checkPulse.value = 0;

      reveal.value = withTiming(STEP_COUNT, {
        duration: STEP_COUNT * 200,
        easing: Easing.out(Easing.cubic),
      });
      dot.value = withDelay(
        STEP_COUNT * 200 + 150,
        withTiming(STEP_COUNT - 1, {
          duration: (STEP_COUNT - 1) * 460,
          easing: Easing.linear,
        }),
      );
      check.value = withDelay(
        STEP_COUNT * 200 + 150 + (STEP_COUNT - 1) * 460 + 120,
        withTiming(1, {
          duration: 420,
          easing: Easing.out(Easing.back(1.8)),
        }),
      );
      checkPulse.value = withDelay(
        STEP_COUNT * 200 + 150 + (STEP_COUNT - 1) * 460 + 540,
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 0 }),
        ),
      );
    } else {
      reveal.value = 0;
      dot.value = 0;
      check.value = 0;
      checkPulse.value = 0;
    }
  }, [active, reveal, dot, check, checkPulse]);

  const step0Props = useAnimatedProps(() => {
    const p = Math.max(0, Math.min(1, reveal.value - 0));
    const h = STEP0_TARGET_H * p;
    return { y: FLOOR_Y - h, height: h, opacity: 0.25 + p * 0.75 };
  });
  const step1Props = useAnimatedProps(() => {
    const p = Math.max(0, Math.min(1, reveal.value - 1));
    const h = STEP1_TARGET_H * p;
    return { y: FLOOR_Y - h, height: h, opacity: 0.25 + p * 0.75 };
  });
  const step2Props = useAnimatedProps(() => {
    const p = Math.max(0, Math.min(1, reveal.value - 2));
    const h = STEP2_TARGET_H * p;
    return { y: FLOOR_Y - h, height: h, opacity: 0.25 + p * 0.75 };
  });
  const step3Props = useAnimatedProps(() => {
    const p = Math.max(0, Math.min(1, reveal.value - 3));
    const h = STEP3_TARGET_H * p;
    return { y: FLOOR_Y - h, height: h, opacity: 0.25 + p * 0.75 };
  });

  const dotProps = useAnimatedProps(() => {
    "worklet";
    const p = Math.max(0, Math.min(STEP_COUNT - 1, dot.value));
    const i = Math.min(STEP_COUNT - 2, Math.floor(p));
    const f = Math.max(0, Math.min(1, p - i));

    const x0 = BASE_X + i * STEP_W + STEP_W / 2;
    const y0 = STEP0_TOP_Y - i * STEP_RISE;
    const x1 = BASE_X + (i + 1) * STEP_W + STEP_W / 2;
    const y1 = STEP0_TOP_Y - (i + 1) * STEP_RISE;

    const x = x0 + (x1 - x0) * f;
    const baseY = y0 + (y1 - y0) * f;
    const hop = -HOP_HEIGHT * 4 * f * (1 - f);

    const visible = reveal.value >= STEP_COUNT ? 1 : 0;

    return {
      cx: x,
      cy: baseY + hop - DOT_R - 1,
      opacity: visible,
    };
  });

  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: check.value }],
  }));

  const pulseProps = useAnimatedProps(() => {
    const p = checkPulse.value;
    return {
      r: 14 + p * 26,
      opacity: p > 0.001 ? (1 - p) * 0.6 : 0,
    };
  });

  const lastStepCenterX = stepCenterX(STEP_COUNT - 1);
  const lastStepTopY = stepTopY(STEP_COUNT - 1);
  const checkCx = lastStepCenterX;
  const checkCy = lastStepTopY - 32;

  return (
    <View
      className="w-full items-center justify-center"
      style={{ height: H }}
    >
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line
          x1={BASE_X - 6}
          y1={FLOOR_Y}
          x2={BASE_X + STEP_COUNT * STEP_W + 6}
          y2={FLOOR_Y}
          stroke={colors.primary}
          strokeOpacity={0.35}
          strokeWidth={2}
          strokeLinecap="round"
        />

        <AnimatedRect
          x={stepX(0)}
          width={STEP_W}
          fill={colors.secondary}
          animatedProps={step0Props}
        />
        <AnimatedRect
          x={stepX(1)}
          width={STEP_W}
          fill={colors.primary}
          animatedProps={step1Props}
        />
        <AnimatedRect
          x={stepX(2)}
          width={STEP_W}
          fill={colors.secondary}
          animatedProps={step2Props}
        />
        <AnimatedRect
          x={stepX(3)}
          width={STEP_W}
          fill={colors.primary}
          animatedProps={step3Props}
        />

        <AnimatedCircle
          cx={checkCx}
          cy={checkCy}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
          animatedProps={pulseProps}
        />

        <AnimatedCircle
          r={DOT_R}
          fill={colors.background}
          stroke={colors.primary}
          strokeWidth={3}
          animatedProps={dotProps}
        />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[
          checkStyle,
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            transformOrigin: `${checkCx}px ${checkCy}px`,
          },
        ]}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Circle cx={checkCx} cy={checkCy} r={16} fill={colors.primary} />
          <Path
            d={`M ${checkCx - 7} ${checkCy} L ${checkCx - 1} ${checkCy + 6} L ${checkCx + 8} ${checkCy - 5}`}
            stroke={colors.background}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
