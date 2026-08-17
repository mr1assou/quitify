import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  score: number;
  combo: number;
};

export function ReflexHud({ score, combo }: Props) {
  const { t } = useTranslation();
  const comboScale = useSharedValue(1);
  useEffect(() => {
    if (combo < 2) return;
    comboScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 220 }),
      withTiming(1, { duration: 220 }),
    );
  }, [combo, comboScale]);

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  return (
    <View className="flex-row items-end justify-between px-6 pb-2 pt-1">
      <View>
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {t("craving.scoreLabel")}
        </Text>
        <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
          {score}
        </Text>
      </View>

      {combo >= 2 ? (
        <Animated.View style={comboStyle} className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-accent">
            {t("craving.combo")}
          </Text>
          <Text className="font-mono text-2xl font-bold tabular-nums text-accent">
            x{combo}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
