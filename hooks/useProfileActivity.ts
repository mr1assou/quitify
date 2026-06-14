import { useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import {
  fetchUserComments,
  fetchUserPosts,
  fetchUserUpvotedPosts,
} from "@/services/users/userProfileApi";
import type { PlayerProfile } from "@/types/playerProfile";
import type { CommunityPost, FeedItem, PostComment } from "@/types/community";
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

  const [activity, setActivity] = useState<ProfileActivityState>({
    ...EMPTY_ACTIVITY,
    communityUserId,
    loading: Boolean(userId),
  });

  useEffect(() => {
    if (!userId) {
      setActivity({ ...EMPTY_ACTIVITY, communityUserId });
      return;
    }

    let cancelled = false;
    setActivity((prev) => ({ ...prev, loading: true, communityUserId }));

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
        const authorsById = {
          ...postsMapped.authorsById,
          ...upvotedMapped.authorsById,
          ...communityState.authorsById,
        };

        setActivity({
          communityUserId,
          loading: false,
          postFeed: buildFeedItems(
            postsMapped.posts,
            authorsById,
            currentUserImageUrl,
            communityState.onlineByUserId,
            communityState.presenceReady,
            userId,
          ),
          comments: mapProfileComments(commentsPage.items, communityUserId),
          upvotedFeed: buildFeedItems(
            upvotedMapped.posts,
            authorsById,
            currentUserImageUrl,
            communityState.onlineByUserId,
            communityState.presenceReady,
            userId,
          ),
        });
      } catch {
        if (!cancelled) {
          setActivity({ ...EMPTY_ACTIVITY, communityUserId, loading: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    communityState.authorsById,
    communityState.onlineByUserId,
    communityState.presenceReady,
    communityUserId,
    currentUserImageUrl,
    userId,
  ]);

  return activity;
}
