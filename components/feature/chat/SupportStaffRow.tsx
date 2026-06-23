import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { SUPPORT_STAFF_SUBTITLE } from "@/constants/auth/userRoles";
import { useTheme } from "@/context/ThemeContext";
import type { CommunityUser } from "@/types/community/community";

type Props = {
  user: CommunityUser;
};

/** Row for app users contacting support — name + role label, message only, no profile. */
export function SupportStaffRow({ user }: Props) {
  const { colors } = useTheme();

  const openChat = () => router.push(`/chat-by-user/${user.id}`);

  return (
    <View className="flex-row items-center rounded-2xl bg-background px-3 py-3 dark:bg-d-elevated">
      <UserAvatar user={user} size={48} />
      <View className="ml-3 flex-1">
        <Text
          className="text-base font-bold text-foreground dark:text-d-text"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
          {SUPPORT_STAFF_SUBTITLE}
        </Text>
      </View>
      <Pressable
        onPress={openChat}
        hitSlop={8}
        className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-primary"
        accessibilityLabel={`Message ${user.name}`}
      >
        <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}
