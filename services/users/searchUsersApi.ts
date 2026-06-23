import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type { BackendUserSearchResponse } from "@/types/users/userSearch";

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const body = (await res.json()) as { message?: string };
    throw new Error(body.message ?? fallback);
  } catch (error) {
    if (error instanceof Error && error.message !== fallback) throw error;
    throw new Error(fallback);
  }
}

export async function searchUsersByUsername(
  username: string,
): Promise<BackendUserSearchResponse> {
  const params = new URLSearchParams({ username });
  const res = await authenticatedFetch(`/users/search?${params.toString()}`);
  if (!res.ok) return parseError(res, "Could not search users");
  return res.json() as Promise<BackendUserSearchResponse>;
}
