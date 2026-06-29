import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { PostHeader } from "@/components/feature/community/PostHeader";
import { POST_MODERATED_PROFILE_MESSAGE } from "@/constants/community/postModeration";
import { useTheme } from "@/context/ThemeContext";
import type { FeedItem } from "@/types/community/community";
import { formatRelativeTime } from "@/utils/community";

type Props = {
  item: FeedItem;
};

/** Author-facing placeholder when support removed a post from the community feed. */
export function ModeratedPostCard({ item }: Props) {
  const { colors } = useTheme();
  const { post, author } = item;

  return (
    <View className="rounded-2xl border border-alert/25 bg-alert/5 px-4 py-4 dark:bg-alert/10">
      <PostHeader author={author} createdAt={post.createdAt} />
      <View className="mt-3 flex-row items-start gap-3">
        <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-alert/15">
          <Ionicons name="shield-outline" size={18} color={colors.alert} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground dark:text-d-text">
            Post removed by moderation
          </Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {POST_MODERATED_PROFILE_MESSAGE}
          </Text>
          <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
            Posted {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}
