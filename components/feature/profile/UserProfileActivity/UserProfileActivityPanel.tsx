import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { PostCard } from "@/components/feature/community/PostCard";
import { useTheme } from "@/context/ThemeContext";
import { useProfileActivity } from "@/hooks/community/useProfileActivity";
import type { FeedItem } from "@/types/community/community";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { ProfileActivityTab } from "@/types/profile/profileActivity";
import { formatRelativeTime } from "@/utils/community";
import { safeRouter } from "@/utils/app/safeRouter";

import { UserProfileActivityTabs } from "./UserProfileActivityTabsPanel";

type Props = {
  profile: PlayerProfile;
};

export function UserProfileActivity({ profile }: Props) {
  const [tab, setTab] = useState<ProfileActivityTab>("posts");
  const activity = useProfileActivity(profile);

  return (
    <View className="gap-3">
      <UserProfileActivityTabs value={tab} onChange={setTab} />

      {tab === "posts" ? (
        <PostFeedList
          items={activity.postFeed}
          loading={activity.loading}
          emptyIcon="document-text-outline"
          emptyMessage="No posts yet."
          showOwnerActions={profile.isCurrentUser}
        />
      ) : null}

      {tab === "comments" ? (
        <ActivityList
          emptyIcon="chatbubble-outline"
          emptyMessage="No comments yet."
          isEmpty={!activity.loading && activity.comments.length === 0}
          loading={activity.loading}
        >
          {activity.comments.map(({ comment, post }) => (
            <Pressable
              key={comment.id}
              onPress={() => safeRouter.push(`/post/${post.id}`)}
              className="rounded-2xl bg-section p-4 dark:bg-d-surface"
            >
              <Text className="text-sm leading-5 text-foreground dark:text-d-text">
                {comment.text}
              </Text>
              <Text
                numberOfLines={1}
                className="mt-2 text-xs text-muted-foreground dark:text-d-muted"
              >
                On: {post.title?.trim() || post.text}
              </Text>
              <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
                {formatRelativeTime(comment.createdAt)}
              </Text>
            </Pressable>
          ))}
        </ActivityList>
      ) : null}

      {tab === "upvoted" ? (
        <PostFeedList
          items={activity.upvotedFeed}
          loading={activity.loading}
          emptyIcon="caret-up-outline"
          emptyMessage="No upvoted posts yet."
          showOwnerActions={profile.isCurrentUser}
        />
      ) : null}
    </View>
  );
}

function PostFeedList({
  items,
  loading,
  emptyIcon,
  emptyMessage,
  showOwnerActions,
}: {
  items: FeedItem[];
  loading: boolean;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyMessage: string;
  showOwnerActions?: boolean;
}) {
  return (
    <ActivityList
      emptyIcon={emptyIcon}
      emptyMessage={emptyMessage}
      isEmpty={!loading && items.length === 0}
      loading={loading}
    >
      {items.map((item, index) => (
        <Fragment key={item.post.id}>
          {index > 0 ? <View className="h-px bg-border dark:bg-d-border" /> : null}
          <View className="py-4">
            <PostCard item={item} showOwnerActions={showOwnerActions} />
          </View>
        </Fragment>
      ))}
    </ActivityList>
  );
}

function ActivityList({
  children,
  emptyIcon,
  emptyMessage,
  isEmpty,
  loading,
}: {
  children: ReactNode;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyMessage: string;
  isEmpty: boolean;
  loading?: boolean;
}) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View className="items-center rounded-2xl bg-section py-10 dark:bg-d-surface">
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View className="items-center rounded-2xl bg-section py-10 dark:bg-d-surface">
        <Ionicons name={emptyIcon} size={24} color={colors.mutedForeground} />
        <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return <View>{children}</View>;
}
