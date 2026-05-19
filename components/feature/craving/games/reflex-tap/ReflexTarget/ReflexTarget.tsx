import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { memo, useCallback, useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { ReflexTarget as ReflexTargetType } from "@/hooks/useReflexTapGame";

const IS_ANDROID = Platform.OS === "android";

type Props = {
  target: ReflexTargetType;
  areaWidth: number;
  areaHeight: number;
  onTap: (id: string, kind: "good" | "bad") => void;
};

function ReflexTargetImpl({ target, areaWidth, areaHeight, onTap }: Props) {
  const { resolved } = useTheme();
  const [tapped, setTapped] = useState(false);

  const horizontalRange = Math.max(areaWidth - target.size, 0);
  const verticalRange = Math.max(areaHeight - target.size, 0);
  const left = target.xRatio * horizontalRange;
  const top = target.yRatio * verticalRange;

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 140,
      easing: Easing.linear,
    });
    // Auto-fade slightly before the JS expire to make the disappearance
    // feel smooth instead of sudden.
    const fadeDelay = Math.max(target.lifetimeMs - 220, 0);
    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 220 });
      scale.value = withTiming(0.85, { duration: 220 });
    }, fadeDelay);
    return () => clearTimeout(fadeTimer);
  }, [opacity, scale, target.lifetimeMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = useCallback(() => {
    if (tapped) return;
    setTapped(true);
    if (target.type.kind === "good") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {},
      );
    }
    onTap(target.id, target.type.kind);
    scale.value = withTiming(1.45, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(0, {
      duration: 180,
    });
  }, [tapped, target.id, target.type.kind, onTap, scale, opacity]);

  const cardBg =
    target.type.kind === "good"
      ? resolved === "dark"
        ? "#1F1B26"
        : "#FFFFFF"
      : resolved === "dark"
        ? "#2A1414"
        : "#FFE5E5";

  return (
    <Animated.View
      pointerEvents={tapped ? "none" : "auto"}
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      collapsable={false}
      style={[
        {
          position: "absolute",
          left,
          top,
          width: target.size,
          height: target.size,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePress}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={
          target.type.kind === "good"
            ? `Tap target ${target.type.id}`
            : `Avoid ${target.type.id}`
        }
        style={{ width: target.size, height: target.size }}
      >
        <View
          style={{
            width: target.size,
            height: target.size,
            borderRadius: target.size / 2,
            backgroundColor: cardBg,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: target.type.color,
            ...(IS_ANDROID
              ? null
              : {
                  shadowColor: target.type.color,
                  shadowOpacity: 0.55,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: target.size * 0.22,
                }),
          }}
        >
          <Ionicons
            name={target.type.icon}
            size={Math.round(target.size * 0.5)}
            color={target.type.color}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const ReflexTarget = memo(
  ReflexTargetImpl,
  (prev, next) =>
    prev.target === next.target &&
    prev.areaWidth === next.areaWidth &&
    prev.areaHeight === next.areaHeight &&
    prev.onTap === next.onTap,
);
