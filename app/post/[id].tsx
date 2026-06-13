import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CommentComposer } from "@/components/feature/community/CommentComposer";
import { CommentRow } from "@/components/feature/community/CommentRow";
import { PostActions } from "@/components/feature/community/PostActions";
import { PostHeader } from "@/components/feature/community/PostHeader";
import { PostContent } from "@/components/feature/community/PostContent";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useCommunityPost } from "@/hooks/useCommunityPost";
import { resolveCommentCount } from "@/utils/community/postEngagement";

const HEADER_HEIGHT = 52;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const detail = useCommunityPost(id ?? "");
  const { votePost, share, addComment } = useCommunity();

  const screenStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  if (!detail) {
    return (
      <View className="flex-1 bg-background dark:bg-d-bg" style={screenStyle}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            This post is no longer available.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 rounded-full bg-primary px-5 py-2"
          >
            <Text className="text-sm font-bold text-white">Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { post, author, comments } = detail;
  const keyboardOffset =
    Platform.OS === "ios" ? insets.top + HEADER_HEIGHT : 0;

  return (
    <View className="flex-1 bg-background dark:bg-d-bg" style={{ paddingTop: insets.top }}>
      <View
        className="flex-row items-center justify-between px-4"
        style={{ height: HEADER_HEIGHT }}
      >
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-bold text-foreground dark:text-d-text">Post</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardOffset}
        className="flex-1"
        style={{ paddingBottom: insets.bottom }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          <View className="px-6 pt-2">
            <PostHeader author={author} createdAt={post.createdAt} />
            <PostContent post={post} className="mt-4" />

            <PostActions
              upvoteCount={post.upvoteCount}
              downvoteCount={post.downvoteCount}
              myVote={post.myVote}
              commentCount={resolveCommentCount(post)}
              shareCount={post.shareCount}
              onVote={(vote) => votePost(post.id, vote)}
              onComment={() => {}}
              onShare={() => share(post.id)}
            />
          </View>

          <View className="mt-4 h-px bg-section dark:bg-d-border" />

          <View className="px-6 pt-2">
            <Text className="pt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {resolveCommentCount(post)} comments
            </Text>
            {comments.map(({ comment, author: cAuthor }) => (
              <CommentRow key={comment.id} comment={comment} author={cAuthor} />
            ))}
          </View>
        </ScrollView>

        <View className="border-t border-section bg-background px-4 pt-3 dark:border-d-border dark:bg-d-bg">
          <CommentComposer onSubmit={(text) => addComment(post.id, text)} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
