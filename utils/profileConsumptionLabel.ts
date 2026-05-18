import type { UserProfile } from "@/types";

/** Short label for the Profile screen habit row. */
export function habitQuantityLabel(profile: UserProfile): string {
  return `${profile.cigarettesPerDay} cigarettes / day`;
}
