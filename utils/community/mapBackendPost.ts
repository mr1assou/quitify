import { flagUrlForCode } from "@/constants/leaderboard/leaderboardCountries";
import type { PostTagId } from "@/constants/community/postTags";
import type { CommunityPost, CommunityUser, PostImageCrop, PostMedia, PostMediaFrame, PostMediaKind } from "@/types/community/community";
import type { BackendFeedPostResponse, BackendPostResponse } from "@/types/community/postsApi";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/progress/badges";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";
import { dbAuthorId } from "@/utils/community/presence";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

export function authorIdFromFeedPost(post: BackendFeedPostResponse): string {
  return dbAuthorId(post.author.user_id);
}

export function mapBackendAuthorToCommunityUser(
  post: BackendFeedPostResponse,
): CommunityUser {
  const { author } = post;
  const id = authorIdFromFeedPost(post);

  return withMockOnlineStatus({
    id,
    name: author.username?.trim() || "Member",
    handle: author.username?.trim().toLowerCase() || `user${author.user_id}`,
    bio: "",
    smokeFreeDays: author.smoke_free_days,
    badgeId: resolveBadgeIdForSmokeFreeDays(author.smoke_free_days, post.is_mine),
    avatarUrl: author.image_url ?? undefined,
    countryFlag: author.countryFlag ?? flagUrlForCode("us"),
    avatarRank: (author.user_id % 10) + 1,
    leaderboardRank: 0,
    isCurrentUser: post.is_mine,
    location: author.country ?? undefined,
    isOnline: post.is_mine ? true : author.is_online,
  });
}

function mapBackendPostMedia(
  post: BackendPostResponse | BackendFeedPostResponse,
): PostMedia[] | undefined {
  if (!post.image_url) return undefined;

  const kind: PostMediaKind = post.media_kind === "video" ? "video" : "image";

  return [
    {
      kind,
      localUri: post.image_url,
      frame: (post.image_frame as PostMediaFrame | null) ?? undefined,
      crop:
        kind === "image"
          ? ((post.image_crop as PostImageCrop | null) ?? undefined)
          : undefined,
      durationLabel:
        kind === "video" && post.media_duration_ms
          ? formatMediaDuration(post.media_duration_ms)
          : undefined,
    },
  ];
}

function mapPostFields(
  post: BackendPostResponse | BackendFeedPostResponse,
  authorId: string,
  myVote: CommunityPost["myVote"],
  commentIds: string[],
  commentCount?: number,
): CommunityPost {
  return {
    id: String(post.post_id),
    authorId,
    title: post.title,
    tagId: post.tag_id as PostTagId,
    text: post.description,
    createdAt: new Date(post.created_at).getTime(),
    media: mapBackendPostMedia(post),
    upvoteCount: post.upvote_count,
    downvoteCount: post.downvote_count,
    myVote,
    shareCount: post.share_count,
    commentIds,
    commentCount,
    moderated: "is_moderated" in post ? Boolean(post.is_moderated) : false,
  };
}

export function mapBackendFeedPostToCommunityPost(
  post: BackendFeedPostResponse,
): CommunityPost {
  return mapPostFields(
    post,
    authorIdFromFeedPost(post),
    post.my_vote,
    [],
    post.comment_count,
  );
}

export function mapBackendPostToCommunityPost(post: BackendPostResponse): CommunityPost {
  return mapPostFields(post, dbAuthorId(post.author_id), null, []);
}

export function mapFeedPostsFromApi(posts: BackendFeedPostResponse[]): {
  posts: CommunityPost[];
  authorsById: Record<string, CommunityUser>;
} {
  const authorsById: Record<string, CommunityUser> = {};
  const mappedPosts = posts.map((post) => {
    const author = mapBackendAuthorToCommunityUser(post);
    authorsById[author.id] = author;
    return mapBackendFeedPostToCommunityPost(post);
  });

  return { posts: mappedPosts, authorsById };
}
