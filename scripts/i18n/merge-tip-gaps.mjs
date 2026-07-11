/**
 * Merge missing tip translations from English into a locale file (fallback),
 * then list missing ids for manual/agent translation.
 * Run: node scripts/i18n/merge-tip-gaps.mjs fr
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const locale = process.argv[2];
if (!locale) {
  console.error("Usage: node merge-tip-gaps.mjs <locale>");
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const en = JSON.parse(
  fs.readFileSync(path.join(root, "i18n/content/cards/tips-en.json"), "utf8"),
);
const targetPath = path.join(root, `i18n/content/cards/tips-${locale}.json`);
const target = JSON.parse(fs.readFileSync(targetPath, "utf8"));

let added = 0;
for (const [id, text] of Object.entries(en.texts)) {
  if (!target.texts[id]) {
    target.texts[id] = text;
    added++;
  }
}

for (const [cat, label] of Object.entries(en.categories)) {
  if (!target.categories[cat]) {
    target.categories[cat] = label;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(target, null, 2), "utf8");
console.log(`Merged ${added} missing tips into tips-${locale}.json; total ${Object.keys(target.texts).length}`);
