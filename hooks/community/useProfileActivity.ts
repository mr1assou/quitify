import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import {
  fetchUserComments,
  fetchUserPosts,
  fetchUserUpvotedPosts,
} from "@/services/users/userProfileApi";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { CommunityPost, FeedItem, PostComment } from "@/types/community/community";
import { buildFeedItems } from "@/utils/community/buildFeedItems";
import { mapFeedPostsFromApi } from "@/utils/community/mapBackendPost";
import { resolveProfileCommunityUserId, resolveProfileUserId } from "@/utils/profile/resolveProfileUserId";

export type ProfileActivityComment = {
  comment: PostComment;
  post: CommunityPost;
};

type ProfileActivityState = {
  postFeed: FeedItem[];
  comments: ProfileActivityComment[];
  upvotedFeed: FeedItem[];
  communityUserId: string;
  loading: boolean;
};

const EMPTY_ACTIVITY: ProfileActivityState = {
  postFeed: [],
  comments: [],
  upvotedFeed: [],
  communityUserId: "",
  loading: false,
};

type RawProfileActivity = {
  postsMapped: ReturnType<typeof mapFeedPostsFromApi>;
  commentsItems: Awaited<ReturnType<typeof fetchUserComments>>["items"];
  upvotedMapped: ReturnType<typeof mapFeedPostsFromApi>;
};

function mapProfileComments(
  items: Awaited<ReturnType<typeof fetchUserComments>>["items"],
  communityUserId: string,
): ProfileActivityComment[] {
  return items.map((item) => ({
    comment: {
      id: String(item.comment_id),
      postId: String(item.post_id),
      authorId: communityUserId,
      text: item.text,
      createdAt: new Date(item.created_at).getTime(),
      upvoteCount: 0,
      downvoteCount: 0,
      myVote: null,
      parentCommentId: null,
      replyToUserId: null,
      replyToHandle: null,
    },
    post: {
      id: String(item.post.post_id),
      authorId: "",
      title: item.post.title,
      text: item.post.description,
      createdAt: 0,
      upvoteCount: 0,
      downvoteCount: 0,
      shareCount: 0,
      commentIds: [],
      myVote: null,
    },
  }));
}

export function useProfileActivity(profile: PlayerProfile): ProfileActivityState {
  const { state: appState } = useApp();
  const { state: communityState } = useCommunity();
  const communityUserId = resolveProfileCommunityUserId(profile);
  const userId = resolveProfileUserId(profile, appState.account?.userId);
  const currentUserImageUrl = appState.profile?.imageUrl;

  const [rawActivity, setRawActivity] = useState<RawProfileActivity | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) {
      setRawActivity(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const [postsPage, commentsPage, upvotedPage] = await Promise.all([
          fetchUserPosts(userId),
          fetchUserComments(userId),
          fetchUserUpvotedPosts(userId),
        ]);

        if (cancelled) return;

        setRawActivity({
          postsMapped: mapFeedPostsFromApi(postsPage.items),
          commentsItems: commentsPage.items,
          upvotedMapped: mapFeedPostsFromApi(upvotedPage.items),
        });
      } catch {
        if (!cancelled) setRawActivity(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return useMemo(() => {
    if (!userId) {
      return { ...EMPTY_ACTIVITY, communityUserId };
    }

    if (loading) {
      return { ...EMPTY_ACTIVITY, communityUserId, loading: true };
    }

    if (!rawActivity) {
      return { ...EMPTY_ACTIVITY, communityUserId, loading: false };
    }

    const authorsById = {
      ...rawActivity.postsMapped.authorsById,
      ...rawActivity.upvotedMapped.authorsById,
      ...communityState.authorsById,
    };

    return {
      communityUserId,
      loading: false,
      postFeed: buildFeedItems(
        rawActivity.postsMapped.posts,
        authorsById,
        currentUserImageUrl,
        communityState.onlineByUserId,
        communityState.presenceReady,
        userId,
      ),
      comments: mapProfileComments(rawActivity.commentsItems, communityUserId),
      upvotedFeed: buildFeedItems(
        rawActivity.upvotedMapped.posts,
        authorsById,
        currentUserImageUrl,
        communityState.onlineByUserId,
        communityState.presenceReady,
        userId,
      ),
    };
  }, [
    communityState.authorsById,
    communityState.onlineByUserId,
    communityState.presenceReady,
    communityUserId,
    currentUserImageUrl,
    loading,
    rawActivity,
    userId,
  ]);
}
