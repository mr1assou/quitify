import { router as expoRouter, type Href } from "expo-router";

/** Blocks overlapping navigations from rapid double-taps. */
const NAV_LOCK_MS = 1000;

let locked = false;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

function withNavLock(action: () => void) {
  if (locked) return;
  locked = true;
  if (unlockTimer) clearTimeout(unlockTimer);
  action();
  unlockTimer = setTimeout(() => {
    locked = false;
    unlockTimer = null;
  }, NAV_LOCK_MS);
}

/** Router wrappers that ignore duplicate navigation within a short window. */
export const safeRouter = {
  /** Uses navigate (not push) so the same screen is not stacked twice. */
  push: (href: Href) => withNavLock(() => expoRouter.navigate(href)),
  replace: (href: Href) => withNavLock(() => expoRouter.replace(href)),
  back: () => withNavLock(() => expoRouter.back()),
};
