#!/usr/bin/env python3
"""Batch-translate tips-en.json to target locale with punctuation sanitization."""
import json
import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[2]
EN_PATH = ROOT / "i18n" / "content" / "cards" / "tips-en.json"

CATEGORY_TRANSLATIONS = {
    "fr": {
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
    },
    "de": {
        "Beat the Craving": "Verlangen besiegen",
        "Breathe & Calm": "Atmen und beruhigen",
        "Move Your Body": "Beweg dich",
        "Hands & Mouth": "Hände und Mund",
        "Change the Scene": "Szene wechseln",
        "Know Your Triggers": "Auslöser kennen",
        "Stress & Emotions": "Stress und Gefühle",
        "Morning Routines": "Morgenroutinen",
        "Evening & Wind Down": "Abend und Entspannung",
        "Social Situations": "Soziale Situationen",
        "Work & Breaks": "Arbeit und Pausen",
        "Withdrawal Help": "Hilfe bei Entzug",
        "Habit Replacement": "Gewohnheit ersetzen",
        "Sleep & Energy": "Schlaf und Energie",
        "Stay on Track": "Dranbleiben",
        "Tracking & Tools": "Tracking und Tools",
        "Relapse Recovery": "Rückfall und Neustart",
        "Travel & Disruption": "Reisen und Störungen",
        "Talking to Others": "Mit anderen sprechen",
        "Vaping & Alternatives": "Dampfen und Alternativen",
    },
}

MAX_BATCH_CHARS = 4500
SLEEP_BETWEEN_BATCHES = 0.8


def sanitize_punctuation(text: str) -> str:
    text = re.sub(r"\s*—\s*", ", ", text)
    text = re.sub(r"\s*–\s*", ", ", text)
    text = re.sub(r"\s*--\s*", ", ", text)
    text = re.sub(r",\s*,", ",", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def make_batches(texts: list[str]) -> list[list[str]]:
    batches: list[list[str]] = []
    current: list[str] = []
    current_len = 0
    sep_len = len("\n|||SPLIT|||\n")
    for text in texts:
        add_len = len(text) + (sep_len if current else 0)
        if current and current_len + add_len > MAX_BATCH_CHARS:
            batches.append(current)
            current = [text]
            current_len = len(text)
        else:
            current.append(text)
            current_len += add_len
    if current:
        batches.append(current)
    return batches


def translate_batch(texts: list[str], target: str) -> list[str]:
    translator = GoogleTranslator(source="en", target=target)
    joined = "\n|||SPLIT|||\n".join(texts)
    for attempt in range(5):
        try:
            result = translator.translate(joined)
            parts = result.split("|||SPLIT|||")
            if len(parts) == len(texts):
                return [sanitize_punctuation(p.strip()) for p in parts]
            print(f"  Split mismatch ({len(parts)} vs {len(texts)}), falling back to singles", flush=True)
            break
        except Exception as e:
            print(f"  Batch retry {attempt + 1}: {e}", flush=True)
            time.sleep(2 ** attempt)
    out = []
    single = GoogleTranslator(source="en", target=target)
    for text in texts:
        for attempt in range(5):
            try:
                out.append(sanitize_punctuation(single.translate(text)))
                break
            except Exception as e:
                print(f"  Single retry {attempt + 1}: {e}", flush=True)
                time.sleep(2 ** attempt)
        else:
            out.append(sanitize_punctuation(text))
        time.sleep(0.2)
    return out


def translate_locale(locale: str, target_code: str) -> int:
    out_path = ROOT / "i18n" / "content" / "cards" / f"tips-{locale}.json"
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))

    cat_map = CATEGORY_TRANSLATIONS[locale]
    categories = {k: cat_map.get(k, k) for k in en["categories"]}

    ids = sorted(en["texts"].keys(), key=int)
    existing_texts = {}
    if out_path.exists():
        existing = json.loads(out_path.read_text(encoding="utf-8"))
        existing_texts = existing.get("texts", {})

    texts = dict(existing_texts)
    pending_ids = [i for i in ids if texts.get(i) == en["texts"][i] or i not in texts]
    total = len(ids)
    done = total - len(pending_ids)
    print(f"[{locale}] Resuming: {done} done, {len(pending_ids)} pending", flush=True)

    pending_texts = [en["texts"][i] for i in pending_ids]
    batches = make_batches(pending_texts)
    offset = 0

    for batch_idx, batch_texts in enumerate(batches):
        batch_ids = pending_ids[offset : offset + len(batch_texts)]
        offset += len(batch_texts)
        print(
            f"[{locale}] Translating batch {batch_idx + 1}/{len(batches)} "
            f"({batch_ids[0]}-{batch_ids[-1]}, {len(batch_texts)} items)...",
            flush=True,
        )
        translated = translate_batch(batch_texts, target_code)
        for i, t in zip(batch_ids, translated):
            texts[i] = t
        time.sleep(SLEEP_BETWEEN_BATCHES)

        out_path.write_text(
            json.dumps({"texts": texts, "categories": categories}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    out_path.write_text(
        json.dumps({"texts": texts, "categories": categories}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return len(texts)


if __name__ == "__main__":
    locale = sys.argv[1] if len(sys.argv) > 1 else "fr"
    target_code = {"fr": "fr", "de": "de"}.get(locale)
    if not target_code:
        print(f"Unsupported locale: {locale}")
        sys.exit(1)
    count = translate_locale(locale, target_code)
    print(f"Done: {count} texts in tips-{locale}.json")
