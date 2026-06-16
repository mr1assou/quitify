import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { CravingTip } from "@/constants/craving/cravingTips";

type Props = {
  tip: CravingTip;
};

export function CravingTipCard({ tip }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View key={tip.id} entering={FadeIn.duration(300)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="bulb" size={18} color={colors.white} />
          </View>
          <Text className="text-base font-bold text-foreground dark:text-d-text">
            {tip.title}
          </Text>
        </View>
        <Text className="mt-2 text-sm leading-5 text-muted-foreground dark:text-d-muted">
          {tip.body}
        </Text>
      </Card>
    </Animated.View>
  );
}
