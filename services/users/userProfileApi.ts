import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type {
  BackendUserPostsPage,
  BackendUserPresenceResponse,
  BackendUserProfileCommentsPage,
  BackendUserStreakResponse,
} from "@/types/profile/userProfileApi";

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const body = (await res.json()) as { message?: string };
    throw new Error(body.message ?? fallback);
  } catch (error) {
    if (error instanceof Error && error.message !== fallback) throw error;
    throw new Error(fallback);
  }
}

/** Support staff only — blocks the account so it can no longer sign in. */
export async function blockUser(
  userId: number,
): Promise<{ user_id: number; status: string }> {
  const res = await authenticatedFetch(`/users/${userId}/block`, {
    method: "POST",
  });
  if (!res.ok) return parseError(res, "Could not block user");
  return res.json() as Promise<{ user_id: number; status: string }>;
}

/** Support staff only — restores a blocked account. */
export async function unblockUser(
  userId: number,
): Promise<{ user_id: number; status: string }> {
  const res = await authenticatedFetch(`/users/${userId}/unblock`, {
    method: "POST",
  });
  if (!res.ok) return parseError(res, "Could not unblock user");
  return res.json() as Promise<{ user_id: number; status: string }>;
}

/** Support staff only — reads whether an account is active or blocked. */
export async function fetchUserModerationStatus(
  userId: number,
): Promise<{ user_id: number; status: "active" | "blocked" }> {
  const res = await authenticatedFetch(`/users/${userId}/moderation-status`);
  if (!res.ok) return parseError(res, "Could not load user status");
  return res.json() as Promise<{
    user_id: number;
    status: "active" | "blocked";
  }>;
}

export async function fetchUserStreak(userId: number): Promise<BackendUserStreakResponse> {
  const res = await authenticatedFetch(`/users/${userId}/streak`);
  if (!res.ok) return parseError(res, "Could not load streak");
  return res.json() as Promise<BackendUserStreakResponse>;
}

export async function fetchUserPresence(userId: number): Promise<BackendUserPresenceResponse> {
  const res = await authenticatedFetch(`/users/${userId}/presence`);
  if (!res.ok) return parseError(res, "Could not load presence");
  return res.json() as Promise<BackendUserPresenceResponse>;
}

export async function fetchUserPosts(
  userId: number,
  offset = 0,
): Promise<BackendUserPostsPage> {
  const res = await authenticatedFetch(`/users/${userId}/posts?offset=${offset}`);
  if (!res.ok) return parseError(res, "Could not load posts");
  return res.json() as Promise<BackendUserPostsPage>;
}

export async function fetchUserComments(
  userId: number,
  offset = 0,
): Promise<BackendUserProfileCommentsPage> {
  const res = await authenticatedFetch(`/users/${userId}/comments?offset=${offset}`);
  if (!res.ok) return parseError(res, "Could not load comments");
  return res.json() as Promise<BackendUserProfileCommentsPage>;
}

export async function fetchUserUpvotedPosts(
  userId: number,
  offset = 0,
): Promise<BackendUserPostsPage> {
  const res = await authenticatedFetch(`/users/${userId}/upvoted-posts?offset=${offset}`);
  if (!res.ok) return parseError(res, "Could not load upvoted posts");
  return res.json() as Promise<BackendUserPostsPage>;
}
