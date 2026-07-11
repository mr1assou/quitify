import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);

const enPath = path.join(root, "i18n/content/cards/tips-en.json");
const frPath = path.join(root, "i18n/content/cards/tips-fr.json");
const additionsPath = path.join(__dirname, "tips-fr-additions.json");

const en = require(enPath);
const fr = require(frPath);
let additions = {};
if (fs.existsSync(additionsPath)) {
  additions = JSON.parse(fs.readFileSync(additionsPath, "utf8"));
}

function sanitize(text) {
  if (!text) return text;
  return text
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, ", ")
    .replace(/--/g, ", ")
    .replace(/,\s*,/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

const texts = {};
for (let i = 1; i <= 1510; i++) {
  const key = String(i);
  const source = additions[key] ?? fr.texts[key];
  if (!source) {
    throw new Error(`Missing French text for id ${key}`);
  }
  texts[key] = sanitize(source);
}

const out = {
  texts,
  categories: fr.categories ?? en.categories,
};

fs.writeFileSync(frPath, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("Wrote", Object.keys(texts).length, "texts");
