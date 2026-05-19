import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { HoldPhase } from "@/hooks/useHoldToControlGame";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HOLD_SIZE = 220;
const RING_SIZE = HOLD_SIZE + 36;

type Props = {
  phase: HoldPhase;
  holdProgress: number;
  isHolding: boolean;
  currentWaveSec: number;
  roundIndex: number;
  onPressIn: () => void;
  onPressOut: () => void;
};

const BREATHING_HINTS = [
  "Breathe slowly…",
  "Stay with the hold…",
  "You are in control…",
  "Let the craving pass…",
  "Hold steady…",
] as const;

export function HoldToControlPlayField({
  phase,
  holdProgress,
  isHolding,
  currentWaveSec,
  roundIndex,
  onPressIn,
  onPressOut,
}: Props) {
  const { resolved, colors } = useTheme();
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.35);
  const lastHapticStep = useRef(0);
  const fingerDownRef = useRef(false);

  const hint =
    BREATHING_HINTS[roundIndex % BREATHING_HINTS.length] ??
    BREATHING_HINTS[0];

  useEffect(() => {
    if (isHolding) {
      scale.value = withRepeat(
        withTiming(1.06, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      ringScale.value = withRepeat(
        withTiming(1.08, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
      glowOpacity.value = withRepeat(
        withTiming(0.75, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );
    } else {
      scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      ringScale.value = withSpring(1, { damping: 14, stiffness: 200 });
      glowOpacity.value = withTiming(0.35, { duration: 300 });
    }
  }, [isHolding, scale, ringScale, glowOpacity]);

  // Gentle haptic pulses at 25 / 50 / 75 % of the current hold.
  useEffect(() => {
    if (!isHolding) {
      lastHapticStep.current = 0;
      return;
    }
    const step = Math.floor(holdProgress * 4);
    if (step > lastHapticStep.current && step > 0) {
      lastHapticStep.current = step;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [holdProgress, isHolding]);

  useEffect(() => {
    if (phase === "wave-done") {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      ).catch(() => {});
    }
  }, [phase]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: glowOpacity.value,
  }));

  const progressDeg = holdProgress * 360;
  const disabled = phase === "wave-done";

  const coreBg = resolved === "dark" ? "#2A1F3D" : "#EFE3FB";
  const ringColor = colors.accent ?? "#6A3FB0";

  let statusText = `Hold for ${currentWaveSec}s`;
  if (phase === "wave-done") {
    statusText = "Wave complete — nice control";
  } else if (isHolding) {
    statusText = hint;
  } else if (holdProgress > 0 && holdProgress < 1) {
    statusText = "Keep holding — you’ve got this";
  }

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-8 text-center text-base text-muted-foreground dark:text-d-muted">
        {statusText}
      </Text>

      <View
        style={{ width: RING_SIZE, height: RING_SIZE }}
        className="items-center justify-center"
      >
        {/* Outer glow ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              width: RING_SIZE,
              height: RING_SIZE,
              borderRadius: RING_SIZE / 2,
              borderWidth: 3,
              borderColor: ringColor,
            },
            ringStyle,
          ]}
        />

        {/* Progress arc (static segments via border trick) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: HOLD_SIZE + 20,
            height: HOLD_SIZE + 20,
            borderRadius: (HOLD_SIZE + 20) / 2,
            borderWidth: 5,
            borderColor: `${ringColor}33`,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: HOLD_SIZE + 20,
            height: HOLD_SIZE + 20,
            borderRadius: (HOLD_SIZE + 20) / 2,
            borderWidth: 5,
            borderColor: ringColor,
            borderTopColor: holdProgress > 0 ? ringColor : "transparent",
            borderRightColor: holdProgress > 0.25 ? ringColor : "transparent",
            borderBottomColor: holdProgress > 0.5 ? ringColor : "transparent",
            borderLeftColor: holdProgress > 0.75 ? ringColor : "transparent",
            transform: [{ rotate: `${progressDeg - 90}deg` }],
            opacity: isHolding || holdProgress > 0 ? 1 : 0.3,
          }}
        />

        <AnimatedPressable
          disabled={disabled}
          onPressIn={() => {
            if (disabled) return;
            fingerDownRef.current = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
              () => {},
            );
            onPressIn();
          }}
          onPressOut={() => {
            const releasedEarly =
              fingerDownRef.current &&
              holdProgress < 0.99 &&
              phase !== "wave-done";
            fingerDownRef.current = false;
            onPressOut();
            if (releasedEarly) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning,
              ).catch(() => {});
            }
          }}
          accessibilityRole="button"
          accessibilityLabel={`Hold to control. ${currentWaveSec} second hold.`}
          accessibilityHint="Press and hold without lifting your finger"
          style={[
            {
              width: HOLD_SIZE,
              height: HOLD_SIZE,
              borderRadius: HOLD_SIZE / 2,
              backgroundColor: coreBg,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: ringColor,
            },
            buttonStyle,
          ]}
        >
          <Ionicons
            name={isHolding ? "hand-left" : "hand-left-outline"}
            size={56}
            color={ringColor}
          />
          <Text
            style={{ color: ringColor }}
            className="mt-2 font-mono text-lg font-bold tabular-nums"
          >
            {Math.round(holdProgress * 100)}%
          </Text>
        </AnimatedPressable>
      </View>

      <Text className="mt-10 text-center text-sm text-muted-foreground dark:text-d-muted">
        {disabled
          ? "Get ready for the next wave…"
          : "Press and hold — release only when the ring fills"}
      </Text>
    </View>
  );
}
