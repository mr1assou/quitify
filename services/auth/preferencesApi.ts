import { API_URL } from "@/config/api";
import { getAccessToken } from "@/utils/auth/authStorage";

export type UpdateUserPreferencesPayload = {
  timezone?: string;
  motivationCardIndex?: number;
  tipsCardIndex?: number;
};

export async function updateUserPreferences(
  payload: UpdateUserPreferencesPayload,
): Promise<void> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/me/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "1",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}`);
  }

  if (!res.ok) {
    throw new Error("Could not save preferences");
  }
}
