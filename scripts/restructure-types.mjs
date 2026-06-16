import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const moves = {
  "types/account.ts": "types/app/account.ts",
  "types/app.ts": "types/app/app.ts",
  "types/country.ts": "types/app/country.ts",
  "types/intro.ts": "types/app/intro.ts",
  "types/theme.ts": "types/app/theme.ts",
  "types/chat.ts": "types/chat/chat.ts",
  "types/chatApi.ts": "types/chat/chatApi.ts",
  "types/community.ts": "types/community/community.ts",
  "types/communityFeedFilter.ts": "types/community/communityFeedFilter.ts",
  "types/postsApi.ts": "types/community/postsApi.ts",
  "types/updatePost.ts": "types/community/updatePost.ts",
  "types/craving.ts": "types/craving/craving.ts",
  "types/leaderboard.ts": "types/leaderboard/leaderboard.ts",
  "types/leaderboardApi.ts": "types/leaderboard/leaderboardApi.ts",
  "types/onboarding.ts": "types/onboarding/onboarding.ts",
  "types/onboardingPayload.ts": "types/onboarding/onboardingPayload.ts",
  "types/playerProfile.ts": "types/profile/playerProfile.ts",
  "types/profile.ts": "types/profile/profile.ts",
  "types/profileActivity.ts": "types/profile/profileActivity.ts",
  "types/profileStreak.ts": "types/profile/profileStreak.ts",
  "types/userProfileApi.ts": "types/profile/userProfileApi.ts",
  "types/badge.ts": "types/progress/badge.ts",
  "types/dailyFocus.ts": "types/progress/dailyFocus.ts",
  "types/mission.ts": "types/progress/mission.ts",
  "types/progress.ts": "types/progress/progress.ts",
  "types/recovery.ts": "types/progress/recovery.ts",
  "types/slip.ts": "types/stats/slip.ts",
  "types/slipFlow.ts": "types/stats/slipFlow.ts",
  "types/stats.ts": "types/stats/stats.ts",
  "types/statsAttempts.ts": "types/stats/statsAttempts.ts",
  "types/statsDashboard.ts": "types/stats/statsDashboard.ts",
  "types/statsOverview.ts": "types/stats/statsOverview.ts",
  "types/userStats.ts": "types/stats/userStats.ts",
  "types/ui.ts": "types/shared/ui.ts",
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function moveFile(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) {
    if (fs.existsSync(to)) return;
    throw new Error(`Missing source file: ${fromRel}`);
  }
  ensureDir(to);
  fs.renameSync(from, to);
}

function buildReplacements() {
  const replacements = [];
  for (const [from, to] of Object.entries(moves)) {
    const fromNoExt = from.replace(/\.ts$/, "");
    const toNoExt = to.replace(/\.ts$/, "");
    replacements.push([`@/${fromNoExt}`, `@/${toNoExt}`]);
  }
  replacements.sort((a, b) => b[0].length - a[0].length);
  return replacements;
}

function createDomainBarrels(baseDir) {
  if (!fs.existsSync(baseDir)) return;
  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const domainDir = path.join(baseDir, entry.name);
    const files = fs
      .readdirSync(domainDir)
      .filter((f) => f.endsWith(".ts") && f !== "index.ts")
      .map((f) => f.replace(/\.ts$/, ""))
      .sort();
    if (files.length === 0) continue;
    const lines = files.map((f) => `export type * from "./${f}";`).join("\n");
    fs.writeFileSync(path.join(domainDir, "index.ts"), `${lines}\n`);
  }
}

for (const [from, to] of Object.entries(moves)) {
  moveFile(from, to);
}

const replacements = buildReplacements();
for (const file of walk(root).filter((f) => !f.includes(`${path.sep}scripts${path.sep}`))) {
  const content = fs.readFileSync(file, "utf8");
  const updated = replacements.reduce((next, [from, to]) => next.split(from).join(to), content);
  if (updated !== content) fs.writeFileSync(file, updated);
}

createDomainBarrels(path.join(root, "types"));

const domains = [
  "app",
  "chat",
  "community",
  "craving",
  "leaderboard",
  "onboarding",
  "profile",
  "progress",
  "shared",
  "stats",
];
for (const file of walk(root).filter((f) => !f.includes(`${path.sep}scripts${path.sep}`))) {
  let content = fs.readFileSync(file, "utf8");
  let updated = content;
  for (const domain of domains) {
    updated = updated.split(`@/types/${domain}/${domain}/`).join(`@/types/${domain}/`);
  }
  if (updated !== content) fs.writeFileSync(file, updated);
}

const rootBarrel = `/**
 * Single barrel for shared domain & UI types.
 *
 * Anything UI-component-internal (e.g. props) stays colocated; reusable
 * shapes that flow across context, hooks, utils, and components live here.
 */

export type * from "./app";
export type * from "./chat";
export type * from "./community";
export type * from "./craving";
export type * from "./leaderboard";
export type * from "./onboarding";
export type * from "./profile";
export type * from "./progress";
export type * from "./shared";
export type * from "./stats";
`;

fs.writeFileSync(path.join(root, "types", "index.ts"), rootBarrel);

console.log("Types restructure complete.");
