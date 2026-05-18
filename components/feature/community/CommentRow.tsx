import { Text, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import type { CommunityUser, PostComment } from "@/types/community";
import { formatRelativeTime } from "@/utils/community";

type Props = {
  comment: PostComment;
  author: CommunityUser;
};

export function CommentRow({ comment, author }: Props) {
  return (
    <View className="flex-row items-start py-2">
      <UserAvatar user={author} size={36} />
      <View className="ml-3 flex-1">
        <View className="rounded-2xl bg-section p-3 dark:bg-d-surface">
          <View className="flex-row items-center">
            <Text className="text-sm font-bold text-foreground dark:text-d-text">
              {author.name}
            </Text>
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
