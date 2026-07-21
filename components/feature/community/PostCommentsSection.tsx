import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { formatUsernameMention } from "@/constants/onboarding/onboardingUsername";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { CommentReplyTarget, PostComment } from "@/types/community/community";

import { CommentComposer } from "./CommentComposer";
import { CommentThreadList } from "./CommentThreadList";

type Props = {
  postId: string;
  commentIds: string[];
  totalCommentCount?: number;
  compactComposer?: boolean;
};

export function PostCommentsSection({
  postId,
  commentIds,
  totalCommentCount,
  compactComposer = false,
}: Props) {
  const { colors } = useTheme();
  const { state: appState } = useApp();
  const { addComment, voteComment, updateComment, deleteComment, loadMorePostComments, state } =
    useCommunity();
  const [replyTarget, setReplyTarget] = useState<CommentReplyTarget | null>(null);

  const post = state.posts.find((item) => item.id === postId);
  const postAuthorId = post?.authorId ?? "";

  const postComments = useMemo(() => {
    const ids = new Set(commentIds);
    for (const comment of Object.values(state.commentsById)) {
      if (comment.postId === postId) {
        ids.add(comment.id);
      }
    }

    return Array.from(ids)
      .map((id) => state.commentsById[id])
      .filter((comment): comment is PostComment => Boolean(comment))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [commentIds, postId, state.commentsById]);

  const hasMore = state.commentsHasMoreByPostId[postId] ?? false;
  const loadingMore = state.commentsLoadingMoreByPostId[postId] ?? false;
  const remainingCount = Math.max(
    0,
    (totalCommentCount ?? postComments.length) - postComments.length,
  );

  return (
    <View className="mt-3 border-t border-border pt-3 dark:border-d-border">
      <CommentThreadList
        comments={postComments}
        postAuthorId={postAuthorId}
        authorsById={state.authorsById}
        onlineByUserId={state.onlineByUserId}
        presenceReady={state.presenceReady}
        currentAccountUserId={appState.account?.userId ?? null}
        onReply={setReplyTarget}
        onVote={(commentId, vote) => void voteComment(postId, commentId, vote)}
        onEdit={(commentId, text) => updateComment(postId, commentId, text)}
        onDelete={(commentId) => deleteComment(postId, commentId)}
      />

      {hasMore ? (
        <Pressable
          onPress={() => void loadMorePostComments(postId)}
          disabled={loadingMore}
          className="mt-2 py-2"
          hitSlop={6}
        >
          {loadingMore ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text className="text-sm font-semibold text-primary">
              {remainingCount > 0
                ? `See more comments (${remainingCount} remaining)`
                : "See more comments"}
            </Text>
          )}
        </Pressable>
      ) : null}

      <View className="mt-1.5">
        <CommentComposer
          compact={compactComposer}
          placeholder={
            replyTarget
              ? `Reply to ${formatUsernameMention(replyTarget.handle)}…`
              : "Add a comment…"
          }
          replyTo={replyTarget}
          onSubmit={async (text) => {
            await addComment(postId, text, replyTarget);
            setReplyTarget(null);
          }}
        />
      </View>
    </View>
  );
}

export function PostCommentsLoader() {
  const { colors } = useTheme();

  return (
    <View className="items-center py-4">
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
