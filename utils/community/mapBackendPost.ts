import { flagUrlForCode } from "@/constants/leaderboardCountries";
import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { PostTagId } from "@/constants/postTags";
import type { CommunityPost, CommunityUser, PostImageCrop, PostMediaFrame } from "@/types/community";
import type { BackendFeedPostResponse, BackendPostResponse } from "@/types/postsApi";
import { resolveBadgeIdForSmokeFreeDays } from "@/utils/badges";

export function authorIdFromFeedPost(post: BackendFeedPostResponse): string {
  return post.is_mine ? CURRENT_USER_ID : `db-${post.author.user_id}`;
}

export function mapBackendAuthorToCommunityUser(
  post: BackendFeedPostResponse,
): CommunityUser {
  const { author } = post;
  const id = authorIdFromFeedPost(post);

  return {
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
  };
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
    media: post.image_url
      ? [
          {
            kind: "image",
            localUri: post.image_url,
            frame: (post.image_frame as PostMediaFrame | null) ?? undefined,
            crop: (post.image_crop as PostImageCrop | null) ?? undefined,
          },
        ]
      : undefined,
    upvoteCount: post.upvote_count,
    downvoteCount: post.downvote_count,
    myVote,
    shareCount: post.share_count,
    commentIds,
    commentCount,
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
  return mapPostFields(post, CURRENT_USER_ID, null, []);
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
