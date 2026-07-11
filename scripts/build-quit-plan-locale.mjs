import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "i18n", "content", "quit-plan");
const EN_PATH = path.join(ROOT, "en.json");
const TRANS_DIR = path.join(__dirname, "translations");

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

function setByPath(obj, pathStr, value) {
  const parts = [];
  let current = "";
  for (let i = 0; i < pathStr.length; i++) {
    const ch = pathStr[i];
    if (ch === ".") {
      if (current) parts.push(current);
      current = "";
    } else if (ch === "[") {
      if (current) parts.push(current);
      current = "";
      const end = pathStr.indexOf("]", i);
      parts.push(Number(pathStr.slice(i + 1, end)));
      i = end;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  let node = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function buildLocale(locale) {
  const en = loadJson(EN_PATH);
  const output = JSON.parse(JSON.stringify(en));

  const top = loadJson(path.join(TRANS_DIR, locale, "top.json"));
  for (const [p, v] of Object.entries(top)) {
    setByPath(output, p, sanitize(v));
  }

  for (const chapter of en.chapters) {
    const chFile = path.join(TRANS_DIR, locale, `ch${chapter.chapter}.json`);
    if (!fs.existsSync(chFile)) {
      throw new Error(`Missing ${chFile}`);
    }
    const map = loadJson(chFile);
    const index = chapter.chapter - 1;
    for (const [relPath, value] of Object.entries(map)) {
      setByPath(output, `chapters[${index}].${relPath}`, sanitize(value));
    }
  }

  const outPath = path.join(ROOT, `${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`Built ${outPath}`);
}

const locale = process.argv[2];
if (!locale || !["es", "pt"].includes(locale)) {
  console.error("Usage: node build-quit-plan-locale.mjs <es|pt>");
  process.exit(1);
}

buildLocale(locale);
