import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replacements = [
  ["@/utils/authStorage", "@/utils/auth/authStorage"],
  ["@/utils/sessionStorage", "@/utils/auth/sessionStorage"],
  ["@/utils/leaderboardCache", "@/utils/leaderboard/leaderboardCache"],
  ["@/constants/cravingTools", "@/constants/craving/cravingTools"],
  ["@/constants/cravingSession", "@/constants/craving/cravingSession"],
  ["@/constants/cravingTips", "@/constants/craving/cravingTips"],
  ["@/constants/cravingMotivation", "@/constants/craving/cravingMotivation"],
  ['from "./useStats"', 'from "@/hooks/stats/useStats"'],
  ['from "../dates"', 'from "@/utils/shared/dates"'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
  let content = fs.readFileSync(file, "utf8");
  let updated = content;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  if (updated !== content) fs.writeFileSync(file, updated);
}

console.log("Remaining import paths fixed.");
