import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsPath = path.join(__dirname, "tip-card-ids.json");
const quotesDir = path.join(__dirname, "quotes-tips");
const outPath = path.join(__dirname, "../constants/craving/tipCards.ts");

const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

const CATEGORY_FILES = {
  "Beat the Craving": "beat-the-craving.json",
  "Breathe & Calm": "breathe-calm.json",
  "Move Your Body": "move-your-body.json",
  "Hands & Mouth": "hands-mouth.json",
  "Change the Scene": "change-the-scene.json",
  "Know Your Triggers": "know-your-triggers.json",
  "Stress & Emotions": "stress-emotions.json",
  "Morning Routines": "morning-routines.json",
  "Evening & Wind Down": "evening-wind-down.json",
  "Social Situations": "social-situations.json",
  "Work & Breaks": "work-breaks.json",
  "Withdrawal Help": "withdrawal-help.json",
  "Habit Replacement": "habit-replacement.json",
  "Sleep & Energy": "sleep-energy.json",
  "Stay on Track": "stay-on-track.json",
};

function loadQuotes(category) {
  const fileName = CATEGORY_FILES[category];
  if (!fileName) throw new Error(`Unknown category: ${category}`);
  const file = path.join(quotesDir, fileName);
  const quotes = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(quotes)) {
    throw new Error(`${category}.json must be an array`);
  }
  return quotes;
}

function escapeText(text) {
  if (text.includes("--")) {
    throw new Error(`Hyphen pair found in quote: ${text.slice(0, 80)}`);
  }
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const byCategory = {};
for (const card of cards) {
  if (!byCategory[card.category]) byCategory[card.category] = [];
  byCategory[card.category].push(card.id);
}

const lines = [
  'import type { TipCardCategory } from "./tipCardPalettes";',
  "",
  "export type TipCard = {",
  "  id: number;",
  "  category: TipCardCategory;",
  "  text: string;",
  "};",
  "",
  "export const TIP_CARDS: readonly TipCard[] = [",
];

for (const [category, ids] of Object.entries(byCategory)) {
  const quotes = loadQuotes(category);
  if (quotes.length < ids.length) {
    throw new Error(
      `${category}: need ${ids.length} quotes, got ${quotes.length}`,
    );
  }
  ids.forEach((id, index) => {
    const text = escapeText(quotes[index]);
    lines.push("  {");
    lines.push(`    id: ${id},`);
    lines.push(`    category: "${category}",`);
    lines.push(`    text: "${text}",`);
    lines.push("  },");
  });
}

lines.push("] as const;");
lines.push("");

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${cards.length} cards to ${outPath}`);
