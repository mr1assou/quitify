import { API_URL } from "@/config/api";

export type AppVersionRequirement = {
  minSupportedVersion: string;
  androidStoreUrl: string;
  iosStoreUrl: string | null;
};

/** Null on any failure — never lock users out because the check itself failed. */
export async function fetchAppVersionRequirement(): Promise<AppVersionRequirement | null> {
  try {
    const response = await fetch(`${API_URL}/app-version`);
    if (!response.ok) return null;

    const data = (await response.json()) as Partial<AppVersionRequirement>;
    if (typeof data.minSupportedVersion !== "string") return null;

    return {
      minSupportedVersion: data.minSupportedVersion,
      androidStoreUrl:
        typeof data.androidStoreUrl === "string" ? data.androidStoreUrl : "",
      iosStoreUrl: typeof data.iosStoreUrl === "string" ? data.iosStoreUrl : null,
    };
  } catch {
    return null;
  }
}
