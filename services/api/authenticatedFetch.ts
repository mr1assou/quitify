import { API_URL } from "@/config/api";
import { getAccessToken } from "@/utils/auth/authStorage";

type AuthenticatedFetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function authenticatedFetch(
  path: string,
  init: AuthenticatedFetchInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    return await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "ngrok-skip-browser-warning": "1",
        "Cache-Control": "no-cache",
        ...init.headers,
      },
    });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}`);
  }
}
