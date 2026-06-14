import { Pressable, Text, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import type { CommunityUser, PostComment } from "@/types/community";
import { formatRelativeTime } from "@/utils/community";
import {
  navigateToSelfPlayerProfile,
  navigateToUserProfile,
} from "@/utils/profile/navigateToUserProfile";

type Props = {
  comment: PostComment;
  author: CommunityUser;
};

export function CommentRow({ comment, author }: Props) {
  const openProfile = () => {
    if (author.isCurrentUser) {
      navigateToSelfPlayerProfile();
      return;
    }
    navigateToUserProfile(author);
  };

  return (
    <View className="flex-row items-start py-2">
      <Pressable onPress={openProfile} hitSlop={6} accessibilityRole="button">
        <UserAvatar user={author} size={36} />
      </Pressable>
      <View className="ml-3 flex-1">
        <View className="rounded-2xl bg-section p-3 dark:bg-d-surface">
          <View className="flex-row items-center">
            <Pressable onPress={openProfile} hitSlop={4}>
              <Text className="text-sm font-bold text-foreground dark:text-d-text">
                {author.name}
              </Text>
            </Pressable>
            <Text className="ml-2 text-xs text-muted-foreground dark:text-d-muted">
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </View>
          <Text className="mt-1 text-sm leading-5 text-foreground dark:text-d-text">
            {comment.text}
          </Text>
        </View>
      </View>
    </View>
  );
}
