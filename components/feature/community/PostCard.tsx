import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import type { FeedItem, PostComment } from "@/types/community";
import { safeRouter } from "@/utils/safeRouter";

import { CommentComposer } from "./CommentComposer";
import { CommentRow } from "./CommentRow";
import { PostActions } from "./PostActions";
import { PostHeader } from "./PostHeader";
import { PostOwnerMenu } from "./PostOwnerMenu";
import { PostContent } from "./PostContent";
import { resolveCommentCount } from "@/utils/community/postEngagement";
import { resolveCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";

type Props = {
  item: FeedItem;
  showOwnerActions?: boolean;
};

export function PostCard({ item, showOwnerActions = false }: Props) {
  const { colors } = useTheme();
  const { votePost, share, addComment, loadPostComments, state } = useCommunity();
  const { state: appState } = useApp();
  const { post, author } = item;
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const comments = useMemo(() => {
    return post.commentIds
      .map((cid) => state.commentsById[cid])
      .filter((c): c is PostComment => Boolean(c))
      .map((comment) => {
        const cAuthor = resolveCommunityAuthor(comment.authorId, {
          authorsById: state.authorsById,
          currentUserImageUrl: appState.profile?.imageUrl,
        });
        return cAuthor ? { comment, author: cAuthor } : null;
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [appState.profile?.imageUrl, post.commentIds, state.authorsById, state.commentsById]);

  const openPost = () => safeRouter.push(`/post/${post.id}`);

  const onCommentPress = () => {
    if (commentsOpen) {
      setCommentsOpen(false);
      return;
    }

    setCommentsOpen(true);

    const needsFetch =
      post.commentIds.length === 0 && resolveCommentCount(post) > 0;
    if (!needsFetch) return;

    setCommentsLoading(true);
    void loadPostComments(post.id).finally(() => setCommentsLoading(false));
  };

  return (
    <View>
      <View className="flex-row items-start">
        <View className="min-w-0 flex-1">
          <PostHeader author={author} createdAt={post.createdAt} />
        </View>
        {showOwnerActions ? <PostOwnerMenu postId={post.id} /> : null}
      </View>

      <PostContent post={post} onPress={openPost} />

      <View className="mt-2">
        <PostActions
          upvoteCount={post.upvoteCount}
          downvoteCount={post.downvoteCount}
          myVote={post.myVote}
          commentCount={resolveCommentCount(post)}
          shareCount={post.shareCount}
          commentsActive={commentsOpen}
          onVote={(vote) => votePost(post.id, vote)}
          onComment={onCommentPress}
          onShare={() => share(post.id)}
        />

        {commentsOpen ? (
          <View className="mt-3 border-t border-border pt-3 dark:border-d-border">
            {commentsLoading ? (
              <View className="items-center py-4">
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              comments.map(({ comment, author: cAuthor }) => (
                <CommentRow key={comment.id} comment={comment} author={cAuthor} />
              ))
            )}
            <View className="mt-1.5">
              <CommentComposer
                compact
                placeholder="Add a comment…"
                onSubmit={(text) => addComment(post.id, text)}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
