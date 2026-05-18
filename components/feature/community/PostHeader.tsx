import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser } from "@/types/community";
import { getBadgeName } from "@/utils/badges";
import { formatRelativeTime } from "@/utils/community";

type Props = {
  author: CommunityUser;
  createdAt: number;
  /** Show an overflow "…" button on the right. */
  onMore?: () => void;
};

export function PostHeader({ author, createdAt, onMore }: Props) {
  const { colors } = useTheme();
  const badgeName = getBadgeName(author.badgeId);

  return (
    <View className="flex-row items-center">
      <Pressable
        hitSlop={6}
        onPress={() => router.push(`/user/${author.id}`)}
        className="flex-row items-center"
      >
        <UserAvatar user={author} size={42} />
        <View className="ml-3">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-foreground dark:text-d-text">
              {author.name}
            </Text>
            <Text className="ml-1 text-sm text-muted-foreground dark:text-d-muted">
              · @{author.handle}
            </Text>
          </View>
          <View className="mt-0.5 flex-row items-center">
            <Ionicons name="ribbon" size={12} color={colors.primary} />
            <Text className="ml-1 text-xs text-muted-foreground dark:text-d-muted">
              {badgeName} · {formatRelativeTime(createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={{ flex: 1 }} />

      {onMore ? (
        <Pressable hitSlop={8} onPress={onMore}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}
