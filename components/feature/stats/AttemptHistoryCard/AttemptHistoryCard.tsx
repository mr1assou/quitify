import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AttemptDetailModal } from "@/components/feature/stats/AttemptDetailModal";
import { RangeTabs } from "@/components/feature/stats/RangeTabs";
import { StatsListPagination } from "@/components/feature/stats/StatsListPagination";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import { usePaginatedList } from "@/hooks/shared/usePaginatedList";
import type { AttemptStatsRow, StatsEconomics, StatsFilterRange } from "@/types/stats/userStats";
import {
  attemptOutcomeLabel,
  formatAttemptDateRange,
} from "@/utils/stats/attemptPresentation";
import { filterAttemptsByRange } from "@/utils/stats/filterStatsByRange";

type Props = {
  attempts: AttemptStatsRow[];
  economics: StatsEconomics;
  currency: string;
  timeZone: string;
};

export function AttemptHistoryCard({
  attempts,
  economics,
  currency,
  timeZone,
}: Props) {
  const { colors } = useTheme();
  const [range, setRange] = useState<StatsFilterRange>("lifetime");
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptStatsRow | null>(null);

  const filteredAttempts = useMemo(
    () => filterAttemptsByRange(attempts, economics, range),
    [attempts, economics, range],
  );

  const { page, totalPages, setPage, paginatedItems: visibleAttempts } = usePaginatedList(
    filteredAttempts,
    range,
  );

  return (
    <>
      <Animated.View entering={FadeInDown.duration(420)}>
        <Card variant="section">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Ionicons name="medal" size={18} color={colors.white} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Your attempts
              </Text>
              <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">
                {filteredAttempts.length === 0
                  ? "No attempts in this period."
                  : `${filteredAttempts.length} attempt${filteredAttempts.length === 1 ? "" : "s"}`}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <RangeTabs variant="filter" value={range} onChange={setRange} />
          </View>

          {filteredAttempts.length === 0 ? (
            <View className="mt-4 rounded-2xl bg-background px-4 py-4 dark:bg-d-elevated">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                {attempts.length === 0
                  ? "No quit attempts yet."
                  : "No quit attempts overlap this period."}
              </Text>
            </View>
          ) : (
            <View className="mt-4 gap-2">
              {visibleAttempts.map((row) => (
                <AttemptRow
                  key={row.attemptNumber}
                  row={row}
                  timeZone={timeZone}
                  onPress={() => setSelectedAttempt(row)}
                />
              ))}
              <StatsListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </View>
          )}
        </Card>
      </Animated.View>

      <AttemptDetailModal
        attempt={selectedAttempt}
        currency={currency}
        timeZone={timeZone}
        onClose={() => setSelectedAttempt(null)}
      />
    </>
  );
}

function AttemptRow({
  row,
  timeZone,
  onPress,
}: {
  row: AttemptStatsRow;
  timeZone: string;
  onPress: () => void;
}) {
  const status = attemptOutcomeLabel(row);

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl bg-background px-3 py-3 active:opacity-80 dark:bg-d-elevated"
      accessibilityRole="button"
      accessibilityLabel={`Attempt ${row.attemptNumber}, ${status}. Tap for details.`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-foreground dark:text-d-text">
          Attempt {row.attemptNumber}
        </Text>
        <View className="flex-row items-center gap-2">
          <View
            className={`rounded-full px-2.5 py-0.5 ${
              row.isActive ? "bg-accent/15" : "bg-section dark:bg-d-surface"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                row.isActive ? "text-accent" : "text-muted-foreground dark:text-d-muted"
              }`}
            >
              {status}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </View>
      </View>

      <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
        {formatAttemptDateRange(row, timeZone)}
      </Text>
    </Pressable>
  );
}
