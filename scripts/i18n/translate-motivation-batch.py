#!/usr/bin/env python3
"""Batch-translate motivation-en.json to French with punctuation sanitization."""
import json
import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[2]
EN_PATH = ROOT / "i18n" / "content" / "cards" / "motivation-en.json"
OUT_PATH = ROOT / "i18n" / "content" / "cards" / "motivation-fr.json"

CATEGORY_TRANSLATIONS = {
    "Health & Body": "Santé et corps",
    "Freedom & Control": "Liberté et contrôle",
    "Money & Savings": "Argent et économies",
    "Family & Loved Ones": "Famille et proches",
    "Strength & Willpower": "Force et volonté",
    "Progress & Milestones": "Progrès et étapes",
    "Confidence & Self-Image": "Confiance et image de soi",
    "Future & Long-Term Life": "Avenir et long terme",
    "Craving Mindset": "État d'esprit face à l'envie",
    "Quick Boosts": "Coups de boost",
    "Self-Care & Wellbeing": "Bien-être et soin de soi",
    "Identity & New Beginnings": "Identité et nouveaux départs",
    "Resilience & Setbacks": "Résilience et obstacles",
    "Energy & Vitality": "Énergie et vitalité",
    "Reflection & Gratitude": "Réflexion et gratitude",
    "Anger & Frustration": "Colère et frustration",
    "Social Pressure & Temptation": "Pression sociale et tentation",
    "Sleep & Mornings": "Sommeil et matins",
    "Anniversary & Big Wins": "Anniversaires et grandes victoires",
    "Real Talk": "Parler vrai",
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
            print(
                f"  Split mismatch ({len(parts)} vs {len(texts)}), falling back to singles",
                flush=True,
            )
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


def main() -> None:
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    categories = {k: CATEGORY_TRANSLATIONS.get(k, k) for k in en["categories"]}

    ids = sorted(en["texts"].keys(), key=int)
    texts: dict[str, str] = {}
    if OUT_PATH.exists():
        existing = json.loads(OUT_PATH.read_text(encoding="utf-8"))
        texts = dict(existing.get("texts", {}))

    pending_ids = [i for i in ids if i not in texts or texts.get(i) == en["texts"][i]]
    total = len(ids)
    done = total - len(pending_ids)
    print(f"[fr] Resuming: {done} done, {len(pending_ids)} pending", flush=True)

    pending_texts = [en["texts"][i] for i in pending_ids]
    batches = make_batches(pending_texts)
    offset = 0

    for batch_idx, batch_texts in enumerate(batches):
        batch_ids = pending_ids[offset : offset + len(batch_texts)]
        offset += len(batch_texts)
        print(
            f"[fr] Translating batch {batch_idx + 1}/{len(batches)} "
            f"({batch_ids[0]}-{batch_ids[-1]}, {len(batch_texts)} items)...",
            flush=True,
        )
        translated = translate_batch(batch_texts, "fr")
        for i, t in zip(batch_ids, translated):
            texts[i] = t
        time.sleep(SLEEP_BETWEEN_BATCHES)
        OUT_PATH.write_text(
            json.dumps(
                {"texts": texts, "categories": categories},
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

    OUT_PATH.write_text(
        json.dumps(
            {"texts": texts, "categories": categories},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Done: {len(texts)} texts in motivation-fr.json")


if __name__ == "__main__":
    main()
