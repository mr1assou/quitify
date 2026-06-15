import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { DRAG_CIGARETTES_TRASH_SIZE } from "@/constants/dragCigarettes";

const IS_ANDROID = Platform.OS === "android";

type Props = {
  active: boolean;
  /** Pulses every time a cigarette is successfully trashed. */
  pulseTick: number;
};

export function TrashBin({ active, pulseTick }: Props) {
  const { resolved, colors } = useTheme();
  const accent = colors.primary;

  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(active ? 1.12 : 1, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    glow.value = withTiming(active ? 1 : 0, { duration: 220 });
  }, [active, scale, glow]);

  useEffect(() => {
    if (pulseTick <= 0) return;
    pulse.value = 1;
    pulse.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [pulseTick, pulse]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value * 0.5,
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  const bg = resolved === "dark" ? "#241818" : "#FFEAE0";

  return (
    <View
      style={{
        width: DRAG_CIGARETTES_TRASH_SIZE,
        height: DRAG_CIGARETTES_TRASH_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: DRAG_CIGARETTES_TRASH_SIZE,
            height: DRAG_CIGARETTES_TRASH_SIZE,
            borderRadius: DRAG_CIGARETTES_TRASH_SIZE / 2,
            backgroundColor: accent,
          },
          pulseStyle,
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: DRAG_CIGARETTES_TRASH_SIZE + 12,
            height: DRAG_CIGARETTES_TRASH_SIZE + 12,
            borderRadius: (DRAG_CIGARETTES_TRASH_SIZE + 12) / 2,
            borderWidth: 3,
            borderColor: accent,
          },
          ringStyle,
        ]}
      />
      <Animated.View style={containerStyle}>
        <View
          style={{
            width: DRAG_CIGARETTES_TRASH_SIZE,
            height: DRAG_CIGARETTES_TRASH_SIZE,
            borderRadius: DRAG_CIGARETTES_TRASH_SIZE / 2,
            backgroundColor: bg,
            borderWidth: 2,
            borderColor: accent,
            alignItems: "center",
            justifyContent: "center",
            ...(IS_ANDROID
              ? null
              : {
                  shadowColor: accent,
                  shadowOpacity: active ? 0.6 : 0.25,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 16,
                }),
          }}
        >
          <Ionicons
            name="trash"
            size={Math.round(DRAG_CIGARETTES_TRASH_SIZE * 0.45)}
            color={accent}
          />
        </View>
      </Animated.View>
    </View>
  );
}
