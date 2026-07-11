import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "i18n", "content", "quit-plan");
const EN_PATH = path.join(ROOT, "en.json");
const DELIM = " §§§ ";

const SKIP_KEYS = new Set(["id", "type", "day", "chapter", "day_start", "day_end", "total_days"]);
const SKIP_VALUES = new Set([
  "Quitify",
  "action",
  "fact",
  "journal",
  "breathing",
  "checkin",
  "game",
  "audio",
  "social",
  "reward",
  "nrt",
  "mindset",
]);

const PT_PT_FIXES = [
  [/\bvocê\b/gi, "tu"],
  [/\bVocê\b/g, "Tu"],
  [/\bseu\b/gi, "teu"],
  [/\bSeu\b/g, "Teu"],
  [/\bsua\b/gi, "tua"],
  [/\bSua\b/g, "Tua"],
  [/\bseus\b/gi, "teus"],
  [/\bSeus\b/g, "Teus"],
  [/\bsuas\b/gi, "tuas"],
  [/\bSuas\b/g, "Tuas"],
  [/\bcelular\b/gi, "telemóvel"],
  [/\bcelulares\b/gi, "telemóveis"],
  [/\bônibus\b/gi, "autocarro"],
  [/\bonibus\b/gi, "autocarro"],
  [/\bbanheiro\b/gi, "casa de banho"],
  [/\bmetrô\b/gi, "metro"],
  [/\btrem\b/gi, "comboio"],
  [/\btrens\b/gi, "comboios"],
  [/\bcontato\b/gi, "contacto"],
  [/\bcontatos\b/gi, "contactos"],
  [/\baplicativo\b/gi, "aplicação"],
  [/\baplicativos\b/gi, "aplicações"],
  [/\bgoma de mascar\b/gi, "pastilha elástica"],
  [/\bchiclete\b/gi, "pastilha elástica"],
  [/\badesivo\b/gi, "penso"],
  [/\badesivos\b/gi, "pensos"],
  [/\bcurativo\b/gi, "penso"],
  [/\bcurativos\b/gi, "pensos"],
  [/\bdesistiu\b/gi, "deixaste de fumar"],
  [/\bdesistir\b/gi, "deixar de fumar"],
  [/\bdesista\b/gi, "deixes de fumar"],
  [/\bRenuncias\b/g, "Deixas de fumar"],
  [/\brenuncias\b/g, "deixas de fumar"],
];

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

function collectStrings(obj, prefix = "", out = []) {
  if (typeof obj === "string") {
    out.push({ path: prefix, value: obj });
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectStrings(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string" && (SKIP_KEYS.has(key) || SKIP_VALUES.has(value))) {
        continue;
      }
      collectStrings(value, next, out);
    }
  }
  return out;
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function postProcess(text, targetLang) {
  let out = sanitize(text);
  if (targetLang === "pt") {
    for (const [pattern, replacement] of PT_PT_FIXES) {
      out = out.replace(pattern, replacement);
    }
    out = sanitize(out);
  }
  return out;
}

async function translateOne(text, targetLang) {
  const langpair = targetLang === "es" ? "en|es" : "en|pt-PT";
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=" +
    langpair;

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return postProcess(data.responseData.translatedText, targetLang);
    }
    if (data.responseStatus === 429 || data.quotaFinished) {
      await sleep(10000 * (attempt + 1));
      continue;
    }
    throw new Error(`MyMemory failed: ${JSON.stringify(data).slice(0, 300)}`);
  }
  throw new Error("MyMemory failed after retries");
}

async function translateFile(targetLang) {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const strings = collectStrings(en);
  const cachePath = path.join(ROOT, `.cache-${targetLang}.json`);
  const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : {};

  const output = JSON.parse(JSON.stringify(en));
  let done = 0;

  for (const { path: p, value } of strings) {
    if (cache[p]) {
      setByPath(output, p, cache[p]);
      done++;
      continue;
    }

    const translated = await translateOne(value, targetLang);
    cache[p] = translated;
    setByPath(output, p, translated);
    done++;

    if (done % 5 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      fs.writeFileSync(path.join(ROOT, `${targetLang}.json`), JSON.stringify(output, null, 2) + "\n");
      process.stdout.write(`\r${targetLang}: ${done}/${strings.length}`);
    }

    await sleep(500);
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  fs.writeFileSync(path.join(ROOT, `${targetLang}.json`), JSON.stringify(output, null, 2) + "\n");
  console.log(`\nWrote ${path.join(ROOT, `${targetLang}.json`)} (${strings.length} strings)`);
}

const lang = process.argv[2];
if (!lang || !["es", "pt"].includes(lang)) {
  console.error("Usage: node translate-quit-plan.mjs <es|pt>");
  process.exit(1);
}

translateFile(lang).catch((err) => {
  console.error(err);
  process.exit(1);
});
