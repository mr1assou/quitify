import { Ionicons } from "@expo/vector-icons";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  Pressable,
  Text,
  View,
} from "react-native";

import { LeaderboardRow } from "@/components/feature/progress/LeaderboardRow";
import { useTheme } from "@/context/ThemeContext";
import type { LeaderboardViewMode } from "@/hooks/leaderboard/useLeaderboard";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";
import {
  listLeaderboardEntries,
  listOtherLeaderboardEntries,
} from "@/utils/leaderboard/findLeaderboardEntry";

const ROW_HEIGHT = 78;

type Props = {
  leaderboard: LeaderboardSnapshot;
  hasMore: boolean;
  hasMoreAbove: boolean;
  loadingMore: boolean;
  loadingAbove: boolean;
  viewMode: LeaderboardViewMode;
  onLoadMore: () => void;
  onLoadMoreAbove: () => void;
  onSpotAroundCurrentUser: () => Promise<boolean>;
};

type ListRow = {
  key: string;
  entry: LeaderboardEntry;
  showDivider: boolean;
  isSelf: boolean;
};

function isViewerEntry(entry: LeaderboardEntry, viewer: LeaderboardEntry | null): boolean {
  if (!viewer) return entry.isCurrentUser;
  if (viewer.userId != null && entry.userId != null) {
    return entry.userId === viewer.userId;
  }
  return entry.isCurrentUser;
}

function buildPageRows(
  leaderboard: LeaderboardSnapshot,
  viewMode: LeaderboardViewMode,
): LeaderboardEntry[] {
  const viewer = leaderboard.currentUser;
  const others = listOtherLeaderboardEntries(leaderboard);

  if (!viewer) return others;

  if (viewMode === "around") {
    return listLeaderboardEntries(leaderboard);
  }

  const rankLoaded = !leaderboard.hasMore || leaderboard.nextOffset >= viewer.rank;
  if (!rankLoaded) return others;

  return listLeaderboardEntries(leaderboard);
}

