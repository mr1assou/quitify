import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Fragment, useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { PostCard } from "@/components/feature/community/PostCard";
import { useTheme } from "@/context/ThemeContext";
import { useProfileActivity } from "@/hooks/useProfileActivity";
import type { FeedItem } from "@/types/community";
import type { PlayerProfile } from "@/types/playerProfile";
import type { ProfileActivityTab } from "@/types/profileActivity";
import { formatRelativeTime } from "@/utils/community";

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
          emptyIcon="document-text-outline"
          emptyMessage="No posts yet."
        />
      ) : null}

      {tab === "comments" ? (
        <ActivityList
          emptyIcon="chatbubble-outline"
          emptyMessage="No comments yet."
          isEmpty={activity.comments.length === 0}
        >
          {activity.comments.map(({ comment, post }) => (
            <Pressable
              key={comment.id}
              onPress={() => router.push(`/post/${post.id}`)}
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
          emptyIcon="caret-up-outline"
          emptyMessage="No upvoted posts yet."
        />
      ) : null}
    </View>
  );
}

function PostFeedList({
  items,
  emptyIcon,
  emptyMessage,
}: {
  items: FeedItem[];
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyMessage: string;
}) {
  return (
    <ActivityList emptyIcon={emptyIcon} emptyMessage={emptyMessage} isEmpty={items.length === 0}>
      {items.map((item, index) => (
        <Fragment key={item.post.id}>
          {index > 0 ? <View className="h-px bg-border dark:bg-d-border" /> : null}
          <View className="py-4">
            <PostCard item={item} />
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
}: {
  children: ReactNode;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  emptyMessage: string;
  isEmpty: boolean;
}) {
  const { colors } = useTheme();

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
