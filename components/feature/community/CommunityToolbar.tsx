import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useChatUnreadTotal } from "@/hooks/useChat";

type ToolbarAction = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  onPress: () => void;
};

export function CommunityToolbar() {
  const { colors } = useTheme();
  const unread = useChatUnreadTotal();

  const actions: ToolbarAction[] = [
    {
      icon: "chatbubbles-outline",
      label: "Messages",
      badge: unread > 0 ? unread : undefined,
      onPress: () => router.push("/chats"),
    },
    {
      icon: "add-outline",
      label: "Post",
      onPress: () => router.push("/post-composer"),
    },
    {
      icon: "search-outline",
      label: "Search",
      onPress: () => router.push("/community-search"),
    },
  ];

  return (
    <View className="flex-row items-center justify-end px-6 pb-2 pt-3">
      <View className="flex-row items-center gap-1">
        {actions.map((action) => (
          <ToolbarIcon key={action.label} action={action} colors={colors} />
        ))}
      </View>
    </View>
  );
}

function ToolbarIcon({
  action,
  colors,
}: {
  action: ToolbarAction;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      className="relative h-10 w-10 items-center justify-center rounded-full active:opacity-80"
    >
      <Ionicons name={action.icon} size={22} color={colors.mutedForeground} />
      {action.badge != null && action.badge > 0 ? (
        <View
          className="absolute -right-1 -top-1 min-h-[16px] min-w-[16px] items-center justify-center rounded-full px-1"
          style={{ backgroundColor: colors.alert }}
        >
          <Text className="text-[10px] font-bold leading-none text-white">
            {action.badge > 9 ? "9+" : action.badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
