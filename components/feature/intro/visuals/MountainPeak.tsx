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
import Svg, { Circle, Path, Polygon } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

const W = 320;
const H = 220;
const PATH_D =
  "M 60 198 C 80 188 88 174 100 158 C 112 140 122 124 132 110 C 142 96 150 80 162 64";
const PATH_LEN = 220;
const POLE_LEN = 36;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

type Props = { active: boolean };

export function MountainPeak({ active }: Props) {
  const { colors } = useTheme();
  const back = useSharedValue(0);
  const front = useSharedValue(0);
  const path = useSharedValue(0);
  const flag = useSharedValue(0);
  const flagWave = useSharedValue(0);
  const sparkle = useSharedValue(0);

  useEffect(() => {
    if (active) {
      back.value = 0;
      front.value = 0;
      path.value = 0;
      flag.value = 0;
      flagWave.value = 0;
      sparkle.value = 0;

      back.value = withTiming(1, { duration: 600 });
      front.value = withDelay(180, withTiming(1, { duration: 600 }));
      path.value = withDelay(420, withTiming(1, { duration: 1100 }));
      flag.value = withDelay(
        1400,
        withTiming(1, { duration: 480, easing: Easing.out(Easing.back(1.6)) }),
      );
      flagWave.value = withDelay(
        1700,
        withSequence(
          withTiming(1, { duration: 380 }),
          withTiming(-0.6, { duration: 380 }),
          withTiming(0.4, { duration: 380 }),
          withTiming(0, { duration: 380 }),
        ),
      );
      sparkle.value = withDelay(1700, withTiming(1, { duration: 600 }));
    } else {
      back.value = 0;
      front.value = 0;
      path.value = 0;
      flag.value = 0;
      flagWave.value = 0;
      sparkle.value = 0;
    }
  }, [active, back, front, path, flag, flagWave, sparkle]);

  const backProps = useAnimatedProps(() => ({ opacity: back.value }));
  const frontProps = useAnimatedProps(() => ({ opacity: front.value }));
  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: PATH_LEN * (1 - path.value),
  }));
  const poleProps = useAnimatedProps(() => ({
    strokeDashoffset: POLE_LEN * (1 - flag.value),
  }));
  const flagProps = useAnimatedProps(() => {
    const w = flagWave.value;
    const tipX = 188 + w * 4;
    const tipY = 50 + w * 3;
    const midX = 174 - w * 2;
    const midY = 58;
    return { points: `162,42 ${tipX},${tipY} ${midX},${midY}` };
  });

  const sparkleStyle = useAnimatedStyle(() => ({ opacity: sparkle.value }));

  return (
    <View className="w-full items-center" style={{ height: H }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <AnimatedPolygon
          animatedProps={backProps}
          points="200,200 270,90 320,200"
          fill={colors.secondary}
        />
        <AnimatedPolygon
          animatedProps={frontProps}
          points="20,200 162,40 280,200"
          fill={colors.primary}
        />

        <AnimatedPath
          d={PATH_D}
          stroke={colors.background}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 9"
          animatedProps={pathProps}
        />

        <AnimatedPath
          d="M 162 40 L 162 76"
          stroke={colors.background}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${POLE_LEN} ${POLE_LEN}`}
          animatedProps={poleProps}
        />
        <AnimatedPolygon animatedProps={flagProps} fill={colors.background} />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[
          sparkleStyle,
          { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 },
        ]}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Circle cx={142} cy={28} r={2.8} fill={colors.primary} />
          <Circle cx={196} cy={36} r={2.2} fill={colors.primary} />
          <Circle cx={210} cy={70} r={1.8} fill={colors.primary} />
          <Circle cx={130} cy={56} r={1.6} fill={colors.primary} />
        </Svg>
      </Animated.View>
    </View>
  );
}
