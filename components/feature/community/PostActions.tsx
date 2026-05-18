import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { formatCountCompact } from "@/utils/community";

type Props = {
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  shareCount: number;
  /** Highlights the comment button when the thread is expanded. */
  commentsActive?: boolean;
  onToggleLike: () => void;
  onComment: () => void;
  onShare: () => void;
};

export function PostActions({
  likeCount,
  likedByMe,
  commentCount,
  shareCount,
  commentsActive = false,
  onToggleLike,
  onComment,
  onShare,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="mt-3 flex-row items-center justify-between">
      <ActionButton
        icon={likedByMe ? "heart" : "heart-outline"}
        label={formatCountCompact(likeCount)}
        active={likedByMe}
        activeColor={colors.alert}
        defaultColor={colors.mutedForeground}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onToggleLike();
        }}
      />
      <ActionButton
        icon={commentsActive ? "chatbubble" : "chatbubble-outline"}
        label={formatCountCompact(commentCount)}
        active={commentsActive}
        defaultColor={colors.mutedForeground}
        activeColor={colors.primary}
        onPress={onComment}
      />
      <ActionButton
        icon="paper-plane-outline"
        label={formatCountCompact(shareCount)}
        defaultColor={colors.mutedForeground}
        activeColor={colors.primary}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onShare();
        }}
      />
    </View>
  );
}

function ActionButton({
  icon,
  label,
  active = false,
  activeColor,
  defaultColor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  activeColor: string;
  defaultColor: string;
  onPress: () => void;
}) {
  const color = active ? activeColor : defaultColor;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="flex-1 flex-row items-center justify-center py-1"
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text
        className="ml-2 text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
