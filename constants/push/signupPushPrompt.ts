/** Delay before asking for notification permission after sign-up or re-login. */
export const PUSH_PERMISSION_PROMPT_DELAY_MS = 5_000;

/** @deprecated Use PUSH_PERMISSION_PROMPT_DELAY_MS */
export const PUSH_SIGNUP_PROMPT_DELAY_MS = PUSH_PERMISSION_PROMPT_DELAY_MS;

export const PUSH_SIGNUP_PROMPT_STORAGE_KEY = "@quitify/pending-signup-push-prompt";