export function RankLeaderboard({
  leaderboard,
  hasMore,
  hasMoreAbove,
  loadingMore,
  loadingAbove,
  viewMode,
  onLoadMore,
  onLoadMoreAbove,
  onSpotAroundCurrentUser,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium, requirePremium } = usePremiumGate();
  const listRef = useRef<FlatList<ListRow>>(null);
  const scrollOffsetRef = useRef(0);
  const [spotting, setSpotting] = useState(false);
  const [highlightSelf, setHighlightSelf] = useState(false);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAboveAdjustRef = useRef<number | null>(null);
  const prevRowCountRef = useRef(0);

  const pageRows = useMemo(
    () => buildPageRows(leaderboard, viewMode),
    [leaderboard, viewMode],
  );

  const rows = useMemo<ListRow[]>(() => {
    return pageRows.map((entry, index) => {
      const isSelf = isViewerEntry(entry, leaderboard.currentUser);
      return {
        key: entry.userId != null ? `u-${entry.userId}` : `r-${entry.rank}-${entry.name}`,
        entry,
        showDivider: index > 0,
        isSelf,
      };
    });
  }, [leaderboard.currentUser, pageRows]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  // Keep scroll position stable when rows are prepended above.
  useEffect(() => {
    const prevCount = prevRowCountRef.current;
    const added = rows.length - prevCount;
    prevRowCountRef.current = rows.length;

    if (pendingAboveAdjustRef.current == null) return;
    if (added <= 0) {
      pendingAboveAdjustRef.current = null;
      return;
    }

    const baseOffset = pendingAboveAdjustRef.current;
    pendingAboveAdjustRef.current = null;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: baseOffset + added * ROW_HEIGHT,
        animated: false,
      });
    });
  }, [rows.length]);

  // Highlight YOU when entering around mode (no auto-scroll — window fits on screen).
  useEffect(() => {
    if (viewMode !== "around") return;
    if (!rows.some((row) => row.isSelf)) return;

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setHighlightSelf(true);
    highlightTimerRef.current = setTimeout(() => setHighlightSelf(false), 1800);
  }, [viewMode, leaderboard.startOffset, rows]);

  const onSpotMyRank = async () => {
    if (!leaderboard.currentUser) return;
    if (!requirePremium()) return;
    if (spotting) return;

    setSpotting(true);
    try {
      await onSpotAroundCurrentUser();
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      setHighlightSelf(true);
      highlightTimerRef.current = setTimeout(() => setHighlightSelf(false), 1800);
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
    } finally {
      setSpotting(false);
    }
  };

  const handleLoadMore = () => {
    if (loadingMore || spotting) return;
    onLoadMore();
  };

  const handleLoadMoreAbove = () => {
    if (loadingAbove || spotting || loadingMore) return;
    pendingAboveAdjustRef.current = scrollOffsetRef.current;
    onLoadMoreAbove();
  };

  const renderItem = useCallback<ListRenderItem<ListRow>>(
    ({ item }) => (
      <View className="px-6" style={{ height: ROW_HEIGHT }}>
        <View className="h-full justify-center bg-section px-2 dark:bg-d-surface">
          <LeaderboardRow
            entry={item.entry}
            showDivider={item.showDivider}
            emphasized={item.isSelf && highlightSelf}
          />
        </View>
      </View>
    ),
    [highlightSelf],
  );

  const viewer = leaderboard.currentUser;
  const canSpot = Boolean(viewer);

  const leaderboardTitleBar = (
    <View className="px-6">
      <View className="overflow-hidden rounded-t-3xl border-b border-border/50 bg-section dark:border-d-border dark:bg-d-surface">
        <View className="flex-row items-center justify-between gap-2 px-4 py-3">
          <Text className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {t("achievements.globalLeaderboard")}
          </Text>
          {canSpot ? (
            <Pressable
              onPress={() => void onSpotMyRank()}
              disabled={spotting}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                isPremium
                  ? t("achievements.spotMyRank")
                  : t("achievements.spotMyRankVipA11y")
              }
              className="flex-row items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1.5 active:opacity-80 disabled:opacity-70 dark:bg-primary/20"
            >
              {spotting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name={isPremium ? "locate" : "lock-closed"}
                  size={14}
                  color={colors.primary}
                />
              )}
              <Text className="text-xs font-bold text-primary">
                {spotting
                  ? t("achievements.spottingRank")
                  : t("achievements.spotMyRank")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <View className="mt-4">{leaderboardTitleBar}</View>

      {hasMoreAbove ? (
        <View className="px-6">
          <View className="items-center border-b border-border/40 bg-section px-3 py-3 dark:border-d-border dark:bg-d-surface">
            {loadingAbove ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Pressable
                onPress={handleLoadMoreAbove}
                hitSlop={8}
                className="active:opacity-70"
                accessibilityRole="button"
              >
                <Text className="text-sm font-semibold text-primary">
                  {t("achievements.showPrevious")}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : null}

      <FlatList
        ref={listRef}
        className="flex-1"
        data={rows}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 120,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="mx-6 bg-section px-4 py-6 dark:bg-d-surface">
            <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
              {t("achievements.leaderboardEmpty")}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View className="px-6">
            <View className="overflow-hidden rounded-b-3xl bg-section px-2 pb-2 dark:bg-d-surface">
              {hasMore ? (
                <View className="items-center px-3 py-3">
                  {loadingMore || spotting ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Pressable
                      onPress={handleLoadMore}
                      disabled={loadingMore || spotting}
                      hitSlop={8}
                      className="active:opacity-70"
                      accessibilityRole="button"
                    >
                      <Text className="text-sm font-semibold text-primary">
                        {t("achievements.showMore")}
                      </Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View className="h-2" />
              )}
            </View>
          </View>
        }
        getItemLayout={(_data, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index,
        })}
        initialNumToRender={16}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews={false}
      />
    </View>
  );
}
