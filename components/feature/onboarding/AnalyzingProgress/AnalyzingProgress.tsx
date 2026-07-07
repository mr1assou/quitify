import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";
import type { AnalyzingTask } from "@/types";

export type { AnalyzingTask } from "@/types";

type Props = {
  tasks: readonly AnalyzingTask[];
  onComplete: () => void;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = 220;
const RING_STROKE = 16;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function HaloRing({ progress }: { progress: number }) {
  const { colors, resolved } = useTheme();
  const v = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    v.value = withTiming(progress, { duration: 380, easing: Easing.out(Easing.cubic) });
  }, [progress, v]);

  useEffect(() => {
    pulse.value = 0;
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - v.value),
  }));

  const innerStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + pulse.value * 0.35,
    transform: [{ scale: 0.94 + pulse.value * 0.08 }],
  }));

  const innerSize = RING_SIZE - RING_STROKE * 2 - 8;
  const innerBg = resolved === "dark" ? colors.section : colors.accentSoft;

  return (
    <View
      style={{ width: RING_SIZE, height: RING_SIZE }}
      className="items-center justify-center"
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: innerBg,
          },
          innerStyle,
        ]}
      />

      <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: "absolute" }}>
        <Defs>
          <LinearGradient id="haloGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={1} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={resolved === "dark" ? colors.border : colors.section}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="url(#haloGrad)"
          strokeWidth={RING_STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      <View className="absolute inset-0 items-center justify-center">
        <Text
          className="text-6xl font-bold text-foreground dark:text-d-text"
          style={{ letterSpacing: -1 }}
        >
          {Math.round(progress * 100)}
          <Text className="text-3xl font-bold text-muted-foreground dark:text-d-muted">%</Text>
        </Text>
        <Text className="mt-2 text-[11px] font-bold uppercase tracking-[2px] text-primary dark:text-d-primary">
          Personalizing
        </Text>
      </View>
    </View>
  );
}

function PulseDot({ color }: { color: string }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = 0;
    v.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(v);
  }, [v]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.45 + v.value * 0.55,
    transform: [{ scale: 0.85 + v.value * 0.4 }],
  }));

  return (
    <Animated.View
      style={[style, { backgroundColor: color }]}
      className="h-3 w-3 rounded-full"
    />
  );
}

function ActiveRingPulse({ color }: { color: string }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = 0;
    v.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    return () => cancelAnimation(v);
  }, [v]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - v.value),
    transform: [{ scale: 1 + v.value * 0.45 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: color,
        },
      ]}
    />
  );
}

function TaskRow({
  task,
  progress,
  status,
}: {
  task: AnalyzingTask;
  progress: number;
  status: "pending" | "active" | "done";
}) {
  const { colors, resolved } = useTheme();
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });
  }, [progress, fill]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
  }));

  const isDone = status === "done";
  const isActive = status === "active";

  const labelColor = isDone
    ? colors.foreground
    : isActive
      ? colors.foreground
      : colors.mutedForeground;

  const iconBg = isDone
    ? colors.primary
    : isActive
      ? colors.accent
      : resolved === "dark"
        ? colors.border
        : colors.section;

  const iconForeground = isDone || isActive ? colors.white : colors.mutedForeground;

  const pctColor = isDone
    ? colors.primary
    : isActive
      ? colors.accent
      : colors.mutedForeground;

  return (
    <Animated.View
      entering={FadeIn.duration(360)}
      className="w-full overflow-hidden rounded-3xl border border-border bg-section p-4 shadow-sm dark:border-d-border dark:bg-d-surface"
      style={{
        shadowColor: "#000",
        shadowOpacity: resolved === "dark" ? 0 : 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: resolved === "dark" ? 0 : 2,
      }}
    >
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center">
          {isActive ? <ActiveRingPulse color={colors.accent} /> : null}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDone ? (
              <Ionicons name="checkmark" size={20} color={iconForeground} />
            ) : isActive ? (
              <PulseDot color={colors.white} />
            ) : (
              <Ionicons name={task.icon} size={18} color={iconForeground} />
            )}
          </View>
        </View>

        <Text
          numberOfLines={2}
          className="flex-1 text-[15px] font-semibold leading-5"
          style={{ color: labelColor }}
        >
          {task.label}
        </Text>

        <Text
          className="text-sm font-bold tabular-nums"
          style={{ color: pctColor, minWidth: 44, textAlign: "right" }}
        >
          {Math.round(progress * 100)}%
        </Text>
      </View>

      <View
        className="h-2.5 w-full overflow-hidden rounded-full"
        style={{
          backgroundColor: resolved === "dark" ? colors.border : colors.section,
        }}
      >
        <Animated.View
          style={[
            fillStyle,
            {
              backgroundColor: isDone ? colors.primary : colors.accent,
            },
          ]}
          className="h-full rounded-full"
        />
      </View>
    </Animated.View>
  );
}

const TICK_MS = 80;

export function AnalyzingProgress({ tasks, onComplete }: Props) {
  const totalDuration = useMemo(
    () => tasks.reduce((sum, t) => sum + t.durationMs, 0),
    [tasks],
  );

  const [elapsed, setElapsed] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    startedAtRef.current = Date.now();
    setElapsed(0);

    const id = setInterval(() => {
      const start = startedAtRef.current ?? Date.now();
      const next = Math.min(totalDuration, Date.now() - start);
      setElapsed(next);
      if (next >= totalDuration && !completedRef.current) {
        completedRef.current = true;
        clearInterval(id);
        setTimeout(onComplete, 600);
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, [totalDuration, onComplete]);

  const overallProgress = totalDuration === 0 ? 1 : elapsed / totalDuration;

  let activeIndex = -1;
  const perTask = tasks.map((task, i) => {
    const before = tasks.slice(0, i).reduce((s, t) => s + t.durationMs, 0);
    const taskElapsed = Math.max(0, Math.min(task.durationMs, elapsed - before));
    const progress = task.durationMs === 0 ? 1 : taskElapsed / task.durationMs;
    if (progress > 0 && progress < 1 && activeIndex === -1) activeIndex = i;
    return progress;
  });

  return (
    <View className="w-full flex-1 px-6 pb-8 pt-2">
      <View className="items-center pt-4">
 
        <Text
          className="mt-3 text-center text-3xl font-bold leading-9 text-foreground dark:text-d-text"
          style={{ letterSpacing: -0.5 }}
        >
          Building your{"\n"}personalized plan
        </Text>
        <Text className="mt-3 max-w-[300px] text-center text-[15px] leading-5 text-muted-foreground dark:text-d-muted">
          Hang tight we’re tailoring everything around your answers.
        </Text>
      </View>

      <View className="mt-6 items-center">
        <HaloRing progress={overallProgress} />
      </View>

      <View className="mt-8 w-full gap-3">
        {tasks.map((task, i) => {
          const progress = perTask[i];
          const status: "pending" | "active" | "done" =
            progress >= 1 ? "done" : progress > 0 ? "active" : "pending";
          return (
            <TaskRow key={task.id} task={task} progress={progress} status={status} />
          );
        })}
      </View>
    </View>
  );
}
