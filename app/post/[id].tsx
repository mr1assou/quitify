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
import { SafeAreaView } from "react-native-safe-area-context";

import { CommentComposer } from "@/components/feature/community/CommentComposer";
import { CommentRow } from "@/components/feature/community/CommentRow";
import { PostActions } from "@/components/feature/community/PostActions";
import { PostHeader } from "@/components/feature/community/PostHeader";
import { PostMedia } from "@/components/feature/community/PostMedia";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useCommunityPost } from "@/hooks/useCommunityPost";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const detail = useCommunityPost(id ?? "");
  const { toggleLike, share, addComment } = useCommunity();

  if (!detail) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg">
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
      </SafeAreaView>
    );
  }

  const { post, author, comments } = detail;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.foreground} />
        </Pressable>
        <Text className="text-base font-bold text-foreground dark:text-d-text">Post</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-2">
            <PostHeader author={author} createdAt={post.createdAt} />
            {post.text ? (
              <Text className="mt-4 text-base leading-6 text-foreground dark:text-d-text">
                {post.text}
              </Text>
            ) : null}
            {post.media ? (
              <View className="mt-4">
                <PostMedia media={post.media} height={280} />
              </View>
            ) : null}

            <PostActions
              likeCount={post.likeCount}
              likedByMe={post.likedByMe}
              commentCount={post.commentIds.length}
              shareCount={post.shareCount}
              onToggleLike={() => toggleLike(post.id)}
              onComment={() => {}}
              onShare={() => share(post.id)}
            />
          </View>

          <View className="mt-4 h-px bg-section dark:bg-d-border" />

          <View className="px-6 pt-2">
            <Text className="pt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {post.commentIds.length} comments
            </Text>
            {comments.length === 0 ? (
              <Text className="mt-6 text-center text-sm text-muted-foreground dark:text-d-muted">
                Be the first to leave a kind word.
              </Text>
            ) : (
              comments.map(({ comment, author: cAuthor }) => (
                <CommentRow key={comment.id} comment={comment} author={cAuthor} />
              ))
            )}
          </View>
        </ScrollView>

        <View className="border-t border-section px-4 py-3 dark:border-d-border">
          <CommentComposer onSubmit={(text) => addComment(post.id, text)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
