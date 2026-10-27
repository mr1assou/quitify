/** Exact phrase the user must type before the account is deleted. */
export const DELETE_ACCOUNT_CONFIRMATION = "delete account";

export function matchesDeleteAccountConfirmation(value: string): boolean {
  return value.trim().toLowerCase() === DELETE_ACCOUNT_CONFIRMATION;
}
