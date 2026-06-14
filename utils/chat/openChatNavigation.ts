import { safeRouter } from "@/utils/safeRouter";

export async function navigateToChatThread(
  threadId: string,
  mode: "push" | "replace" = "push",
): Promise<void> {
  const path = `/chat/${threadId}`;
  if (mode === "replace") {
    safeRouter.replace(path);
    return;
  }
  safeRouter.push(path);
}

export async function openChatAndNavigate(
  peerUserId: number,
  openChatThreadWithPeer: (peerUserId: number) => Promise<string | null>,
  options?: { mode?: "push" | "replace"; onFailure?: () => void },
): Promise<void> {
  const threadId = await openChatThreadWithPeer(peerUserId);
  if (!threadId) {
    options?.onFailure?.();
    return;
  }

  await navigateToChatThread(threadId, options?.mode ?? "push");
}
