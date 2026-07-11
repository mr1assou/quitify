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

function t(en, lang) {
  const pair = MAP[en];
  if (!pair) throw new Error(`Missing: ${en.slice(0, 100)}`);
  return sanitize(pair[lang]);
}

function build(ch) {
  const en = JSON.parse(fs.readFileSync(path.join(TRANS, `en-ch${ch}.json`), "utf8"));
  for (const lang of ["es", "pt"]) {
    const out = {};
    for (const [k, v] of Object.entries(en)) out[k] = t(v, lang);
    fs.writeFileSync(path.join(TRANS, lang, `ch${ch}.json`), JSON.stringify(out, null, 2) + "\n");
    console.log(`${lang}/ch${ch}.json`);
  }
}

for (const ch of [3, 4, 5, 6]) build(ch);

const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "map-ch3-6.json"), "utf8"));
