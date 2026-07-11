/**
 * Batch-translate card overlay JSON files from English (no external deps).
 * Usage: node scripts/i18n/translate-cards.mjs all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cardsDir = path.join(root, "i18n/content/cards");

const LOCALE_MAP = { es: "es", pt: "pt", fr: "fr", de: "de" };

const CATEGORY_TRANSLATIONS = {
  es: {
    tips: {
      "Beat the Craving": "Vence el antojo",
      "Breathe & Calm": "Respira y cálmate",
      "Move Your Body": "Mueve el cuerpo",
      "Hands & Mouth": "Manos y boca",
      "Change the Scene": "Cambia de escenario",
      "Know Your Triggers": "Conoce tus detonantes",
      "Stress & Emotions": "Estrés y emociones",
      "Morning Routines": "Rutinas matutinas",
      "Evening & Wind Down": "Relajación nocturna",
      "Social Situations": "Situaciones sociales",
      "Work & Breaks": "Trabajo y descansos",
      "Withdrawal Help": "Ayuda con la abstinencia",
      "Habit Replacement": "Sustituir el hábito",
      "Sleep & Energy": "Sueño y energía",
      "Stay on Track": "Mantente en el camino",
      "Tracking & Tools": "Seguimiento y herramientas",
      "Relapse Recovery": "Recuperación tras una recaída",
      "Travel & Disruption": "Viajes e imprevistos",
      "Talking to Others": "Hablar con otros",
      "Vaping & Alternatives": "Vapeo y alternativas",
    },
    motivation: {
      "Health & Body": "Salud y cuerpo",
      "Freedom & Control": "Libertad y control",
      "Money & Savings": "Dinero y ahorro",
      "Family & Loved Ones": "Familia y seres queridos",
      "Strength & Willpower": "Fuerza y voluntad",
      "Progress & Milestones": "Progreso e hitos",
      "Confidence & Self-Image": "Confianza e imagen personal",
      "Future & Long-Term Life": "Futuro y vida a largo plazo",
      "Craving Mindset": "Mentalidad ante el antojo",
      "Quick Boosts": "Impulsos rápidos",
      "Self-Care & Wellbeing": "Autocuidado y bienestar",
      "Identity & New Beginnings": "Identidad y nuevos comienzos",
      "Resilience & Setbacks": "Resiliencia y tropiezos",
      "Energy & Vitality": "Energía y vitalidad",
      "Reflection & Gratitude": "Reflexión y gratitud",
      "Anger & Frustration": "Ira y frustración",
      "Social Pressure & Temptation": "Presión social y tentación",
      "Sleep & Mornings": "Sueño y mañanas",
      "Anniversary & Big Wins": "Aniversarios y grandes logros",
      "Real Talk": "Sin rodeos",
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
      "Stress & Emotions": "Stress e emoções",
      "Morning Routines": "Rotinas matinais",
      "Evening & Wind Down": "Relaxamento noturno",
      "Social Situations": "Situações sociais",
      "Work & Breaks": "Trabalho e pausas",
      "Withdrawal Help": "Ajuda na abstinência",
      "Habit Replacement": "Substituir o hábito",
      "Sleep & Energy": "Sono e energia",
      "Stay on Track": "Manter o rumo",
      "Tracking & Tools": "Acompanhamento e ferramentas",
      "Relapse Recovery": "Recuperação após recaída",
      "Travel & Disruption": "Viagens e imprevistos",
      "Talking to Others": "Falar com outros",
      "Vaping & Alternatives": "Vape e alternativas",
    },
    motivation: {
      "Health & Body": "Saúde e corpo",
      "Freedom & Control": "Liberdade e controlo",
      "Money & Savings": "Dinheiro e poupança",
      "Family & Loved Ones": "Família e entes queridos",
      "Strength & Willpower": "Força e força de vontade",
      "Progress & Milestones": "Progresso e marcos",
      "Confidence & Self-Image": "Confiança e autoimagem",
      "Future & Long-Term Life": "Futuro e vida a longo prazo",
      "Craving Mindset": "Mentalidade perante a vontade",
      "Quick Boosts": "Impulsos rápidos",
      "Self-Care & Wellbeing": "Autocuidado e bem-estar",
      "Identity & New Beginnings": "Identidade e novos começos",
      "Resilience & Setbacks": "Resiliência e contratempos",
      "Energy & Vitality": "Energia e vitalidade",
      "Reflection & Gratitude": "Reflexão e gratidão",
      "Anger & Frustration": "Raiva e frustração",
      "Social Pressure & Temptation": "Pressão social e tentação",
      "Sleep & Mornings": "Sono e manhãs",
      "Anniversary & Big Wins": "Aniversários e grandes vitórias",
      "Real Talk": "Sem rodeios",
    },
  },
  fr: {
    tips: {
      "Beat the Craving": "Vaincre l'envie",
      "Breathe & Calm": "Respirer et se calmer",
      "Move Your Body": "Bouger le corps",
      "Hands & Mouth": "Mains et bouche",
      "Change the Scene": "Changer de décor",
      "Know Your Triggers": "Connaître vos déclencheurs",
      "Stress & Emotions": "Stress et émotions",
      "Morning Routines": "Routines du matin",
      "Evening & Wind Down": "Détente du soir",
      "Social Situations": "Situations sociales",
      "Work & Breaks": "Travail et pauses",
      "Withdrawal Help": "Aide au sevrage",
      "Habit Replacement": "Remplacer l'habitude",
      "Sleep & Energy": "Sommeil et énergie",
      "Stay on Track": "Rester sur la bonne voie",
      "Tracking & Tools": "Suivi et outils",
      "Relapse Recovery": "Reprise après une rechute",
      "Travel & Disruption": "Voyages et imprévus",
      "Talking to Others": "Parler aux autres",
      "Vaping & Alternatives": "Vapotage et alternatives",
    },
    motivation: {
      "Health & Body": "Santé et corps",
      "Freedom & Control": "Liberté et contrôle",
      "Money & Savings": "Argent et économies",
      "Family & Loved Ones": "Famille et proches",
      "Strength & Willpower": "Force et volonté",
      "Progress & Milestones": "Progrès et étapes",
      "Confidence & Self-Image": "Confiance et image de soi",
      "Future & Long-Term Life": "Avenir et vie à long terme",
      "Craving Mindset": "État d'esprit face à l'envie",
      "Quick Boosts": "Coup de pouce rapide",
      "Self-Care & Wellbeing": "Soins personnels et bien-être",
      "Identity & New Beginnings": "Identité et nouveaux départs",
      "Resilience & Setbacks": "Résilience et revers",
      "Energy & Vitality": "Énergie et vitalité",
      "Reflection & Gratitude": "Réflexion et gratitude",
      "Anger & Frustration": "Colère et frustration",
      "Social Pressure & Temptation": "Pression sociale et tentation",
      "Sleep & Mornings": "Sommeil et matins",
      "Anniversary & Big Wins": "Anniversaires et grandes victoires",
      "Real Talk": "Franchement",
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
      "Stress & Emotions": "Stress und Gefühle",
      "Morning Routines": "Morgenroutinen",
      "Evening & Wind Down": "Abendentspannung",
      "Social Situations": "Soziale Situationen",
      "Work & Breaks": "Arbeit und Pausen",
      "Withdrawal Help": "Hilfe bei Entzug",
      "Habit Replacement": "Gewohnheit ersetzen",
      "Sleep & Energy": "Schlaf und Energie",
      "Stay on Track": "Auf Kurs bleiben",
      "Tracking & Tools": "Tracking und Tools",
      "Relapse Recovery": "Erholung nach Rückfall",
      "Travel & Disruption": "Reisen und Störungen",
      "Talking to Others": "Mit anderen sprechen",
      "Vaping & Alternatives": "Dampfen und Alternativen",
    },
    motivation: {
      "Health & Body": "Gesundheit und Körper",
      "Freedom & Control": "Freiheit und Kontrolle",
      "Money & Savings": "Geld und Ersparnis",
      "Family & Loved Ones": "Familie und Liebste",
      "Strength & Willpower": "Stärke und Willenskraft",
      "Progress & Milestones": "Fortschritt und Meilensteine",
      "Confidence & Self-Image": "Selbstvertrauen und Selbstbild",
      "Future & Long-Term Life": "Zukunft und langfristiges Leben",
      "Craving Mindset": "Mindset bei Verlangen",
      "Quick Boosts": "Schnelle Stärkung",
      "Self-Care & Wellbeing": "Selbstfürsorge und Wohlbefinden",
      "Identity & New Beginnings": "Identität und Neuanfang",
      "Resilience & Setbacks": "Widerstandskraft und Rückschläge",
      "Energy & Vitality": "Energie und Vitalität",
      "Reflection & Gratitude": "Reflexion und Dankbarkeit",
      "Anger & Frustration": "Wut und Frustration",
      "Social Pressure & Temptation": "Sozialer Druck und Versuchung",
      "Sleep & Mornings": "Schlaf und Morgen",
      "Anniversary & Big Wins": "Jubiläen und große Erfolge",
      "Real Talk": "Klartext",
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

function isEnglishCopy(text, enText) {
  return text === enText;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateOne(text, to) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" +
    encodeURIComponent(to) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const parts = data[0] ?? [];
  return sanitizeAiPunctuation(parts.map((p) => p[0]).join(""));
}

async function translateWithRetry(text, to, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await translateOne(text, to);
    } catch (err) {
      if (i === attempts - 1) throw err;
      await sleep(1500 * (i + 1));
    }
  }
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function translateFile(locale, kind) {
  const to = LOCALE_MAP[locale];
  const enPath = path.join(cardsDir, `${kind}-en.json`);
  const outPath = path.join(cardsDir, `${kind}-${locale}.json`);
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

  const catMap = CATEGORY_TRANSLATIONS[locale]?.[kind] ?? {};
  const categories = {};
  for (const [enCat] of Object.entries(en.categories)) {
    categories[enCat] = catMap[enCat] ?? enCat;
  }

  const texts = {};
  const entries = Object.entries(en.texts);
  const pending = entries.filter(([id, text]) => {
    if (fs.existsSync(outPath)) {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
      const current = existing.texts?.[id];
      if (current && !isEnglishCopy(current, text) && !current.includes("|||")) {
        texts[id] = current;
        return false;
      }
    }
    return true;
  });

  console.log(`\n${kind}-${locale}: ${entries.length} total, ${pending.length} to translate`);

  const CHUNK = 20;
  const CONCURRENCY = 6;

  for (let i = 0; i < pending.length; i += CHUNK) {
    const chunk = pending.slice(i, i + CHUNK);
    const translated = await mapPool(chunk, CONCURRENCY, async ([id, text]) => {
      const out = await translateWithRetry(text, to);
      return [id, out];
    });

    for (const [id, out] of translated) {
      texts[id] = out;
    }

    fs.writeFileSync(outPath, JSON.stringify({ texts, categories }, null, 2), "utf8");
    const done = Object.keys(texts).filter((id) => !isEnglishCopy(texts[id], en.texts[id])).length;
    console.log(`  ${kind}-${locale}: ${done}/${entries.length}`);
    await sleep(250);
  }

  const finalDone = Object.keys(en.texts).filter((id) => !isEnglishCopy(texts[id], en.texts[id])).length;
  console.log(`Finished ${kind}-${locale}: ${finalDone}/${entries.length}`);
  return { locale, kind, total: entries.length, translated: finalDone };
}

const [, , arg1, arg2] = process.argv;
const jobs =
  arg1 === "all"
    ? [
        ["es", "tips"],
        ["pt", "tips"],
        ["fr", "motivation"],
        ["de", "motivation"],
        ["es", "motivation"],
        ["pt", "motivation"],
      ]
    : [[arg1, arg2]];

const results = [];
for (const [locale, kind] of jobs) {
  if (!locale || !kind) {
    console.error("Usage: node translate-cards.mjs <locale> <tips|motivation> | all");
    process.exit(1);
  }
  results.push(await translateFile(locale, kind));
}

console.log("\n=== SUMMARY ===");
for (const r of results) {
  console.log(`${r.kind}-${r.locale}: ${r.translated}/${r.total}`);
}
