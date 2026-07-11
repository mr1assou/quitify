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

const PT_FIXES = [
  [/\bvocê\b/gi, "tu"],
  [/\bVocê\b/g, "Tu"],
  [/\bseu\b/gi, "teu"],
  [/\bSeu\b/g, "Teu"],
  [/\bsua\b/gi, "tua"],
  [/\bSua\b/g, "Tua"],
  [/\bseus\b/gi, "teus"],
  [/\bsuas\b/gi, "tuas"],
  [/\bcelular\b/gi, "telemóvel"],
  [/\bcontato\b/gi, "contacto"],
  [/\baplicativo\b/gi, "aplicação"],
  [/\bônibus\b/gi, "autocarro"],
  [/\btrem\b/gi, "comboio"],
  [/\badesivo\b/gi, "penso"],
  [/\badesivos\b/gi, "pensos"],
  [/\bgoma de mascar\b/gi, "pastilha elástica"],
  [/\bchiclete\b/gi, "pastilha elástica"],
];

function postPt(text) {
  let out = sanitize(text);
  for (const [a, b] of PT_FIXES) out = out.replace(a, b);
  return sanitize(out);
}

async function translateOne(text, lang) {
  const langpair = lang === "es" ? "en|es" : "en|pt-PT";
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=" +
    langpair;
  for (let i = 0; i < 8; i++) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const raw = data.responseData.translatedText;
      return lang === "pt" ? postPt(raw) : sanitize(raw);
    }
    await new Promise((r) => setTimeout(r, 8000 * (i + 1)));
  }
  throw new Error("Failed: " + text.slice(0, 60));
}

async function translateChapter(ch, lang) {
  const outPath = path.join(TRANS, lang, `ch${ch}.json`);
  if (fs.existsSync(outPath)) {
    console.log("skip existing", outPath);
    return;
  }
  const en = JSON.parse(fs.readFileSync(path.join(TRANS, `en-ch${ch}.json`), "utf8"));
  const cachePath = path.join(TRANS, `.cache-ch${ch}-${lang}.json`);
  const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, "utf8")) : {};
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(en)) {
    if (cache[k]) {
      out[k] = cache[k];
      n++;
      continue;
    }
    out[k] = await translateOne(v, lang);
    cache[k] = out[k];
    n++;
    if (n % 3 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      process.stdout.write(`\r${lang} ch${ch}: ${n}/${Object.keys(en).length}`);
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nWrote ${outPath}`);
}

const ch = Number(process.argv[2]);
const lang = process.argv[3];
if (!ch || !lang) {
  console.error("Usage: node translate-chapter.mjs <ch> <es|pt>");
  process.exit(1);
}
translateChapter(ch, lang).catch((e) => {
  console.error(e);
  process.exit(1);
});
