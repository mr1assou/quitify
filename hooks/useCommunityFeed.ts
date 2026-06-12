import { useMemo } from "react";

import { useCommunity } from "@/context/CommunityContext";
import type { FeedItem } from "@/types/community";
import { buildFeedItems } from "@/utils/community/buildFeedItems";

/** Feed for the Community tab: posts + author + preview comments, newest first. */
export function useCommunityFeed(): FeedItem[] {
  const { state } = useCommunity();

  return useMemo(() => {
    const sorted = [...state.posts].sort((a, b) => b.createdAt - a.createdAt);
    return buildFeedItems(sorted, state.commentsById);
  }, [state.posts, state.commentsById]);
}
