import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { countryFlagForRank } from "@/constants/leaderboard/leaderboardCountries";
import { useNotifications } from "@/context/NotificationContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AppNotification } from "@/types/notifications/notification";
import { safeRouter } from "@/utils/app/safeRouter";
import { formatRelativeTime } from "@/utils/community";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    refresh,
    loadMore,
    markOneRead,
    markAllRead,
  } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const onPressItem = (item: AppNotification) => {
    void markOneRead(item.id);
    if (item.postId) {
      const path = item.commentId
        ? `/post/${item.postId}?commentId=${item.commentId}`
        : `/post/${item.postId}`;
      safeRouter.push(path);
    }
  };

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <StackScreenHeader
        title={t("notifications.title")}
        rightAction={
          unreadCount > 0 ? (
            <Pressable
              onPress={() => void markAllRead()}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t("notifications.readAll")}
              className="active:opacity-70"
            >
              <Text className="text-sm font-semibold text-primary">
                {t("notifications.readAll")}
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationRow item={item} onPress={() => onPressItem(item)} />
        )}
        ItemSeparatorComponent={() => (
          <View className="mx-6 h-px bg-section dark:bg-d-border" />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (!loading && !loadingMore && hasMore && notifications.length > 0) {
            void loadMore();
          }
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center py-6">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center px-8 pt-24">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View className="flex-1 items-center justify-center px-8 pt-24">
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={colors.mutedForeground}
              />
              <Text className="mt-3 text-center text-sm text-muted-foreground dark:text-d-muted">
                {t("notifications.empty")}
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
      />
    </ScreenCanvas>
  );
}

const ACTION_KEY_BY_TYPE = {
  comment: "notifications.commented",
  reply: "notifications.replied",
  upvote: "notifications.upvoted",
  downvote: "notifications.downvoted",
  post: "notifications.sharedPost",
} as const satisfies Record<AppNotification["type"], string>;

const BADGE_ICON_BY_TYPE: Record<
  AppNotification["type"],
  keyof typeof Ionicons.glyphMap
> = {
  comment: "chatbubble-ellipses",
  reply: "chatbubble-ellipses",
  upvote: "arrow-up",
  downvote: "arrow-down",
  post: "newspaper",
};

function NotificationRow({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const actionKey = ACTION_KEY_BY_TYPE[item.type] ?? ACTION_KEY_BY_TYPE.comment;
  const action = t(actionKey as Parameters<typeof t>[0]);
  const badgeIcon = BADGE_ICON_BY_TYPE[item.type] ?? BADGE_ICON_BY_TYPE.comment;
  const badgeColor =
    item.type === "downvote" ? colors.alert : colors.primary;
  const avatarRank = (item.actorUserId % 10) + 1;
  const countryFlag =
    item.actorCountryFlag?.trim() || countryFlagForRank(avatarRank);

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-6 py-4 active:opacity-80 ${
        item.isRead ? "" : "bg-section/60 dark:bg-d-surface/40"
      }`}
    >
      <View className="relative">
        <LeaderboardAvatar
          name={item.actorName}
          isCurrentUser={false}
          rank={avatarRank}
          countryFlag={countryFlag}
          imageUrl={item.actorImageUrl}
          size={48}
        />
        <View
          className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full border-2"
          style={{
            backgroundColor: badgeColor,
            borderColor: colors.background,
          }}
        >
          <Ionicons name={badgeIcon} size={10} color={colors.white} />
        </View>
      </View>

      <View className="ml-3 flex-1">
        <Text
          className="text-sm leading-5 text-foreground dark:text-d-text"
          numberOfLines={3}
        >
          <Text className="font-bold">{item.actorName}</Text>
          <Text className="text-muted-foreground dark:text-d-muted">
            {" "}
            {action}
          </Text>
          {item.text ? (
            <Text className="text-foreground dark:text-d-text">: {item.text}</Text>
          ) : null}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
          {formatRelativeTime(item.createdAt)}
        </Text>
      </View>

      {!item.isRead ? (
        <View
          className="ml-2 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: colors.primary }}
        />
      ) : null}
    </Pressable>
  );
}
