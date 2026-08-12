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
  loadingMore: boolean;
  viewMode: LeaderboardViewMode;
  onLoadMore: () => void;
  /** One request: jump to a small window around your rank. */
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

/**
 * Browse: top pages only (YOU appears once your range is loaded via Show more).
 * Around: neighborhood window always includes YOU.
 */
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
  loadingMore,
  viewMode,
  onLoadMore,
  onSpotAroundCurrentUser,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium, requirePremium } = usePremiumGate();
  const listRef = useRef<FlatList<ListRow>>(null);
  const listViewportHeightRef = useRef(0);
  const [spotting, setSpotting] = useState(false);
  const [highlightSelf, setHighlightSelf] = useState(false);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spotGenerationRef = useRef(0);
  const pendingScrollRef = useRef(false);

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

  const selfIndex = useMemo(
    () => rows.findIndex((row) => row.isSelf),
    [rows],
  );
  const selfIndexRef = useRef(selfIndex);
  selfIndexRef.current = selfIndex;

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const flashSelf = useCallback(() => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    setHighlightSelf(true);
    highlightTimerRef.current = setTimeout(() => setHighlightSelf(false), 1800);
  }, []);

  const scrollSelfToCenter = useCallback(
    (generation: number) => {
      if (generation !== spotGenerationRef.current) return;
      const index = selfIndexRef.current;
      if (index < 0) {
        setSpotting(false);
        pendingScrollRef.current = false;
        return;
      }

      const listHeight = listViewportHeightRef.current;
      const centerPad = listHeight > 0 ? Math.max(0, listHeight / 2 - ROW_HEIGHT / 2) : 0;
      const offset = Math.max(0, index * ROW_HEIGHT - centerPad);

      listRef.current?.scrollToOffset({ offset, animated: true });
      flashSelf();
      setSpotting(false);
      pendingScrollRef.current = false;
    },
    [flashSelf],
  );

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    if (selfIndex < 0) return;

    const generation = spotGenerationRef.current;
    const timer = setTimeout(() => scrollSelfToCenter(generation), 80);
    return () => clearTimeout(timer);
  }, [rows, selfIndex, scrollSelfToCenter]);

  const onSpotMyRank = async () => {
    if (!leaderboard.currentUser) return;
    if (!requirePremium()) return;
    if (spotting) return;

    const generation = ++spotGenerationRef.current;
    setSpotting(true);
    pendingScrollRef.current = false;

    try {
      // Already viewing the around window with YOU in list — just scroll.
      if (viewMode === "around" && selfIndexRef.current >= 0) {
        pendingScrollRef.current = true;
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (pendingScrollRef.current) scrollSelfToCenter(generation);
          }, 50);
        });
        return;
      }

      const loaded = await onSpotAroundCurrentUser();
      if (generation !== spotGenerationRef.current) return;

      if (!loaded) {
        setSpotting(false);
        return;
      }

      pendingScrollRef.current = true;
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (pendingScrollRef.current) scrollSelfToCenter(generation);
        }, 100);
      });
    } catch {
      if (generation === spotGenerationRef.current) {
        setSpotting(false);
        pendingScrollRef.current = false;
      }
    }
  };

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      const offset = Math.max(0, ROW_HEIGHT * info.index);
      listRef.current?.scrollToOffset({ offset, animated: false });
      const generation = spotGenerationRef.current;
      setTimeout(() => scrollSelfToCenter(generation), 80);
    },
    [scrollSelfToCenter],
  );

  const renderItem = useCallback<ListRenderItem<ListRow>>(
    ({ item }) => (
      <View className="px-6">
        <View className="bg-section px-2 dark:bg-d-surface">
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
      <FlatList
        ref={listRef}
        className="flex-1"
        data={rows}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onLayout={(event) => {
          listViewportHeightRef.current = event.nativeEvent.layout.height;
        }}
        contentContainerStyle={{
          paddingBottom: 120,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          rows.length === 0 ? (
            <View className="mx-6 bg-section px-4 py-6 dark:bg-d-surface">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                {t("achievements.leaderboardEmpty")}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View className="px-6">
            <View className="overflow-hidden rounded-b-3xl bg-section px-2 pb-2 dark:bg-d-surface">
              {hasMore ? (
                <View className="items-center px-3 py-3">
                  {loadingMore || spotting ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Pressable onPress={onLoadMore} hitSlop={8} className="active:opacity-70">
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
        onScrollToIndexFailed={onScrollToIndexFailed}
        initialNumToRender={16}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews={false}
      />

      {spotting ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center bg-background/40 dark:bg-d-bg/50"
        >
          <View className="items-center gap-3 rounded-3xl bg-section px-6 py-5 dark:bg-d-surface">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-sm font-semibold text-foreground dark:text-d-text">
              {t("achievements.spottingRank")}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
