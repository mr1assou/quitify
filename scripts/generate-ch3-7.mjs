import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRANS = path.join(__dirname, "translations");

function translateValue(en, lang) {
  const dict = DICT[en];
  if (dict && dict[lang]) return dict[lang];
  throw new Error(`Missing ${lang} translation for: ${en.slice(0, 80)}...`);
}

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

function buildChapter(chNum, lang) {
  const en = JSON.parse(fs.readFileSync(path.join(TRANS, `en-ch${chNum}.json`), "utf8"));
  const out = {};
  for (const [key, value] of Object.entries(en)) {
    out[key] = sanitize(translateValue(value, lang));
  }
  fs.writeFileSync(path.join(TRANS, lang, `ch${chNum}.json`), JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${lang}/ch${chNum}.json (${Object.keys(out).length} keys)`);
}

for (const ch of [3, 4, 5, 6, 7]) {
  for (const lang of ["es", "pt"]) {
    buildChapter(ch, lang);
  }
}

const DICT = JSON.parse(fs.readFileSync(path.join(__dirname, "translation-dict-ch3-7.json"), "utf8"));
