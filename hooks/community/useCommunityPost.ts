import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export type UseCommunityPostResult = {
  detail: CommunityPostDetail | null;
  /** True while the post itself is being fetched (e.g. opened from a notification). */
  loading: boolean;
};

export function useCommunityPost(
  postId: string,
  options?: { forceCommentsReload?: boolean },
): UseCommunityPostResult {
  const { state, loadAllPostComments, loadPostById } = useCommunity();
  const { state: appState } = useApp();
  const forceCommentsReload = options?.forceCommentsReload ?? false;

  const [postFetching, setPostFetching] = useState(false);
  const fetchedRef = useRef<string | null>(null);
  const forcedCommentsRef = useRef<string | null>(null);

  const postInState = state.posts.some((p) => p.id === postId);

  // Fetch the post on demand when it isn't already in the feed cache
  // (e.g. when opening a post screen straight from a notification / cold start).
  useEffect(() => {
    if (!postId || postInState) return;
    if (fetchedRef.current === postId) return;
    fetchedRef.current = postId;

    let cancelled = false;
    setPostFetching(true);
    void loadPostById(postId).finally(() => {
      if (!cancelled) setPostFetching(false);
    });
    return () => {
      cancelled = true;
    };
  }, [postId, postInState, loadPostById]);

  useFocusEffect(
    useCallback(() => {
      if (!postId) return;
      const force =
        forceCommentsReload && forcedCommentsRef.current !== postId;
      if (force) forcedCommentsRef.current = postId;
      void loadAllPostComments(postId, { force });
    }, [loadAllPostComments, postId, forceCommentsReload]),
  );

  const detail = useMemo(() => {
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

  return { detail, loading: postFetching && !detail };
}
