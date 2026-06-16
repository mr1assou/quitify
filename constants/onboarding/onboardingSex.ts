import type { ProfileSexOption } from "@/types/onboarding/onboarding";
import type { DropdownOption } from "@/types/shared/ui";

import { MAX_PROFILE_AGE_YEARS, MIN_PROFILE_AGE_YEARS } from "@/utils/profile/birthdate";

export type { ProfileSex, ProfileSexOption } from "@/types/onboarding/onboarding";
export type { DropdownOption } from "@/types/shared/ui";

export const PROFILE_SEX_OPTIONS: readonly ProfileSexOption[] = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "prefer_not_say", label: "Prefer not to say" },
] as const;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const MONTH_OPTIONS: DropdownOption[] = MONTH_NAMES.map((name, i) => ({
  value: i + 1,
  label: name,
}));

export const DAY_OPTIONS: DropdownOption[] = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

/** Birth years that satisfy the configured min / max profile age (inclusive). */
export function birthYearOptions(now = new Date()): DropdownOption[] {
  const cy = now.getFullYear();
  const maxYear = cy - MIN_PROFILE_AGE_YEARS;
  const minYear = cy - MAX_PROFILE_AGE_YEARS;
  const out: DropdownOption[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    out.push({ value: y, label: String(y) });
  }
  return out;
}
