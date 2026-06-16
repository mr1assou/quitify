import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const duplicateSegments = [
  ["utils/community/community", "utils/community"],
  ["utils/progress/progress", "utils/progress"],
  ["utils/leaderboard/leaderboard", "utils/leaderboard"],
  ["utils/auth/auth", "utils/auth"],
  ["utils/onboarding/onboarding", "utils/onboarding"],
  ["utils/shared/shared", "utils/shared"],
  ["hooks/stats/stats", "hooks/stats"],
  ["hooks/progress/progress", "hooks/progress"],
  ["hooks/community/community", "hooks/community"],
  ["constants/craving/craving", "constants/craving"],
  ["constants/progress/progress", "constants/progress"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function fixContent(content) {
  let next = content;
  let changed = true;
  while (changed) {
    changed = false;
    for (const [from, to] of duplicateSegments) {
      if (next.includes(from)) {
        next = next.split(from).join(to);
        changed = true;
      }
    }
  }
  return next;
}

for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
  const content = fs.readFileSync(file, "utf8");
  const updated = fixContent(content);
  if (updated !== content) fs.writeFileSync(file, updated);
}

console.log("Import paths deduplicated.");
