import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StatsListPagination } from "@/components/feature/stats/StatsListPagination";
import { Card } from "@/components/ui/Card";
import { STATS_LIST_PAGE_SIZE } from "@/constants/stats/statsListPagination";
import { showFreedomPointsInfo } from "@/utils/stats/showFreedomPointsInfo";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
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
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { page, totalPages, setPage, paginatedItems: visibleEntries } = usePaginatedList(
    entries,
    "freedom-points",
    STATS_LIST_PAGE_SIZE,
  );

  const summaryLabel =
    entries.length === 0
      ? t("stats.emptyRewards")
      : entries.length === 1
        ? t("stats.fpSummarySingular", {
            points: formatNumber(totalFreedomPoints),
            count: entries.length,
          })
        : t("stats.fpSummaryPlural", {
            points: formatNumber(totalFreedomPoints),
            count: entries.length,
          });

  return (
    <Animated.View entering={FadeInDown.duration(420).delay(40)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="flash" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                {t("stats.freedomPoints")}
              </Text>
              <Pressable
                onPress={() =>
                  showFreedomPointsInfo(
                    t("stats.freedomPointsInfoTitle"),
                    t("stats.freedomPointsInfoMessage"),
                  )
                }
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t("stats.freedomPointsInfoA11y")}
                className="active:opacity-70"
              >
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
            <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">{summaryLabel}</Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <View className="mt-4 rounded-2xl bg-elevated px-4 py-4 dark:bg-d-elevated">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              {t("stats.staySmokeFreeHint")}
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
  const { t } = useTranslation();
  const label = freedomPointSourceLabel(row, t);
  const description = freedomPointSourceDescription(row, t);
  const earnedOn = formatUtcDateInTimezone(row.earnedAt, timeZone);

  return (
    <View className="rounded-2xl bg-elevated px-3 py-3 dark:bg-d-elevated">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-bold text-foreground dark:text-d-text">{label}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
            {description}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted-foreground dark:text-d-muted">{earnedOn}</Text>
          <Text className="mt-0.5 text-base font-bold tabular-nums text-primary">
            {t("stats.fpAmount", { amount: formatNumber(row.amount) })}
          </Text>
        </View>
      </View>
    </View>
  );
}
