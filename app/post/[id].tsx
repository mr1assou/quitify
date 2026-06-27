import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CommentComposer } from "@/components/feature/community/CommentComposer";
import { CommentThreadList } from "@/components/feature/community/CommentThreadList";
import { PostActions } from "@/components/feature/community/PostActions";
import { PostHeader } from "@/components/feature/community/PostHeader";
import { PostContent } from "@/components/feature/community/PostContent";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useCommunityPost } from "@/hooks/community/useCommunityPost";
import type { CommentReplyTarget } from "@/types/community/community";
import { safeRouter } from "@/utils/app/safeRouter";
import { resolveCommentCount } from "@/utils/community/postEngagement";

const HEADER_HEIGHT = 52;

export default function PostDetailScreen() {
  const { id, commentId } = useLocalSearchParams<{ id: string; commentId?: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { detail, loading: postLoading } = useCommunityPost(id ?? "", {
    forceCommentsReload: Boolean(commentId),
  });
  const { state: appState } = useApp();
  const { state, votePost, addComment, voteComment, updateComment, deleteComment } =
    useCommunity();
  const [replyTarget, setReplyTarget] = useState<CommentReplyTarget | null>(null);

  const screenStyle = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  if (!detail) {
    if (postLoading) {
      return (
        <View className="flex-1 bg-transparent" style={screenStyle}>
          <View className="flex-1 items-center justify-center px-6">
            <ActivityIndicator color={colors.primary} />
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-transparent" style={screenStyle}>
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

  const { post, author, postComments, commentsLoading } = detail;
  const keyboardOffset =
    Platform.OS === "ios" ? insets.top + HEADER_HEIGHT : 0;

  return (
    <View className="flex-1 bg-transparent" style={{ paddingTop: insets.top }}>
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
              onShare={() =>
                safeRouter.pushStack({ pathname: "/share-post/[id]", params: { id: post.id } })
              }
            />
          </View>

          <View className="mt-4 h-px bg-section dark:bg-d-border" />

          <View className="px-6 pt-2">
            <Text className="pt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {resolveCommentCount(post)} comments
            </Text>

            {commentsLoading && postComments.length === 0 ? (
              <View className="items-center py-8">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              <CommentThreadList
                comments={postComments}
                postAuthorId={post.authorId}
                authorsById={state.authorsById}
                onlineByUserId={state.onlineByUserId}
                presenceReady={state.presenceReady}
                currentAccountUserId={appState.account?.userId ?? null}
                onReply={setReplyTarget}
                onVote={(commentId, vote) => void voteComment(post.id, commentId, vote)}
                onEdit={(commentId, text) => updateComment(post.id, commentId, text)}
                onDelete={(commentId) => deleteComment(post.id, commentId)}
              />
            )}
          </View>
        </ScrollView>

        <View className="border-t border-section bg-background px-4 pt-3 dark:border-d-border dark:bg-d-bg">
          <CommentComposer
            replyTo={replyTarget}
            placeholder={replyTarget ? `Reply to @${replyTarget.handle}…` : "Write a comment…"}
            onSubmit={async (text) => {
              await addComment(post.id, text, replyTarget);
              setReplyTarget(null);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
