import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import type { CommunityPost, CommunityUser, PostComment } from "@/types/community";
import { resolveCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";

export type CommunityPostDetail = {
  post: CommunityPost;
  author: CommunityUser;
  comments: Array<{ comment: PostComment; author: CommunityUser }>;
};

export function useCommunityPost(postId: string): CommunityPostDetail | null {
  const { state, loadPostComments } = useCommunity();
  const { state: appState } = useApp();

  useFocusEffect(
    useCallback(() => {
      if (!postId) return;
      void loadPostComments(postId);
    }, [loadPostComments, postId]),
  );

  return useMemo(() => {
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return null;

    const author = resolveCommunityAuthor(post.authorId, {
      authorsById: state.authorsById,
      currentUserImageUrl: appState.profile?.imageUrl,
      onlineByUserId: state.onlineByUserId,
      presenceReady: state.presenceReady,
    });
    if (!author) return null;

    const comments = post.commentIds
      .map((cid) => state.commentsById[cid])
      .filter((c): c is PostComment => Boolean(c))
      .map((c) => {
        const cAuthor = resolveCommunityAuthor(c.authorId, {
          authorsById: state.authorsById,
          currentUserImageUrl: appState.profile?.imageUrl,
          onlineByUserId: state.onlineByUserId,
          presenceReady: state.presenceReady,
        });
        return cAuthor ? { comment: c, author: cAuthor } : null;
      })
      .filter((c): c is { comment: PostComment; author: CommunityUser } => c !== null);

    return { post, author, comments };
  }, [
    appState.profile?.imageUrl,
    postId,
    state.authorsById,
    state.commentsById,
    state.onlineByUserId,
    state.presenceReady,
    state.posts,
  ]);
}
