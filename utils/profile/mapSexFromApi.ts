import type { ProfileSex } from "@/types/onboarding/onboarding";

/** Maps `/auth/me` sex label to app `ProfileSex`. */
export function mapSexFromApi(sex?: string | null): ProfileSex | undefined {
  if (!sex?.trim()) return undefined;

  const normalized = sex.trim().toLowerCase();
  if (normalized === "male") return "male";
  if (normalized === "female") return "female";
  if (normalized.includes("prefer")) return "prefer_not_say";

  return undefined;
}
