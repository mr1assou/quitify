export const USER_ROLES = ["normal", "support"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const DEFAULT_USER_ROLE: UserRole = "normal";

export const SUPPORT_STAFF_SUBTITLE = "Technical support";

export function isSupportStaffUser(
  user: { role?: string | null } | null | undefined,
): boolean {
  return user?.role === "support";
}

/** True when the signed-in account has the support role. */
export function isSupportRole(role: string | undefined | null): boolean {
  return role === "support";
}
