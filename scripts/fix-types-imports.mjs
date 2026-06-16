import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

for (const file of walk(root).filter((f) => !f.includes(`${path.sep}scripts${path.sep}`))) {
  let content = fs.readFileSync(file, "utf8");
  let updated = content;
  for (const domain of domains) {
    const doubled = `@/types/${domain}/${domain}/`;
    const single = `@/types/${domain}/`;
    updated = updated.split(doubled).join(single);
  }
  if (updated !== content) fs.writeFileSync(file, updated);
}

console.log("Fixed doubled type import paths.");
