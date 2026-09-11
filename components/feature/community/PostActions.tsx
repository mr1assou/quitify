import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { DownvoteIcon, UpvoteIcon } from "@/components/feature/community/VoteIcons";
import { useTheme } from "@/context/ThemeContext";
import type { PostVote } from "@/types/community/community";
import { formatCountCompact } from "@/utils/community";

type Props = {
  upvoteCount: number;
  downvoteCount: number;
  myVote: PostVote | null;
  commentCount: number;
  shareCount: number;
  commentsActive?: boolean;
  onVote: (vote: PostVote) => void;
  onComment: () => void;
  onShare: () => void;
};

export function PostActions({
  upvoteCount,
  downvoteCount,
  myVote,
  commentCount,
  shareCount,
  commentsActive = false,
  onVote,
  onComment,
  onShare,
}: Props) {
  const { colors, resolved } = useTheme();

  const handleVote = (vote: PostVote) => {
    onVote(vote);
  };

  const upActive = myVote === "up";
  const downActive = myVote === "down";
  const netScore = upvoteCount - downvoteCount;

  const pillBg = resolved === "dark" ? "#2A2E33" : colors.section;
  const idleIcon = resolved === "dark" ? colors.foreground : colors.mutedForeground;
  const scoreColor = upActive
    ? colors.accent
    : downActive
      ? colors.primary
      : colors.foreground;

  return (
    <View className="mt-3 flex-row items-center justify-between">
      <View
        className="flex-row items-center rounded-full px-1 py-0.5"
        style={{ backgroundColor: pillBg }}
      >
        <Pressable
          onPress={() => handleVote("up")}
          hitSlop={4}
          className="h-8 w-8 items-center justify-center active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Upvote"
        >
          <UpvoteIcon size={18} color={upActive ? colors.accent : idleIcon} />
        </Pressable>

        <Text
          className="min-w-[20px] text-center text-sm font-semibold"
          style={{ color: scoreColor }}
        >
          {formatCountCompact(netScore)}
        </Text>

        <Pressable
          onPress={() => handleVote("down")}
          hitSlop={4}
          className="h-8 w-8 items-center justify-center active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Downvote"
        >
          <DownvoteIcon size={18} color={downActive ? colors.primary : idleIcon} />
        </Pressable>
      </View>

      <View className="flex-row items-center gap-4">
        <SideAction
          icon={commentsActive ? "chatbubble" : "chatbubble-outline"}
          label={formatCountCompact(commentCount)}
          active={commentsActive}
          activeColor={colors.primary}
          defaultColor={colors.mutedForeground}
          onPress={onComment}
        />
        <SideAction
          icon="paper-plane-outline"
          label={formatCountCompact(shareCount)}
          activeColor={colors.primary}
          defaultColor={colors.mutedForeground}
          onPress={() => {
            onShare();
          }}
        />
      </View>
    </View>
  );
}

function SideAction({
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
    <Pressable onPress={onPress} hitSlop={8} className="flex-row items-center py-1">
      <Ionicons name={icon} size={20} color={color} />
      <Text className="ml-1.5 text-sm font-semibold" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
}
