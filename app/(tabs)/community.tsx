import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CommunityScrollHeader } from "@/components/feature/community/CommunityScrollHeader";
import { FeedPostSeparator } from "@/components/feature/community/FeedPostSeparator";
import { PostCard } from "@/components/feature/community/PostCard";
import { useTheme } from "@/context/ThemeContext";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";

export default function CommunityScreen() {
  const { colors } = useTheme();
  const { feed, loading, refreshing, loadingMore, error, refresh, loadMore, filter, applyFilter, hasActiveFilter } =
    useCommunityFeed();
  const isEmpty = !loading && feed.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.post.id}
        ListHeaderComponent={
          <CommunityScrollHeader filter={filter} onFilterChange={applyFilter} />
        }
        ItemSeparatorComponent={FeedPostSeparator}
        renderItem={({ item }) => (
          <View className="px-6 py-4">
            <PostCard item={item} />
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
                {error ?? (hasActiveFilter ? "No posts match your filters" : "No posts yet")}
              </Text>
              {!error && !hasActiveFilter ? (
                <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                  Tap + to share the first post with the community.
                </Text>
              ) : null}
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 120, flexGrow: isEmpty ? 1 : undefined }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
