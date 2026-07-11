/**
 * Copies English quit plan into i18n content folder.
 * Run: node scripts/i18n/copy-quit-plan-en.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = path.join(root, "constants/progress/quit-plan.json");
const destDir = path.join(root, "i18n/content/quit-plan");
const dest = path.join(destDir, "en.json");

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log("Copied quit plan ->", path.relative(root, dest));
