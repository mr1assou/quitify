import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StatsListPagination } from "@/components/feature/stats/StatsListPagination";
import { Card } from "@/components/ui/Card";
import { GOALS_LIST_PAGE_SIZE } from "@/constants/stats/statsListPagination";
import { useTheme } from "@/context/ThemeContext";
import { usePaginatedList } from "@/hooks/shared/usePaginatedList";
import type { GoalStatsRow } from "@/types/stats/statsGoals";
import {
  formatGoalStatsTimeline,
  formatGoalStatsTitle,
  goalStatusLabel,
} from "@/utils/stats/goalPresentation";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  goals: GoalStatsRow[];
  currency: string;
  timeZone: string;
};

export function GoalHistoryCard({ goals, currency, timeZone }: Props) {
  const { colors } = useTheme();
  const symbol = currencySymbol(currency);

  const { page, totalPages, setPage, paginatedItems: visibleGoals } = usePaginatedList(
    goals,
    "goals",
    GOALS_LIST_PAGE_SIZE,
  );

  return (
    <Animated.View entering={FadeInDown.duration(420).delay(80)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="flag" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Your goals
            </Text>
            <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">
              {goals.length === 0
                ? "No goals yet."
                : `${goals.length} goal${goals.length === 1 ? "" : "s"}`}
            </Text>
          </View>
        </View>

        {goals.length === 0 ? (
          <View className="mt-4 rounded-2xl bg-background px-4 py-4 dark:bg-d-elevated">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              Create a goal from the home screen to track it here.
            </Text>
          </View>
        ) : (
          <View className="mt-4 gap-2">
            {visibleGoals.map((row) => (
              <GoalRow
                key={row.id}
                row={row}
                currency={symbol}
                timeZone={timeZone}
              />
            ))}
            <StatsListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

function GoalRow({
  row,
  currency,
  timeZone,
}: {
  row: GoalStatsRow;
  currency: string;
  timeZone: string;
}) {
  const status = goalStatusLabel(row.status);
  const isActive = row.status === "active";
  const isCompleted = row.status === "completed";

  return (
    <View className="rounded-2xl bg-background px-3 py-3 dark:bg-d-elevated">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-sm font-bold text-foreground dark:text-d-text">
          {formatGoalStatsTitle(row, currency)}
        </Text>
        <View
          className={`rounded-full px-2.5 py-0.5 ${
            isActive ? "bg-accent/15" : isCompleted ? "bg-primary/15" : "bg-section dark:bg-d-surface"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isActive
                ? "text-accent"
                : isCompleted
                  ? "text-primary"
                  : "text-muted-foreground dark:text-d-muted"
            }`}
          >
            {status}
          </Text>
        </View>
      </View>

      <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
        Attempt {row.attemptNumber}
      </Text>

      <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
        {formatGoalStatsTimeline(row, timeZone)}
      </Text>
    </View>
  );
}
