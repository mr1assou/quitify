import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from "react-native-svg";

import {
  SPIN_WHEEL_SEGMENT_IDS,
  SPIN_WHEEL_WIN_INDEX,
} from "@/constants/paywall/spinWheel";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const WHEEL_SIZE = 300;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 8;
const SEGMENT_COUNT = SPIN_WHEEL_SEGMENT_IDS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

const SEGMENT_COLORS = [
  "#F97316",
  "#1F2937",
  "#0EA5A4",
  "#1F2937",
  "#6366F1",
  "#1F2937",
  "#14B8A6",
  "#1F2937",
] as const;

const FALLBACK_LABELS = [
  "VIP",
  "10% OFF",
  "15% OFF",
  "5% OFF",
  "20% OFF",
  "8% OFF",
  "12% OFF",
  "25% OFF",
] as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

type Props = {
  winLabel: string;
  onWon: () => void;
};

export function PaywallSpinWheel({ winLabel, onWon }: Props) {
  const { t } = useTranslation();
  const rotation = useSharedValue(0);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);

  const segmentLabels = useMemo(() => {
    return SPIN_WHEEL_SEGMENT_IDS.map((_, index) =>
      index === SPIN_WHEEL_WIN_INDEX
        ? winLabel || FALLBACK_LABELS[index]
        : FALLBACK_LABELS[index],
    );
  }, [winLabel]);

  const slices = useMemo(
    () =>
      SPIN_WHEEL_SEGMENT_IDS.map((id, index) => {
        const start = index * SEGMENT_ANGLE;
        const end = start + SEGMENT_ANGLE;
        const mid = start + SEGMENT_ANGLE / 2;
        const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, mid);
        return {
          id,
          label: segmentLabels[index],
          path: describeSlice(start, end),
          color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
          labelX: labelPos.x,
          labelY: labelPos.y,
        };
      }),
    [segmentLabels],
  );

  const finishSpin = useCallback(() => {
    setSpinning(false);
    setDone(true);
    onWon();
  }, [onWon]);

  const spin = () => {
    if (spinning || done) return;
    setSpinning(true);

    const winMid = SPIN_WHEEL_WIN_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraTurns = 5 + Math.floor(Math.random() * 2);
    const target = extraTurns * 360 + (360 - winMid);

    rotation.value = withTiming(
      target,
      {
        duration: 4200,
        easing: Easing.bezier(0.12, 0.75, 0.15, 1),
      },
      (finished) => {
        if (finished) runOnJS(finishSpin)();
      },
    );
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="items-center">
      <Text className="mb-4 px-4 text-center text-base font-semibold text-d-muted">
        {done
          ? t("paywall.spinWonTitle", { price: winLabel })
          : t("paywall.spinPrompt")}
      </Text>

      <View
        className="items-center justify-center"
        style={{ width: WHEEL_SIZE, height: WHEEL_SIZE + 28 }}
      >
        <View className="absolute top-0 z-10 items-center" style={{ width: WHEEL_SIZE }}>
          <Svg width={28} height={34}>
            <Polygon points="14,34 0,4 28,4" fill="#F97316" />
            <Circle cx={14} cy={8} r={4} fill="#FFF7ED" />
          </Svg>
        </View>

        <Animated.View style={[{ marginTop: 18, width: WHEEL_SIZE, height: WHEEL_SIZE }, wheelStyle]}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 6}
              fill="#111827"
              stroke="#F97316"
              strokeWidth={4}
            />
            {slices.map((slice) => (
              <G key={slice.id}>
                <Path d={slice.path} fill={slice.color} stroke="#0B1220" strokeWidth={2} />
                <SvgText
                  x={slice.labelX}
                  y={slice.labelY}
                  fill="#FFFFFF"
                  fontSize={11}
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {slice.label}
                </SvgText>
              </G>
            ))}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={28}
              fill="#0B1220"
              stroke="#F97316"
              strokeWidth={3}
            />
            <SvgText
              x={CENTER}
              y={CENTER + 1}
              fill="#F97316"
              fontSize={11}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              VIP
            </SvgText>
          </Svg>
        </Animated.View>
      </View>

      {!done ? (
        <Pressable
          onPress={spin}
          disabled={spinning}
          className={`mt-6 rounded-full bg-primary px-10 py-3.5 active:opacity-80 ${
            spinning ? "opacity-60" : ""
          }`}
        >
          <Text className="text-base font-extrabold uppercase tracking-wide text-white">
            {spinning ? t("paywall.spinning") : t("paywall.spinCta")}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
