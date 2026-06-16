import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { GlobalRank } from "@/types/progress/progress";
import { formatNumber } from "@/utils/shared/format";

type Props = {
  rank: GlobalRank;
};

export function GlobalRankCard({ rank }: Props) {
  const { colors } = useTheme();
  const positionDisplay = formatNumber(rank.position);
  const totalDisplay = formatNumber(rank.total);

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="globe" size={22} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Global rank
            </Text>
            <Text className="mt-0.5 text-base font-bold text-foreground dark:text-d-text">
              {rank.band.label}
            </Text>
          </View>
          <Text className="text-sm font-bold tabular-nums text-foreground dark:text-d-text">
            #{positionDisplay}
          </Text>
        </View>

        <Text className="mt-3 text-xs leading-5 text-muted-foreground dark:text-d-muted">
          {rank.band.hint} You&apos;re ahead of an estimated {formatNumber(rank.total - rank.position)}{" "}
          of {totalDisplay} people on the same journey.
        </Text>
      </Card>
    </Animated.View>
  );
}
