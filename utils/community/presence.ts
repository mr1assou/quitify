import { CURRENT_USER_ID } from "@/constants/communityUsers";

export function dbAuthorId(userId: number): string {
  return `db-${userId}`;
}

export function parseDbUserId(authorId: string): number | null {
  if (authorId === CURRENT_USER_ID) return null;
  const match = /^db-(\d+)$/.exec(authorId);
  if (!match) return null;
  const id = Number.parseInt(match[1], 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function resolveOnlineFromMap(
  authorId: string,
  onlineByUserId: Record<number, boolean>,
  fallback?: boolean,
  presenceReady = false,
): boolean | undefined {
  const userId = parseDbUserId(authorId);
  if (userId == null) return fallback;
  if (userId in onlineByUserId) return onlineByUserId[userId];
  if (presenceReady) return false;
  return fallback;
}
