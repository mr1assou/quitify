import { router as expoRouter, type Href } from "expo-router";

/** Blocks duplicate navigations to the same destination within a short window. */
const NAV_LOCK_MS = 400;

let lastNavKey: string | null = null;
let lastNavAt = 0;

function hrefKey(href: Href): string {
  if (typeof href === "string") return href;
  if ("pathname" in href) {
    const params = "params" in href && href.params ? JSON.stringify(href.params) : "";
    return `${href.pathname}${params}`;
  }
  return JSON.stringify(href);
}

function withNavLock(key: string, action: () => void) {
  const now = Date.now();
  if (key === lastNavKey && now - lastNavAt < NAV_LOCK_MS) return;

  lastNavKey = key;
  lastNavAt = now;
  action();
}

/** Router wrappers that ignore duplicate navigation within a short window. */
export const safeRouter = {
  /** Uses navigate so top-level screens are not stacked twice. */
  push: (href: Href) => withNavLock(`navigate:${hrefKey(href)}`, () => expoRouter.navigate(href)),

  /** Pushes onto the current stack (use for drill-down flows). */
  pushStack: (href: Href) => withNavLock(`push:${hrefKey(href)}`, () => expoRouter.push(href)),

  replace: (href: Href) => withNavLock(`replace:${hrefKey(href)}`, () => expoRouter.replace(href)),

  back: () => withNavLock("back", () => expoRouter.back()),

  /** Go back when possible; otherwise replace with a safe fallback route. */
  backOr: (fallback: Href = "/chats") =>
    withNavLock("back-or", () => {
      if (expoRouter.canGoBack()) {
        expoRouter.back();
      } else {
        expoRouter.replace(fallback);
      }
    }),
};
