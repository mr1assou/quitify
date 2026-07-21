import { Ionicons } from "@expo/vector-icons";
import { Fragment, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { PostCard } from "@/components/feature/community/PostCard";
import { useTheme } from "@/context/ThemeContext";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useProfileActivity } from "@/hooks/community/useProfileActivity";
import type { FeedItem } from "@/types/community/community";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { ProfileActivityTab } from "@/types/profile/profileActivity";
import { formatRelativeTime } from "@/utils/community";
import { safeRouter } from "@/utils/app/safeRouter";

import { UserProfileActivityTabs } from "./UserProfileActivityTabsPanel";

const LOCKED_TAB_COPY: Record<
  ProfileActivityTab,
  { icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  posts: { icon: "document-text-outline", label: "Posts" },
  comments: { icon: "chatbubble-outline", label: "Comments" },
  upvoted: { icon: "caret-up-outline", label: "Upvoted" },
};

type Props = {
  profile: PlayerProfile;
};

export function UserProfileActivity({ profile }: Props) {
  const [tab, setTab] = useState<ProfileActivityTab>("posts");
  const isPremium = useIsPremium();
  const { requirePremium } = usePremiumGate();
  const lockActivity = !profile.isCurrentUser && !isPremium;
  const activity = useProfileActivity(profile, !lockActivity);

  return (
    <View className="gap-3">
      <UserProfileActivityTabs value={tab} onChange={setTab} />

      {lockActivity ? (
        <ProfileActivityLocked
          icon={LOCKED_TAB_COPY[tab].icon}
          label={LOCKED_TAB_COPY[tab].label}
          onPress={requirePremium}
        />
      ) : null}

      {!lockActivity && tab === "posts" ? (
        <PostFeedList
          items={activity.postFeed}
          loading={activity.loading}
          emptyIcon="document-text-outline"
          emptyMessage="No posts yet."
          showOwnerActions={profile.isCurrentUser}
        />
      ) : null}

      {!lockActivity && tab === "comments" ? (
        <ActivityList
          emptyIcon="chatbubble-outline"
          emptyMessage="No comments yet."
          isEmpty={!activity.loading && activity.comments.length === 0}
          loading={activity.loading}
        >
          <View className="gap-3">
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
          </View>
        </ActivityList>
      ) : null}

      {!lockActivity && tab === "upvoted" ? (
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

function ProfileActivityLocked({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, VIP feature. Tap to unlock.`}
      className="items-center rounded-2xl bg-section py-10 dark:bg-d-surface active:opacity-90"
    >
      <View className="relative">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary">
          <Ionicons name="lock-closed" size={10} color="#fff" />
        </View>
      </View>
      <Text className="mt-3 text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
      <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">—</Text>
    </Pressable>
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
