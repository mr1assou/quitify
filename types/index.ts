/**
 * Single barrel for shared domain & UI types.
 *
 * Anything UI-component-internal (e.g. props) stays colocated; reusable
 * shapes that flow across context, hooks, utils, and components live here.
 */

export type * from "./app";
export type * from "./chat";
export type * from "./community";
export type * from "./craving";
export type * from "./i18n";
export type * from "./leaderboard";
export type * from "./onboarding";
export type * from "./profile";
export type * from "./progress";
export type * from "./shared";
export type * from "./stats";
