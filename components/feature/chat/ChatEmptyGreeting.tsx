import { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { GREETING_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const IMAGE_SIZE = 240;
const FLOAT_DISTANCE = 8;

type Props = {
  participantName: string;
};

/** Empty chat state — greeting art with a gentle up/down float. */
export function ChatEmptyGreeting({ participantName }: Props) {
  const { t } = useTranslation();
  const floatY = useSharedValue(-FLOAT_DISTANCE);
  const firstName = useMemo(() => {
    const trimmed = participantName.trim();
    return trimmed.split(/\s+/)[0] || trimmed || t("chat.emptyNameFallback");
  }, [participantName, t]);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(FLOAT_DISTANCE, {
        duration: 2200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [floatY]);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View className="items-center px-8 pt-2">
      <Animated.Image
        source={GREETING_IMAGE}
        style={[{ width: IMAGE_SIZE, height: IMAGE_SIZE }, imageStyle]}
        resizeMode="contain"
        accessibilityLabel="Friendly greeting"
      />

      <Text className="mt-4 text-center text-lg font-semibold text-foreground dark:text-d-text">
        {t("chat.emptyGreeting", { name: firstName })}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
        {t("chat.emptyRespect")}
      </Text>
    </View>
  );
}
