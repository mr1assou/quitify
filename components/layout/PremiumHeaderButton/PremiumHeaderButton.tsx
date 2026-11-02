import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { VIP_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  isPremium: boolean;
  onPress: () => void;
};

export function PremiumHeaderButton({ isPremium, onPress }: Props) {
  const { t } = useTranslation();
  const swing = useSharedValue(0);

  useEffect(() => {
    swing.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 140, easing: Easing.out(Easing.quad) }),
        withTiming(10, { duration: 160, easing: Easing.inOut(Easing.quad) }),
        withTiming(-7, { duration: 140, easing: Easing.inOut(Easing.quad) }),
        withTiming(5, { duration: 130, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 140, easing: Easing.in(Easing.quad) }),
        withDelay(3500, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [swing]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swing.value}deg` }],
  }));

  return (
    <Pressable
      accessibilityLabel={isPremium ? t("profile.vipMember") : t("layout.upgradeVip")}
      onPress={onPress}
      className="h-11 items-center justify-center active:opacity-80"
      style={{ opacity: isPremium ? 1 : 0.92 }}
    >
      <Animated.View style={iconStyle}>
        <Image
          source={VIP_IMAGE}
          style={{ width: 54, height: 30 }}
          contentFit="contain"
          accessibilityLabel="VIP"
        />
      </Animated.View>
    </Pressable>
  );
}
