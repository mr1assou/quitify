import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "../constants/craving/motivationalCards.ts");
const out = path.join(__dirname, "card-ids.json");

const text = fs.readFileSync(src, "utf8");
const re =
  /id:\s*(\d+),\s*\n\s*category:\s*"([^"]+)",\s*\n\s*text:\s*"((?:[^"\\]|\\.)*)"/g;
const cards = [];
let m;
while ((m = re.exec(text))) {
  cards.push({ id: +m[1], category: m[2] });
}

fs.writeFileSync(out, JSON.stringify(cards, null, 2), "utf8");
const byCat = {};
for (const c of cards) {
  if (!byCat[c.category]) byCat[c.category] = [];
  byCat[c.category].push(c.id);
}
console.log("total", cards.length);
for (const [k, v] of Object.entries(byCat)) {
  console.log(k, v.length);
}
