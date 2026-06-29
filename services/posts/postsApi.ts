import { POST_COMMENTS_PAGE_SIZE } from "@/constants/community/postCommentsPagination";
import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { PostVote } from "@/types/community/community";
import type {
  AllowedPostContentType,
  BackendFeedPageResponse,
  BackendFeedPostResponse,
  BackendPostCommentEngagement,
  BackendPostCommentResponse,
  BackendPostCommentsPageResponse,
  BackendDeleteCommentResponse,
  BackendPostEngagement,
  BackendPostResponse,
  CreatePostPayload,
  PresignedUploadResponse,
} from "@/types/community/postsApi";
import type { UpdatePostPayload } from "@/types/community/updatePost";
import { DEFAULT_COMMUNITY_FEED_FILTER, COMMUNITY_FEED_PAGE_SIZE } from "@/constants/community/communityFeedFilter";
import type { CommunityFeedFilter } from "@/types/community/communityFeedFilter";
import { buildPostsQueryString } from "@/utils/community/buildPostsQueryString";
import type { PostsQueryPagination } from "@/utils/community/buildPostsQueryString";

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message[0] ?? fallback;
    if (body.message) return body.message;
  } catch {
    // ignore parse errors
  }
  return fallback;
}

export async function requestPostUploadUrl(
  contentType: AllowedPostContentType,
): Promise<PresignedUploadResponse> {
  const res = await authenticatedFetch("/upload-url", {
    method: "POST",
    body: JSON.stringify({ contentType }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not prepare media upload"));
  }

  return res.json() as Promise<PresignedUploadResponse>;
}

export async function uploadImageToPresignedUrl(
  uploadUrl: string,
  localUri: string,
  contentType: AllowedPostContentType,
): Promise<void> {
  const fileResponse = await fetch(localUri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }
}

export async function fetchPosts(
  filter: CommunityFeedFilter = DEFAULT_COMMUNITY_FEED_FILTER,
  pagination: PostsQueryPagination = {},
): Promise<BackendFeedPageResponse> {
  const query = buildPostsQueryString(filter, {
    offset: pagination.offset ?? 0,
    limit: pagination.limit ?? COMMUNITY_FEED_PAGE_SIZE,
  });
  const res = await authenticatedFetch(`/posts${query}`);

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not load posts"));
  }

  return res.json() as Promise<BackendFeedPageResponse>;
}

export async function fetchPostById(
  postId: string,
): Promise<BackendFeedPostResponse> {
  const res = await authenticatedFetch(`/posts/${postId}`);

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not load post"));
  }

  return res.json() as Promise<BackendFeedPostResponse>;
}

export async function createPost(payload: CreatePostPayload): Promise<BackendPostResponse> {
  const res = await authenticatedFetch("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not create post"));
  }

  return res.json() as Promise<BackendPostResponse>;
}

export async function updatePost(
  postId: string,
  payload: UpdatePostPayload,
): Promise<BackendPostResponse> {
  const res = await authenticatedFetch(`/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not update post"));
  }

  return res.json() as Promise<BackendPostResponse>;
}

export async function deletePost(postId: string): Promise<{ post_id: number }> {
  const res = await authenticatedFetch(`/posts/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not delete post"));
  }

  return res.json() as Promise<{ post_id: number }>;
}

export async function moderatePost(
  postId: string,
): Promise<{ post_id: number; author_id: number }> {
  const res = await authenticatedFetch(`/posts/${postId}/moderate`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not remove post"));
  }

  return res.json() as Promise<{ post_id: number; author_id: number }>;
}

export async function voteOnPost(
  postId: string,
  vote: PostVote,
): Promise<BackendPostEngagement> {
  const res = await authenticatedFetch(`/posts/${postId}/vote`, {
    method: "POST",
    body: JSON.stringify({ vote }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not update vote"));
  }

  return res.json() as Promise<BackendPostEngagement>;
}

export async function sharePost(postId: string): Promise<BackendPostEngagement> {
  const res = await authenticatedFetch(`/posts/${postId}/share`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not share post"));
  }

  return res.json() as Promise<BackendPostEngagement>;
}

export async function fetchPostComments(
  postId: string,
  pagination: { offset?: number; limit?: number } = {},
): Promise<BackendPostCommentsPageResponse> {
  const offset = pagination.offset ?? 0;
  const limit = pagination.limit ?? POST_COMMENTS_PAGE_SIZE;
  const query = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  const res = await authenticatedFetch(`/posts/${postId}/comments?${query.toString()}`);

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not load comments"));
  }

  return res.json() as Promise<BackendPostCommentsPageResponse>;
}

export type CreatePostCommentPayload = {
  text: string;
  parent_comment_id?: number;
  reply_to_user_id?: number;
};

export async function createPostComment(
  postId: string,
  payload: CreatePostCommentPayload,
): Promise<BackendPostCommentResponse> {
  const res = await authenticatedFetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not post comment"));
  }

  return res.json() as Promise<BackendPostCommentResponse>;
}

export async function voteOnComment(
  postId: string,
  commentId: string,
  vote: PostVote,
): Promise<BackendPostCommentEngagement> {
  const res = await authenticatedFetch(`/posts/${postId}/comments/${commentId}/vote`, {
    method: "POST",
    body: JSON.stringify({ vote }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not update comment vote"));
  }

  return res.json() as Promise<BackendPostCommentEngagement>;
}

export async function updatePostComment(
  postId: string,
  commentId: string,
  text: string,
): Promise<BackendPostCommentResponse> {
  const res = await authenticatedFetch(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not update comment"));
  }

  return res.json() as Promise<BackendPostCommentResponse>;
}

export async function deletePostComment(
  postId: string,
  commentId: string,
): Promise<BackendDeleteCommentResponse> {
  const res = await authenticatedFetch(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not delete comment"));
  }

  return res.json() as Promise<BackendDeleteCommentResponse>;
}
