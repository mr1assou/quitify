import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { safeRouter } from "@/utils/app/safeRouter";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser } from "@/types/community/community";
import { getBadgeName } from "@/utils/progress/badges";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";

type Props = {
  user: CommunityUser;
  trailing?: "chevron" | "message";
};

export function UserResultRow({ user, trailing = "chevron" }: Props) {
  const { colors } = useTheme();
  const badgeName = getBadgeName(user.badgeId);

  const openProfile = () => navigateToUserProfile(user);
  const openChat = () => safeRouter.push(`/chat-by-user/${user.id}`);

  return (
    <Pressable
      onPress={openProfile}
      className="flex-row items-center rounded-2xl bg-elevated px-3 py-3 dark:bg-d-elevated"
    >
      <UserAvatar user={user} size={48} />
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-foreground dark:text-d-text">
          {user.name}{" "}
          <Text className="text-sm font-normal text-muted-foreground dark:text-d-muted">
            @{user.handle}
          </Text>
        </Text>
        <View className="mt-0.5 flex-row items-center">
          <Ionicons name="ribbon" size={12} color={colors.primary} />
          <Text className="ml-1 text-xs text-muted-foreground dark:text-d-muted">
            {badgeName} · {user.smokeFreeDays}d smoke-free
          </Text>
        </View>
      </View>

      {trailing === "message" ? (
        <Pressable
          onPress={openChat}
          hitSlop={8}
          className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-primary"
        >
          <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}
