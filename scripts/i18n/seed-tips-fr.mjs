import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);

const en = require(path.join(root, "i18n/content/cards/tips-en.json"));
const additions = require(path.join(__dirname, "tips-fr-additions.json"));

const CATEGORIES = {
  "Beat the Craving": "Vaincre l'envie",
  "Breathe & Calm": "Respirer et se calmer",
  "Move Your Body": "Bouger le corps",
  "Hands & Mouth": "Mains et bouche",
  "Change the Scene": "Changer de décor",
  "Know Your Triggers": "Connaître vos déclencheurs",
  "Stress & Emotions": "Stress et émotions",
  "Morning Routines": "Routines du matin",
  "Evening & Wind Down": "Soirée et détente",
  "Social Situations": "Situations sociales",
  "Work & Breaks": "Travail et pauses",
  "Withdrawal Help": "Aide au sevrage",
  "Habit Replacement": "Remplacer l'habitude",
  "Sleep & Energy": "Sommeil et énergie",
  "Stay on Track": "Rester sur la bonne voie",
  "Tracking & Tools": "Suivi et outils",
  "Relapse Recovery": "Reprise après rechute",
  "Travel & Disruption": "Voyage et perturbations",
  "Talking to Others": "Parler aux autres",
  "Vaping & Alternatives": "Vapotage et alternatives",
};

function sanitize(text) {
  return String(text)
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, ", ")
    .replace(/--/g, ", ")
    .replace(/,\s*,/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

const texts = {};
for (const [key, value] of Object.entries(additions)) {
  texts[key] = sanitize(value);
}

const categories = {};
for (const key of Object.keys(en.categories)) {
  categories[key] = CATEGORIES[key] ?? key;
}

const outPath = path.join(root, "i18n/content/cards/tips-fr.json");
fs.writeFileSync(outPath, JSON.stringify({ texts, categories }, null, 2) + "\n");
console.log("Seeded", Object.keys(texts).length, "French tip texts");
