import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  unlocked: boolean;
  xp: number;
};

export function BonusReward({ unlocked, xp }: Props) {
  const { colors } = useTheme();
  const iconColor = unlocked ? colors.white : colors.mutedForeground;

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Card
        variant="section"
        className={`flex-row items-center ${
          unlocked ? "border border-accent" : ""
        }`}
      >
        <View
          className={`mr-3 h-11 w-11 items-center justify-center rounded-2xl ${
            unlocked ? "bg-accent" : "bg-section dark:bg-d-elevated"
          }`}
        >
          <Ionicons
            name={unlocked ? "gift" : "lock-closed"}
            size={20}
            color={iconColor}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-foreground dark:text-d-text">
            {unlocked
              ? `Bonus earned · +${xp} FP`
              : `Complete your day · +${xp} FP`}
          </Text>
          <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
            {unlocked
              ? "All daily missions are done. Nice work."
              : "Finish every auto mission to unlock today's bonus."}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
}
