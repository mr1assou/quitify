import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_COMMUNITY_FEED_FILTER,
  isDefaultCommunityFeedFilter,
} from "@/constants/community/communityFeedFilter";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { fetchPosts } from "@/services/posts/postsApi";
import type { FeedItem } from "@/types/community/community";
import type { CommunityFeedFilter } from "@/types/community/communityFeedFilter";
import { buildFeedItems } from "@/utils/community/buildFeedItems";
import { mapFeedPostsFromApi } from "@/utils/community/mapBackendPost";

type LoadMode = "replace" | "append";

type LoadOptions = {
  /** Replace feed without showing loading or pull-to-refresh indicators. */
  silent?: boolean;
};

/** Feed for the Community tab — paginated from the API (10 posts per page). */
export function useCommunityFeed() {
  const { state, setPosts, appendPosts } = useCommunity();
  const { state: appState } = useApp();
  const [filter, setFilter] = useState<CommunityFeedFilter>(DEFAULT_COMMUNITY_FEED_FILTER);
  const [loading, setLoading] = useState(() => state.posts.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const didMountFilterRef = useRef(false);
  const accountUserId = appState.account?.userId ?? null;
  const prevAccountUserIdRef = useRef<number | null>(accountUserId);

  const loadPosts = useCallback(
    async (
      activeFilter: CommunityFeedFilter,
      mode: LoadMode,
      offset: number,
      options: LoadOptions = {},
    ) => {
      const requestId = ++requestIdRef.current;
      const isAppend = mode === "append";
      const isSilent = options.silent === true;

      if (isAppend) {
        setLoadingMore(true);
      } else if (!isSilent) {
        setLoading(true);
      }

      try {
        const page = await fetchPosts(activeFilter, { offset });
        if (requestId !== requestIdRef.current) return;

        const { posts, authorsById } = mapFeedPostsFromApi(page.items);
        if (isAppend) {
          appendPosts(posts, authorsById);
        } else {
          setPosts(posts, authorsById);
        }
        setHasMore(page.has_more);
        setError(null);
      } catch {
        if (requestId !== requestIdRef.current) return;
        if (!isAppend && !isSilent) {
          setError("Could not load posts. Pull to refresh or try again later.");
        }
      } finally {
        if (requestId !== requestIdRef.current) return;
        if (isAppend) {
          setLoadingMore(false);
        } else if (!isSilent) {
          setLoading(false);
        }
      }
    },
    [appendPosts, setPosts],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPosts(filter, "replace", 0, { silent: true });
    } finally {
      setRefreshing(false);
    }
  }, [filter, loadPosts]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    void loadPosts(filter, "append", state.posts.length);
  }, [filter, hasMore, loadPosts, loading, loadingMore, refreshing, state.posts.length]);

  useEffect(() => {
    if (prevAccountUserIdRef.current === accountUserId) return;
    prevAccountUserIdRef.current = accountUserId;
    if (accountUserId == null) return;
    void loadPosts(filter, "replace", 0);
  }, [accountUserId, filter, loadPosts]);

  useFocusEffect(
    useCallback(() => {
      if (state.posts.length === 0) {
        void loadPosts(filter, "replace", 0);
      }
    }, [filter, loadPosts, state.posts.length]),
  );

  useEffect(() => {
    if (!didMountFilterRef.current) {
      didMountFilterRef.current = true;
      return;
    }
    void loadPosts(filter, "replace", 0, { silent: true });
  }, [filter, loadPosts]);

  const applyFilter = useCallback((next: CommunityFeedFilter) => {
    setFilter(next);
  }, []);

  const feed = useMemo(() => {
    return buildFeedItems(
      state.posts,
      state.authorsById,
      appState.profile?.imageUrl,
      state.onlineByUserId,
      state.presenceReady,
      accountUserId,
    );
  }, [
    accountUserId,
    appState.profile?.imageUrl,
    state.authorsById,
    state.onlineByUserId,
    state.presenceReady,
    state.posts,
  ]);

  const hasActiveFilter = !isDefaultCommunityFeedFilter(filter.sort, filter.tagId);

  return {
    feed,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    filter,
    applyFilter,
    hasActiveFilter,
  };
}

export type { FeedItem };
