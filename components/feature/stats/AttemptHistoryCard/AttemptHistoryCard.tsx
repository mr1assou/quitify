import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AttemptDetailModal } from "@/components/feature/stats/AttemptDetailModal";
import { StatsListPagination } from "@/components/feature/stats/StatsListPagination";
import { Card } from "@/components/ui/Card";
import { STATS_LIST_PAGE_SIZE } from "@/constants/stats/statsListPagination";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { usePaginatedList } from "@/hooks/shared/usePaginatedList";
import type { AttemptStatsRow } from "@/types/stats/userStats";
import {
  attemptOutcomeLabel,
  formatAttemptDateRange,
} from "@/utils/stats/attemptPresentation";

type Props = {
  attempts: AttemptStatsRow[];
  currency: string;
  timeZone: string;
};

export function AttemptHistoryCard({ attempts, currency, timeZone }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptStatsRow | null>(null);

  const { page, totalPages, setPage, paginatedItems: visibleAttempts } = usePaginatedList(
    attempts,
    "attempts",
    STATS_LIST_PAGE_SIZE,
  );

  const countLabel =
    attempts.length === 0
      ? t("stats.emptyAttempts")
      : attempts.length === 1
        ? t("stats.attemptSingular", { count: attempts.length })
        : t("stats.attemptPlural", { count: attempts.length });

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
                {t("stats.yourAttempts")}
              </Text>
              <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">{countLabel}</Text>
            </View>
          </View>

          {attempts.length === 0 ? (
            <View className="mt-4 rounded-2xl bg-elevated px-4 py-4 dark:bg-d-elevated">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                {t("stats.noQuitAttemptsYet")}
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
  const { t } = useTranslation();
  const status = attemptOutcomeLabel(row, t);

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl bg-elevated px-3 py-3 active:opacity-80 dark:bg-d-elevated"
      accessibilityRole="button"
      accessibilityLabel={t("stats.attemptA11y", { n: row.attemptNumber, status })}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-foreground dark:text-d-text">
          {t("stats.attemptNumber", { n: row.attemptNumber })}
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
        {formatAttemptDateRange(row, timeZone, t)}
      </Text>
    </Pressable>
  );
}
