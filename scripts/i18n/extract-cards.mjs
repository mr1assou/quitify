/**
 * Extracts tip & motivation card text/category from TS sources into JSON overlays.
 * Run: node scripts/i18n/extract-cards.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "i18n/content/cards");

const SOURCES = {
  tips: [
    "constants/craving/tipCards.ts",
    "constants/craving/newTipCards.ts",
    "constants/craving/peppermintTipCards.ts",
  ],
  motivation: [
    "constants/craving/motivationalCards.ts",
    "constants/craving/newMotivationalCards.ts",
  ],
};

function extractCards(filePath) {
  const src = fs.readFileSync(path.join(root, filePath), "utf8");
  const cards = [];
  const blockRe =
    /\{\s*id:\s*(\d+),\s*category:\s*"([^"]+)"(?:,\s*tone:\s*"[^"]+")?,\s*text:\s*"((?:\\.|[^"\\])*)"/gs;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const text = m[3].replace(/\\"/g, '"').replace(/\\n/g, "\n");
    cards.push({ id: Number(m[1]), category: m[2], text });
  }
  return cards;
}

function buildOverlay(cards) {
  const texts = {};
  const categories = {};
  for (const card of cards) {
    texts[String(card.id)] = card.text;
    categories[card.category] = card.category;
  }
  return { texts, categories };
}

fs.mkdirSync(outDir, { recursive: true });

for (const [kind, files] of Object.entries(SOURCES)) {
  const all = files.flatMap((f) => extractCards(f));
  all.sort((a, b) => a.id - b.id);
  const overlay = buildOverlay(all);
  const outPath = path.join(outDir, `${kind}-en.json`);
  fs.writeFileSync(outPath, JSON.stringify(overlay, null, 2), "utf8");
  console.log(`${kind}: ${all.length} cards -> ${path.relative(root, outPath)}`);
}
