import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsPath = path.join(__dirname, "card-ids.json");
const quotesDir = path.join(__dirname, "quotes");
const outPath = path.join(
  __dirname,
  "../constants/craving/motivationalCards.ts",
);

const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));

const CATEGORY_FILES = {
  "Health & Body": "health-body.json",
  "Freedom & Control": "freedom-control.json",
  "Money & Savings": "money-savings.json",
  "Family & Loved Ones": "family-loved-ones.json",
  "Strength & Willpower": "strength-willpower.json",
  "Progress & Milestones": "progress-milestones.json",
  "Confidence & Self-Image": "confidence-self-image.json",
  "Future & Long-Term Life": "future-long-term.json",
  "Craving Mindset": "craving-mindset.json",
  "Quick Boosts": "quick-boosts.json",
  "Self-Care & Wellbeing": "self-care-wellbeing.json",
  "Identity & New Beginnings": "identity-new-beginnings.json",
  "Resilience & Setbacks": "resilience-setbacks.json",
  "Energy & Vitality": "energy-vitality.json",
  "Reflection & Gratitude": "reflection-gratitude.json",
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
  'import type { MotivationCardCategory } from "./motivationCardPalettes";',
  "",
  "export type MotivationCard = {",
  "  id: number;",
  "  category: MotivationCardCategory;",
  "  text: string;",
  "};",
  "",
  "export const MOTIVATIONAL_CARDS: readonly MotivationCard[] = [",
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
