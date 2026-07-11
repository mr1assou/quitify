import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { CommunityScrollHeader } from "@/components/feature/community/CommunityScrollHeader";
import { FeedPostSeparator } from "@/components/feature/community/FeedPostSeparator";
import { PostCard } from "@/components/feature/community/PostCard";
import { isSupportRole } from "@/constants/auth/userRoles";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useCommunityFeed } from "@/hooks/community/useCommunityFeed";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { dbAuthorId } from "@/utils/community/presence";

export default function CommunityScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { state } = useApp();
  const isSupportStaff = isSupportRole(state.account?.role);
  const currentUserCommunityId = state.account?.userId
    ? dbAuthorId(state.account.userId)
    : null;
  const { feed, loading, refreshing, loadingMore, error, refresh, loadMore, filter, applyFilter, hasActiveFilter } =
    useCommunityFeed();
  const isEmpty = !loading && feed.length === 0;

  return (
    <ScreenCanvas edges={["top"]}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.post.id}
        ListHeaderComponent={
          <CommunityScrollHeader filter={filter} onFilterChange={applyFilter} />
        }
        ItemSeparatorComponent={FeedPostSeparator}
        renderItem={({ item }) => (
          <View className="px-6 py-4">
            <PostCard
              item={item}
              showModeratorActions={
                isSupportStaff && item.post.authorId !== currentUserCommunityId
              }
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.primary}
          />
        }
        onEndReached={() => void loadMore()}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center py-6">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View className="items-center px-8 py-16">
              <Text className="text-center text-base font-semibold text-foreground dark:text-d-text">
                {error ?? (hasActiveFilter ? t("community.noMatch") : t("community.emptyTitle"))}
              </Text>
              {!error && !hasActiveFilter ? (
                <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                  {t("community.emptyHint")}
                </Text>
              ) : null}
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 120, flexGrow: isEmpty ? 1 : undefined }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenCanvas>
  );
}
