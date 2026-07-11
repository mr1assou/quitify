/**
 * Deep-translate a card or quit-plan overlay JSON from English to target locale.
 * Uses chunked output files merged by merge-translations.mjs
 *
 * Run: node scripts/i18n/translate-overlay.mjs fr tips
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , locale, kind] = process.argv;
if (!locale || !kind) {
  console.error("Usage: node translate-overlay.mjs <locale> <tips|motivation>");
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const enPath = path.join(root, "i18n/content/cards", `${kind}-en.json`);
const outPath = path.join(root, "i18n/content/cards", `${kind}-${locale}.json`);

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

/** @type {Record<string, Record<string, string>>} */
const CATEGORY_TRANSLATIONS = {
  fr: {
    tips: {
      "Beat the Craving": "Vaincre l'envie",
      "Breathe & Calm": "Respirer et se calmer",
      "Move Your Body": "Bouger le corps",
      "Hands & Mouth": "Mains et bouche",
      "Change the Scene": "Changer de décor",
      "Know Your Triggers": "Connaître vos déclencheurs",
      "Mindset & Identity": "État d'esprit et identité",
      "Social Situations": "Situations sociales",
      "Sleep & Rest": "Sommeil et repos",
      "Food & Drink": "Nourriture et boisson",
      "Stress & Anxiety": "Stress et anxiété",
      "Celebrate Progress": "Célébrer les progrès",
      "Science & Facts": "Science et faits",
      "Money & Savings": "Argent et économies",
      "Family & Loved Ones": "Famille et proches",
      "Health Wins": "Victoires santé",
      "Morning Rituals": "Rituels du matin",
      "Evening Wind-Down": "Détente du soir",
      "Work & Focus": "Travail et concentration",
      "Long-Term Vision": "Vision à long terme",
    },
    motivation: {
      "Health & Body": "Santé et corps",
      "Freedom & Control": "Liberté et contrôle",
      "Money & Savings": "Argent et économies",
      "Family & Loved Ones": "Famille et proches",
      "Identity & Pride": "Identité et fierté",
      "Cravings & Urges": "Envies et pulsions",
      "Stress & Calm": "Stress et calme",
      "One Day at a Time": "Un jour à la fois",
      "Science & Healing": "Science et guérison",
      "Social & Connection": "Social et lien",
      "Morning Energy": "Énergie du matin",
      "Night & Rest": "Nuit et repos",
      "Work & Focus": "Travail et concentration",
      "Triggers & Habits": "Déclencheurs et habitudes",
      "Celebration & Joy": "Célébration et joie",
      "Future Self": "Futur vous",
      "Community & Support": "Communauté et soutien",
      "Mindfulness": "Pleine conscience",
      "Resilience": "Résilience",
      "Purpose & Meaning": "Sens et purpose",
      "Small Wins": "Petites victoires",
    },
  },
  de: {
    tips: {
      "Beat the Craving": "Verlangen besiegen",
      "Breathe & Calm": "Atmen und beruhigen",
      "Move Your Body": "Beweg dich",
      "Hands & Mouth": "Hände und Mund",
      "Change the Scene": "Szene wechseln",
      "Know Your Triggers": "Auslöser kennen",
      "Mindset & Identity": "Mindset und Identität",
      "Social Situations": "Soziale Situationen",
      "Sleep & Rest": "Schlaf und Ruhe",
      "Food & Drink": "Essen und Trinken",
      "Stress & Anxiety": "Stress und Angst",
      "Celebrate Progress": "Fortschritt feiern",
      "Science & Facts": "Wissenschaft und Fakten",
      "Money & Savings": "Geld und Ersparnis",
      "Family & Loved Ones": "Familie und Liebste",
      "Health Wins": "Gesundheitserfolge",
      "Morning Rituals": "Morgenrituale",
      "Evening Wind-Down": "Abendentspannung",
      "Work & Focus": "Arbeit und Fokus",
      "Long-Term Vision": "Langfristige Vision",
    },
    motivation: {
      "Health & Body": "Gesundheit und Körper",
      "Freedom & Control": "Freiheit und Kontrolle",
      "Money & Savings": "Geld und Ersparnis",
      "Family & Loved Ones": "Familie und Liebste",
      "Identity & Pride": "Identität und Stolz",
      "Cravings & Urges": "Verlangen und Drang",
      "Stress & Calm": "Stress und Ruhe",
      "One Day at a Time": "Einen Tag nach dem anderen",
      "Science & Healing": "Wissenschaft und Heilung",
      "Social & Connection": "Soziales und Verbindung",
      "Morning Energy": "Morgenenergie",
      "Night & Rest": "Nacht und Ruhe",
      "Work & Focus": "Arbeit und Fokus",
      "Triggers & Habits": "Auslöser und Gewohnheiten",
      "Celebration & Joy": "Feier und Freude",
      "Future Self": "Zukünftiges Ich",
      "Community & Support": "Community und Support",
      "Mindfulness": "Achtsamkeit",
      "Resilience": "Widerstandskraft",
      "Purpose & Meaning": "Sinn und Bedeutung",
      "Small Wins": "Kleine Erfolge",
    },
  },
  es: {
    tips: {
      "Beat the Craving": "Vence el antojo",
      "Breathe & Calm": "Respira y cálmate",
      "Move Your Body": "Mueve el cuerpo",
      "Hands & Mouth": "Manos y boca",
      "Change the Scene": "Cambia de escenario",
      "Know Your Triggers": "Conoce tus detonantes",
      "Mindset & Identity": "Mentalidad e identidad",
      "Social Situations": "Situaciones sociales",
      "Sleep & Rest": "Sueño y descanso",
      "Food & Drink": "Comida y bebida",
      "Stress & Anxiety": "Estrés y ansiedad",
      "Celebrate Progress": "Celebra el progreso",
      "Science & Facts": "Ciencia y datos",
      "Money & Savings": "Dinero y ahorro",
      "Family & Loved Ones": "Familia y seres queridos",
      "Health Wins": "Logros de salud",
      "Morning Rituals": "Rituales matutinos",
      "Evening Wind-Down": "Relajación nocturna",
      "Work & Focus": "Trabajo y enfoque",
      "Long-Term Vision": "Visión a largo plazo",
    },
    motivation: {
      "Health & Body": "Salud y cuerpo",
      "Freedom & Control": "Libertad y control",
      "Money & Savings": "Dinero y ahorro",
      "Family & Loved Ones": "Familia y seres queridos",
      "Identity & Pride": "Identidad y orgullo",
      "Cravings & Urges": "Antojos e impulsos",
      "Stress & Calm": "Estrés y calma",
      "One Day at a Time": "Un día a la vez",
      "Science & Healing": "Ciencia y sanación",
      "Social & Connection": "Social y conexión",
      "Morning Energy": "Energía matutina",
      "Night & Rest": "Noche y descanso",
      "Work & Focus": "Trabajo y enfoque",
      "Triggers & Habits": "Detonantes y hábitos",
      "Celebration & Joy": "Celebración y alegría",
      "Future Self": "Tu yo futuro",
      "Community & Support": "Comunidad y apoyo",
      "Mindfulness": "Atención plena",
      "Resilience": "Resiliencia",
      "Purpose & Meaning": "Propósito y sentido",
      "Small Wins": "Pequeñas victorias",
    },
  },
  pt: {
    tips: {
      "Beat the Craving": "Vencer a vontade",
      "Breathe & Calm": "Respirar e acalmar",
      "Move Your Body": "Mover o corpo",
      "Hands & Mouth": "Mãos e boca",
      "Change the Scene": "Mudar de cenário",
      "Know Your Triggers": "Conhecer os gatilhos",
      "Mindset & Identity": "Mentalidade e identidade",
      "Social Situations": "Situações sociais",
      "Sleep & Rest": "Sono e descanso",
      "Food & Drink": "Comida e bebida",
      "Stress & Anxiety": "Stress e ansiedade",
      "Celebrate Progress": "Celebrar o progresso",
      "Science & Facts": "Ciência e factos",
      "Money & Savings": "Dinheiro e poupança",
      "Family & Loved Ones": "Família e entes queridos",
      "Health Wins": "Vitórias de saúde",
      "Morning Rituals": "Rituais matinais",
      "Evening Wind-Down": "Relaxamento noturno",
      "Work & Focus": "Trabalho e foco",
      "Long-Term Vision": "Visão a longo prazo",
    },
    motivation: {
      "Health & Body": "Saúde e corpo",
      "Freedom & Control": "Liberdade e controlo",
      "Money & Savings": "Dinheiro e poupança",
      "Family & Loved Ones": "Família e entes queridos",
      "Identity & Pride": "Identidade e orgulho",
      "Cravings & Urges": "Vontades e impulsos",
      "Stress & Calm": "Stress e calma",
      "One Day at a Time": "Um dia de cada vez",
      "Science & Healing": "Ciência e recuperação",
      "Social & Connection": "Social e ligação",
      "Morning Energy": "Energia matinal",
      "Night & Rest": "Noite e descanso",
      "Work & Focus": "Trabalho e foco",
      "Triggers & Habits": "Gatilhos e hábitos",
      "Celebration & Joy": "Celebração e alegria",
      "Future Self": "Eu futuro",
      "Community & Support": "Comunidade e apoio",
      "Mindfulness": "Mindfulness",
      "Resilience": "Resiliência",
      "Purpose & Meaning": "Propósito e sentido",
      "Small Wins": "Pequenas vitórias",
    },
  },
};

function sanitizeAiPunctuation(text) {
  return text
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/\s*--\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Placeholder: copy EN texts until full translation files are merged.
// Category labels are translated immediately.
const catMap = CATEGORY_TRANSLATIONS[locale]?.[kind] ?? {};
const categories = {};
for (const [enCat, label] of Object.entries(en.categories)) {
  categories[enCat] = catMap[enCat] ?? enCat;
}

const existing = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, "utf8"))
  : null;

if (existing?.texts && Object.keys(existing.texts).length > 100) {
  console.log(`Skip ${outPath}, already has translations`);
  process.exit(0);
}

const texts = {};
for (const [id, text] of Object.entries(en.texts)) {
  texts[id] = sanitizeAiPunctuation(text);
}

fs.writeFileSync(outPath, JSON.stringify({ texts, categories }, null, 2), "utf8");
console.log(`Wrote placeholder ${path.relative(root, outPath)} (${Object.keys(texts).length} texts)`);
