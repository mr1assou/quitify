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

/** Router wrappers that ignore duplicate push/replace/back within a short window. */
export const safeRouter = {
  push: (href: Href) => withNavLock(() => expoRouter.push(href)),
  replace: (href: Href) => withNavLock(() => expoRouter.replace(href)),
  back: () => withNavLock(() => expoRouter.back()),
};
