import { authenticatedFetch } from "@/services/api/authenticatedFetch";

export type PushPlatform = "ios" | "android";

type RegisterPushTokenBody = {
  token: string;
  platform: PushPlatform;
};

export async function fetchPushTokenStatus(): Promise<boolean> {
  const res = await authenticatedFetch("/auth/me/push-token");
  if (!res.ok) {
    throw new Error("Could not load notification settings");
  }

  const data = (await res.json()) as { has_token?: boolean };
  return data.has_token === true;
}

export async function registerPushTokenOnBackend(
  body: RegisterPushTokenBody,
): Promise<void> {
  const res = await authenticatedFetch("/auth/me/push-token", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      bodyText.trim() || `Could not save push token (${res.status})`,
    );
  }
}

export async function clearPushTokensOnBackend(): Promise<void> {
  const res = await authenticatedFetch("/auth/me/push-token/clear", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Could not turn off notifications");
  }
}
