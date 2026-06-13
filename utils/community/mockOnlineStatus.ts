/** UI-only presence until WebSocket/backend wiring exists. */
export function resolveMockOnlineStatus(userId: string, isCurrentUser = false): boolean {
  if (isCurrentUser) return true;

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash + userId.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash % 3 !== 0;
}

export function withMockOnlineStatus<T extends { id: string; isCurrentUser?: boolean; isOnline?: boolean }>(
  user: T,
): T {
  if (user.isOnline != null) return user;
  return {
    ...user,
    isOnline: resolveMockOnlineStatus(user.id, user.isCurrentUser),
  };
}
