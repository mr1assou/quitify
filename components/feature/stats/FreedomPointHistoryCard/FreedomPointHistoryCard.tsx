import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StatsListPagination } from "@/components/feature/stats/StatsListPagination";
import { Card } from "@/components/ui/Card";
import { STATS_LIST_PAGE_SIZE } from "@/constants/stats/statsListPagination";
import { useTheme } from "@/context/ThemeContext";
import { usePaginatedList } from "@/hooks/shared/usePaginatedList";
import type { FreedomPointLedgerRow } from "@/types/stats/statsFreedomPoints";
import {
  freedomPointSourceDescription,
  freedomPointSourceLabel,
} from "@/utils/stats/freedomPointPresentation";
import { formatNumber } from "@/utils/shared/format";
import { formatUtcDateInTimezone } from "@/utils/time/formatInTimezone";

type Props = {
  entries: FreedomPointLedgerRow[];
  totalFreedomPoints: number;
  timeZone: string;
};

export function FreedomPointHistoryCard({ entries, totalFreedomPoints, timeZone }: Props) {
  const { colors } = useTheme();

  const { page, totalPages, setPage, paginatedItems: visibleEntries } = usePaginatedList(
    entries,
    "freedom-points",
    STATS_LIST_PAGE_SIZE,
  );

  return (
    <Animated.View entering={FadeInDown.duration(420).delay(40)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="flash" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Freedom points
            </Text>
            <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">
              {entries.length === 0
                ? "No rewards yet."
                : `${formatNumber(totalFreedomPoints)} FP · ${entries.length} reward${entries.length === 1 ? "" : "s"}`}
            </Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <View className="mt-4 rounded-2xl bg-background px-4 py-4 dark:bg-d-elevated">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              Stay smoke-free and complete goals to earn Freedom points.
            </Text>
          </View>
        ) : (
          <View className="mt-4 gap-2">
            {visibleEntries.map((row) => (
              <LedgerRow key={row.id} row={row} timeZone={timeZone} />
            ))}
            <StatsListPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

function LedgerRow({ row, timeZone }: { row: FreedomPointLedgerRow; timeZone: string }) {
  const label = freedomPointSourceLabel(row);
  const description = freedomPointSourceDescription(row);
  const earnedOn = formatUtcDateInTimezone(row.earnedAt, timeZone);

  return (
    <View className="rounded-2xl bg-background px-3 py-3 dark:bg-d-elevated">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-bold text-foreground dark:text-d-text">{label}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
            {description}
          </Text>
        </View>
        <Text className="text-base font-bold tabular-nums text-primary">
          +{formatNumber(row.amount)} FP
        </Text>
      </View>

      <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">{earnedOn}</Text>
    </View>
  );
}
