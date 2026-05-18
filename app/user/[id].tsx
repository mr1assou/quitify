import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { getBadgeName } from "@/utils/badges";
import { formatRelativeTime } from "@/utils/community";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { state } = useCommunity();
  const user = id ? getCommunityUser(id) : undefined;

  const userPosts = useMemo(() => {
    if (!user) return [];
    return state.posts
      .filter((p) => p.authorId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [state.posts, user]);

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-muted-foreground dark:text-d-muted">
            User not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const openChat = () => router.push(`/chat-by-user/${user.id}`);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-bold text-foreground dark:text-d-text">Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="items-center px-6 pt-2">
          <UserAvatar user={user} size={96} ringed />
          <Text className="mt-3 text-2xl font-bold text-foreground dark:text-d-text">
            {user.name}
          </Text>
          <Text className="text-sm text-muted-foreground dark:text-d-muted">
            @{user.handle}{user.location ? ` · ${user.location}` : ""}
          </Text>
          <Text className="mt-3 max-w-[280px] text-center text-sm leading-5 text-foreground dark:text-d-text">
            {user.bio}
          </Text>

          {!user.isCurrentUser ? (
            <View className="mt-4 flex-row gap-2">
              <Pressable
                onPress={openChat}
                className="flex-row items-center rounded-full bg-primary px-5 py-2.5"
              >
                <Ionicons name="chatbubble-ellipses" size={16} color={colors.white} />
                <Text className="ml-2 text-sm font-bold text-white">Message</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/call-by-user/[id]",
                    params: { id: user.id, kind: "audio" },
                  })
                }
                className="h-11 w-11 items-center justify-center rounded-full border border-section dark:border-d-border"
              >
                <Ionicons name="call" size={18} color={colors.primary} />
              </Pressable>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/call-by-user/[id]",
                    params: { id: user.id, kind: "video" },
                  })
                }
                className="h-11 w-11 items-center justify-center rounded-full border border-section dark:border-d-border"
              >
                <Ionicons name="videocam" size={18} color={colors.accent} />
              </Pressable>
            </View>
          ) : null}
        </View>

        <View className="mt-6 px-6">
          <Card variant="section">
            <View className="flex-row items-center">
              <BadgeArt badgeId={user.badgeId} size={56} />
              <View className="ml-4 flex-1">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                  Highest badge
                </Text>
                <Text className="mt-0.5 text-lg font-bold text-foreground dark:text-d-text">
                  {getBadgeName(user.badgeId)}
                </Text>
                <Text className="text-sm text-muted-foreground dark:text-d-muted">
                  {user.smokeFreeDays} days smoke-free
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View className="mt-6 px-6">
          <Text className="pb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Posts ({userPosts.length})
          </Text>

          {userPosts.length === 0 ? (
            <View className="items-center rounded-2xl bg-section py-8 dark:bg-d-surface">
              <Ionicons name="leaf-outline" size={24} color={colors.mutedForeground} />
              <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
                No posts yet.
              </Text>
            </View>
          ) : (
            userPosts.map((post) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/post/${post.id}`)}
                className="mb-2 rounded-2xl bg-section p-4 dark:bg-d-surface"
              >
                <Text
                  numberOfLines={3}
                  className="text-sm leading-5 text-foreground dark:text-d-text"
                >
                  {post.text}
                </Text>
                <View className="mt-2 flex-row items-center gap-3">
                  <Detail icon="heart" value={post.likeCount} color={colors.alert} />
                  <Detail
                    icon="chatbubble"
                    value={post.commentIds.length}
                    color={colors.primary}
                  />
                  <Text className="ml-auto text-xs text-muted-foreground dark:text-d-muted">
                    {formatRelativeTime(post.createdAt)}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({
  icon,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  color: string;
}) {
  return (
    <View className="flex-row items-center">
      <Ionicons name={icon} size={12} color={color} />
      <Text className="ml-1 text-xs text-muted-foreground dark:text-d-muted">{value}</Text>
    </View>
  );
}
