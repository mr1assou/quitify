import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  amount: number;
  currencySymbol: string;
};

/**
 * Hero "Total savings" card. Big tabular number, primary chip on the right
 * to match the inspiration's circular accent.
 */
export function SavingsCard({ amount, currencySymbol }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(450)}>
      <Card variant="section">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Total savings
            </Text>
            <View className="mt-2 flex-row items-end">
              <AnimatedNumber
                value={amount}
                decimals={amount < 100 ? 2 : 0}
                prefix={currencySymbol}
                className="text-4xl font-bold text-foreground dark:text-d-text"
              />
            </View>
            <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
              Money you didn’t hand to the pack.
            </Text>
          </View>

          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Ionicons name="cash" size={22} color={colors.white} />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}
