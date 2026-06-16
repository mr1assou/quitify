import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { DownvoteIcon, UpvoteIcon } from "@/components/feature/community/VoteIcons";
import { useTheme } from "@/context/ThemeContext";
import type { PostVote } from "@/types/community/community";
import { formatCountCompact } from "@/utils/community";

type Props = {
  upvoteCount: number;
  downvoteCount: number;
  myVote: PostVote | null;
  onVote: (vote: PostVote) => void;
};

export function CommentVoteActions({
  upvoteCount,
  downvoteCount,
  myVote,
  onVote,
}: Props) {
  const { colors, resolved } = useTheme();
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

  const handleVote = (vote: PostVote) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onVote(vote);
  };

  return (
    <View
      className="flex-row items-center rounded-full px-1 py-0.5"
      style={{ backgroundColor: pillBg }}
    >
      <Pressable
        onPress={() => handleVote("up")}
        hitSlop={4}
        className="h-7 w-7 items-center justify-center active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Upvote comment"
      >
        <UpvoteIcon size={14} color={upActive ? colors.accent : idleIcon} />
      </Pressable>

      <Text
        className="min-w-[18px] text-center text-xs font-semibold"
        style={{ color: scoreColor }}
      >
        {formatCountCompact(netScore)}
      </Text>

      <Pressable
        onPress={() => handleVote("down")}
        hitSlop={4}
        className="h-7 w-7 items-center justify-center active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="Downvote comment"
      >
        <DownvoteIcon size={14} color={downActive ? colors.primary : idleIcon} />
      </Pressable>
    </View>
  );
}
