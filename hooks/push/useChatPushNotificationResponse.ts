import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

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

function responseKey(response: Notifications.NotificationResponse): string {
  return (
    response.notification.request.identifier ||
    `${response.actionIdentifier}:${response.notification.date}`
  );
}

function openChatFromPush(data: ChatPushData | undefined): boolean {
  if (data?.type !== "chat") return false;

  const threadId = parseThreadId(data);
  if (!threadId) return false;

  safeRouter.pushStack({
    pathname: "/chat/[id]",
    params: { id: String(threadId) },
  });
  return true;
}

/**
 * Opens the chat thread when the user taps a chat push notification.
 * Clears Expo's last response after handling so a stale tap cannot reopen the chat later.
 */
export function useChatPushNotificationResponse() {
  const { state } = useApp();
  const accountUserId = state.account?.userId ?? null;
  const handledKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (accountUserId == null) return;

    const handleResponse = async (
      response: Notifications.NotificationResponse | null | undefined,
      clearStored: boolean,
    ) => {
      if (!response) return;

      const key = responseKey(response);
      if (handledKeysRef.current.has(key)) {
        if (clearStored) {
          await Notifications.clearLastNotificationResponseAsync();
        }
        return;
      }

      const opened = openChatFromPush(
        response.notification.request.content.data as ChatPushData,
      );
      handledKeysRef.current.add(key);

      // Always clear so re-renders / account updates do not replay this tap.
      if (opened || clearStored) {
        await Notifications.clearLastNotificationResponseAsync();
      }
    };

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      void handleResponse(response, true);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        void handleResponse(response, true);
      },
    );

    return () => subscription.remove();
  }, [accountUserId]);
}
