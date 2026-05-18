/**
 * Single barrel for shared domain & UI types.
 *
 * Anything UI-component-internal (e.g. props) stays colocated; reusable
 * shapes that flow across context, hooks, utils, and components live here.
 */

export type * from "./account";
export type * from "./app";
export type * from "./badge";
export type * from "./craving";
export type * from "./dailyFocus";
export type * from "./intro";
export type * from "./mission";
export type * from "./onboarding";
export type * from "./profile";
export type * from "./progress";
export type * from "./recovery";
export type * from "./stats";
export type * from "./statsDashboard";
export type * from "./theme";
export type * from "./ui";
