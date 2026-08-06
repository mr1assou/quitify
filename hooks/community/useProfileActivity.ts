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

function postsContentEqual(a: CommunityPost, b: CommunityPost): boolean {
  return (
    a.id === b.id &&
    a.title === b.title &&
    a.text === b.text &&
    a.tagId === b.tagId &&
    a.createdAt === b.createdAt &&
    a.upvoteCount === b.upvoteCount &&
    a.downvoteCount === b.downvoteCount &&
    a.shareCount === b.shareCount &&
    a.myVote === b.myVote &&
    (a.commentCount ?? a.commentIds.length) ===
      (b.commentCount ?? b.commentIds.length) &&
    JSON.stringify(a.media) === JSON.stringify(b.media)
  );
}

function postListsEqual(a: CommunityPost[], b: CommunityPost[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((post, index) => postsContentEqual(post, b[index]));
}

function syncProfilePosts(
  posts: CommunityPost[],
  communityPostsById: Map<string, CommunityPost>,
  deletedPostIds: Set<string>,
): CommunityPost[] {
  return posts
    .filter((post) => !deletedPostIds.has(post.id))
    .map((post) => communityPostsById.get(post.id) ?? post);
}

function applyCommunityPostSync(
  current: RawProfileActivity,
  communityPosts: CommunityPost[],
  deletedPostIds: string[],
): RawProfileActivity {
  const deleted = new Set(deletedPostIds);
  const communityPostsById = new Map(communityPosts.map((post) => [post.id, post]));
  const nextUserPosts = syncProfilePosts(
    current.postsMapped.posts,
    communityPostsById,
    deleted,
  );
  const nextUpvotedPosts = syncProfilePosts(
    current.upvotedMapped.posts,
    communityPostsById,
    deleted,
  );

  if (
    postListsEqual(nextUserPosts, current.postsMapped.posts) &&
    postListsEqual(nextUpvotedPosts, current.upvotedMapped.posts)
  ) {
    return current;
  }

  return {
    ...current,
    postsMapped: { ...current.postsMapped, posts: nextUserPosts },
    upvotedMapped: { ...current.upvotedMapped, posts: nextUpvotedPosts },
  };
}

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

export function useProfileActivity(
  profile: PlayerProfile,
  enabled = true,
): ProfileActivityState {
  const { state: appState } = useApp();
  const { state: communityState, appendPosts } = useCommunity();
  const communityUserId = resolveProfileCommunityUserId(profile);
  const userId = resolveProfileUserId(profile, appState.account?.userId);
  /** Signed-in viewer — never the profile being viewed. */
  const viewerAccountUserId = appState.account?.userId ?? null;
  const currentUserImageUrl = appState.profile?.imageUrl;

  const [rawActivity, setRawActivity] = useState<RawProfileActivity | null>(null);
  const [loading, setLoading] = useState(Boolean(userId));

  useEffect(() => {
    if (!enabled || !userId) {
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

        const postsMapped = mapFeedPostsFromApi(postsPage.items);
        const upvotedMapped = mapFeedPostsFromApi(upvotedPage.items);

        appendPosts(postsMapped.posts, postsMapped.authorsById);
        appendPosts(upvotedMapped.posts, upvotedMapped.authorsById);

        setRawActivity({
          postsMapped,
          commentsItems: commentsPage.items,
          upvotedMapped,
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
  }, [appendPosts, enabled, userId]);

  useEffect(() => {
    setRawActivity((current) => {
      if (!current) return current;
      return applyCommunityPostSync(
        current,
        communityState.posts,
        communityState.deletedPostIds,
      );
    });
  }, [communityState.deletedPostIds, communityState.posts]);

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
        viewerAccountUserId,
      ),
      comments: mapProfileComments(rawActivity.commentsItems, communityUserId),
      upvotedFeed: buildFeedItems(
        rawActivity.upvotedMapped.posts,
        authorsById,
        currentUserImageUrl,
        communityState.onlineByUserId,
        communityState.presenceReady,
        viewerAccountUserId,
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
    viewerAccountUserId,
  ]);
}
