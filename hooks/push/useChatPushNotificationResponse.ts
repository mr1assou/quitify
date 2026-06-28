import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { useApp } from "@/context/AppContext";
import { safeRouter } from "@/utils/app/safeRouter";

type ChatPushData = {
  type?: string;
  threadId?: number | string;
};

function parseThreadId(data: ChatPushData): number | null {
  const raw = data.threadId;
  const id = typeof raw === "string" ? Number.parseInt(raw, 10) : raw;
  return Number.isFinite(id) && id! > 0 ? id! : null;
}

function openChatFromPush(data: ChatPushData | undefined) {
  if (data?.type !== "chat") return;

  const threadId = parseThreadId(data);
  if (!threadId) return;

  safeRouter.pushStack({
    pathname: "/chat/[id]",
    params: { id: String(threadId) },
  });
}

/** Opens the chat thread when the user taps a chat push notification. */
export function useChatPushNotificationResponse() {
  const { state } = useApp();

  useEffect(() => {
    if (!state.account) return;

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      openChatFromPush(
        response.notification.request.content.data as ChatPushData,
      );
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        openChatFromPush(
          response.notification.request.content.data as ChatPushData,
        );
      },
    );

    return () => subscription.remove();
  }, [state.account]);
}
