import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onPress: () => void;
};

export function CravingCTA({ onPress }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const press = useSharedValue(1);
  const halo = useSharedValue(0);

  useEffect(() => {
    halo.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [halo]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - halo.value),
    transform: [{ scale: 1 + halo.value * 0.45 }],
  }));
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: press.value }] }));

  return (
    <View className="items-center">
      <View className="relative items-center justify-center">
        <Animated.View
          pointerEvents="none"
          style={haloStyle}
          className="absolute h-44 w-44 rounded-full bg-primary"
        />
        <AnimatedPressable
          onPressIn={() => {
            press.value = withSpring(0.94, { damping: 18, stiffness: 280 });
          }}
          onPressOut={() => {
            press.value = withSpring(1, { damping: 14, stiffness: 220 });
          }}
          onPress={onPress}
          style={pressStyle}
          className="h-40 w-40 items-center justify-center rounded-full bg-primary"
        >
          <Ionicons name="flash" size={36} color={colors.white} />
          <Text className="mt-2 px-4 text-center text-base font-bold text-white">
            {t("home.cravingCta")}
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}
