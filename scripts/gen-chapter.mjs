import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS = path.join(__dirname, "translations");

function sanitize(text) {
  return text
    .replace(/\s*—\s*/g, ". ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/\s*--\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const ch = Number(process.argv[2]);
if (!ch) {
  console.error("Usage: node gen-chapter.mjs <3|4|5|6>");
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(path.join(__dirname, `map-ch${ch}.json`), "utf8"));
const en = JSON.parse(fs.readFileSync(path.join(TRANS, `en-ch${ch}.json`), "utf8"));

for (const lang of ["es", "pt"]) {
  const out = {};
  for (const [k, v] of Object.entries(en)) {
    const pair = map[k];
    if (!pair) throw new Error(`Missing ${k}`);
    out[k] = sanitize(pair[lang]);
  }
  fs.writeFileSync(path.join(TRANS, lang, `ch${ch}.json`), JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${lang}/ch${ch}.json`);
}
