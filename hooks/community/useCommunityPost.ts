import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import type { CommunityPost, CommunityUser, PostComment } from "@/types/community/community";
import { resolveCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";
import { resolvePostCommentIds } from "@/utils/community/resolvePostCommentIds";

export type CommunityPostDetail = {
  post: CommunityPost;
  author: CommunityUser;
  postComments: PostComment[];
  commentsLoading: boolean;
};

export function useCommunityPost(postId: string): CommunityPostDetail | null {
  const { state, loadAllPostComments } = useCommunity();
  const { state: appState } = useApp();

  useFocusEffect(
    useCallback(() => {
      if (!postId) return;
      void loadAllPostComments(postId);
    }, [loadAllPostComments, postId]),
  );

  return useMemo(() => {
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return null;

    const author = resolveCommunityAuthor(post.authorId, {
      authorsById: state.authorsById,
      currentUserImageUrl: appState.profile?.imageUrl,
      currentAccountUserId: appState.account?.userId ?? null,
      onlineByUserId: state.onlineByUserId,
      presenceReady: state.presenceReady,
    });
    if (!author) return null;

    const commentIds = resolvePostCommentIds(post, {
      posts: state.posts,
      commentsById: state.commentsById,
    });

    const postComments = commentIds
      .map((id) => state.commentsById[id])
      .filter((comment): comment is PostComment => Boolean(comment))
      .sort((a, b) => a.createdAt - b.createdAt);

    return {
      post,
      author,
      postComments,
      commentsLoading: state.commentsLoadingByPostId[postId] ?? false,
    };
  }, [
    appState.account?.userId,
    appState.profile?.imageUrl,
    postId,
    state.authorsById,
    state.commentsById,
    state.commentsLoadingByPostId,
    state.onlineByUserId,
    state.presenceReady,
    state.posts,
  ]);
}
