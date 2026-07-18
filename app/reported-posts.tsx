import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { PostContent } from "@/components/feature/community/PostContent";
import { PostHeader } from "@/components/feature/community/PostHeader";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import { isSupportRole } from "@/constants/auth/userRoles";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import {
  dismissPostReports,
  fetchReportedPosts,
  moderatePost as moderatePostApi,
  type BackendReportedPost,
} from "@/services/posts/postsApi";
import type { FeedItem } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import {
  mapBackendAuthorToCommunityUser,
  mapBackendFeedPostToCommunityPost,
} from "@/utils/community/mapBackendPost";

type ReportedItem = FeedItem & { reportCount: number };

function mapReportedPosts(items: BackendReportedPost[]): ReportedItem[] {
  return items.map((item) => ({
    post: mapBackendFeedPostToCommunityPost(item),
    author: mapBackendAuthorToCommunityUser(item),
    reportCount: item.report_count,
  }));
}

export default function ReportedPostsScreen() {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { moderatePost } = useCommunity();
  const isSupportStaff = isSupportRole(appState.account?.role);

  const [items, setItems] = useState<ReportedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyPostId, setBusyPostId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const page = await fetchReportedPosts();
      setItems(mapReportedPosts(page.items));
      setError(null);
    } catch {
      setError("Could not load reported posts. Pull to refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupportStaff) {
      safeRouter.back();
      return;
    }
    void load();
  }, [isSupportStaff, load]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await load(true);
    } finally {
      setRefreshing(false);
    }
  };

  const removeFromList = (postId: string) => {
    setItems((prev) => prev.filter((item) => item.post.id !== postId));
  };

  const onRemovePost = (item: ReportedItem) => {
    Alert.alert(
      "Remove this post?",
      "The post will be hidden from the community and the author will be notified.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setBusyPostId(item.post.id);
            void moderatePostApi(item.post.id)
              .then(() => {
                moderatePost(item.post.id);
                removeFromList(item.post.id);
              })
              .catch(() => {
                Alert.alert("Could not remove post", "Please try again.");
              })
              .finally(() => setBusyPostId(null));
          },
        },
      ],
    );
  };

  const onDismissReports = (item: ReportedItem) => {
    Alert.alert(
      "Dismiss reports?",
      "The post stays visible and its reports are cleared.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Dismiss",
          onPress: () => {
            setBusyPostId(item.post.id);
            void dismissPostReports(item.post.id)
              .then(() => removeFromList(item.post.id))
              .catch(() => {
                Alert.alert("Could not dismiss reports", "Please try again.");
              })
              .finally(() => setBusyPostId(null));
          },
        },
      ],
    );
  };

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <StackScreenHeader title="Reported posts" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.post.id}
        renderItem={({ item }) => (
          <View className="mx-6 mb-4 rounded-3xl bg-section p-4 dark:bg-d-surface">
            <PostHeader author={item.author} createdAt={item.post.createdAt} />
            <PostContent
              post={item.post}
              onPress={() => safeRouter.push(`/post/${item.post.id}`)}
            />

            <View className="mt-3 flex-row items-center">
              <Ionicons name="flag" size={14} color={colors.alert} />
              <Text
                className="ml-1.5 text-xs font-bold"
                style={{ color: colors.alert }}
              >
                {item.reportCount} {item.reportCount === 1 ? "report" : "reports"}
              </Text>
            </View>

            <View className="mt-3 flex-row gap-3">
              <Pressable
                onPress={() => onRemovePost(item)}
                disabled={busyPostId === item.post.id}
                className="flex-1 flex-row items-center justify-center rounded-full bg-alert py-2.5 active:opacity-80 disabled:opacity-60"
              >
                {busyPostId === item.post.id ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={16} color={colors.white} />
                    <Text className="ml-1.5 text-sm font-bold text-white">
                      Remove post
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={() => onDismissReports(item)}
                disabled={busyPostId === item.post.id}
                className="flex-1 flex-row items-center justify-center rounded-full border border-border py-2.5 active:opacity-80 disabled:opacity-60 dark:border-d-border"
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={colors.mutedForeground}
                />
                <Text className="ml-1.5 text-sm font-bold text-muted-foreground dark:text-d-muted">
                  Dismiss
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View className="items-center px-8 py-16">
              <Ionicons
                name="shield-checkmark-outline"
                size={40}
                color={colors.mutedForeground}
              />
              <Text className="mt-4 text-center text-base font-semibold text-foreground dark:text-d-text">
                {error ?? "No reported posts"}
              </Text>
              {!error ? (
                <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                  Posts reported by the community will appear here for review.
                </Text>
              ) : null}
            </View>
          )
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenCanvas>
  );
}
