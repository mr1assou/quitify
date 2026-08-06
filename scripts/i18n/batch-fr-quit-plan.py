#!/usr/bin/env python3
"""Batch-translate quit-plan/en.json → fr.json (Google Translate + curated overrides)."""
import json
import re
import time
from copy import deepcopy
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[2] / "i18n" / "content" / "quit-plan"
EN_PATH = ROOT / "en.json"
FR_PATH = ROOT / "fr.json"
CACHE_PATH = ROOT / ".cache-fr-manual.json"

SKIP_KEYS = {"id", "type", "day", "chapter", "day_start", "day_end", "total_days"}
SKIP_VALUES = {
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
}

OVERRIDES = {
    "plan_name": "Plan d'arrêt du tabac sur 180 jours",
    "method_note": (
        "Ce plan repose sur trois piliers : (1) la thérapie de substitution nicotinique (TSN) en option "
        "(patchs, pastilles, gommes) pour adoucir le sevrage physique, (2) un kit oral de substitution "
        "(menthes, gommes sans sucre, cure-dents, bâtons de cannelle) pour le geste main-bouche, "
        "et (3) un travail sur l'état d'esprit inspiré de la méthode Easyway : fumer n'apporte aucun "
        "plaisir réel, les envies sont l'addiction qui meurt, et arrêter est une libération, pas un sacrifice. "
        "Les dosages TSN indiqués suivent les recommandations standard en vente libre ; confirmez votre dose "
        "et votre calendrier avec un pharmacien ou un médecin, surtout en cas de grossesse, si vous avez moins "
        "de 18 ans, ou si vous suivez un traitement cardiaque."
    ),
    "chapters[0].name": "Survie et mise en place",
    "chapters[0].role": (
        "Les 2 premières semaines : installer la TSN et votre kit oral, traverser le pic de sevrage, "
        "ancrer l'état d'esprit de base"
    ),
    "chapters[1].name": "Casser l'habitude",
    "chapters[1].role": (
        "Jours 15 à 30 : recâbler les matins, les repas, le café, les trajets et les pauses "
        "pendant que la TSN stabilise le côté physique"
    ),
    "chapters[2].name": "Nouvelle normale",
    "chapters[2].role": (
        "Jours 31 à 60 : situations sociales, alcool, stress au travail, plus vos premières réductions de TSN"
    ),
    "chapters[3].name": "Tenir bon",
    "chapters[3].role": (
        "Jours 61 à 90 : vaincre la complaisance et les pièges de la rechute, terminer le sevrage des patchs, "
        "atteindre 3 mois"
    ),
    "chapters[4].name": "Qui vous êtes maintenant",
    "chapters[4].role": (
        "Jours 91 à 120 : identité de non-fumeur, totalement libre de nicotine, victoires santé, mentorat"
    ),
    "chapters[5].name": "Les jours difficiles",
    "chapters[5].role": (
        "Jours 121 à 150 : se préparer au deuil, au stress majeur, à l'hiver et aux fêtes, aux faux pas "
        "et aux anciens amis fumeurs"
    ),
    "chapters[6].name": "Six mois libre",
    "chapters[6].role": (
        "Jours 151 à 180 : entretien hebdomadaire léger, mentorat, diplôme du plan guidé"
    ),
}

MAX_BATCH_CHARS = 4200
SLEEP_BETWEEN_BATCHES = 0.9
SPLIT = "\n|||SPLIT|||\n"


def sanitize(text: str) -> str:
    text = re.sub(r"\s*—\s*", ", ", text)
    text = re.sub(r"\s*–\s*", ", ", text)
    text = re.sub(r"\s*--\s*", ", ", text)
    text = re.sub(r",\s*,", ",", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def post_process(text: str) -> str:
    text = sanitize(text)
    replacements = [
        (r"\bN R T\b", "NRT"),
        (r"\bT S N\b", "TSN"),
        (r"\bQuitify\b", "Quitify"),
        (r"\bEasyway\b", "Easyway"),
        (r"\bnon fumeur\b", "non-fumeur"),
        (r"\bnon fumeurs\b", "non-fumeurs"),
        (r"Jour (\d+) : Jour \1 :", r"Jour \1 :"),
        (r"Jour (\d+): Jour \1:", r"Jour \1 :"),
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    return text


def collect_strings(obj, prefix="", out=None):
    if out is None:
        out = []
    if isinstance(obj, str):
        out.append({"path": prefix, "value": obj})
        return out
    if isinstance(obj, list):
        for i, item in enumerate(obj):
            collect_strings(item, f"{prefix}[{i}]", out)
        return out
    if isinstance(obj, dict):
        for key, value in obj.items():
            next_path = f"{prefix}.{key}" if prefix else key
            if isinstance(value, str) and (key in SKIP_KEYS or value in SKIP_VALUES):
                continue
            collect_strings(value, next_path, out)
    return out


def set_by_path(obj, path_str, value):
    parts = []
    current = ""
    i = 0
    while i < len(path_str):
        ch = path_str[i]
        if ch == ".":
            if current:
                parts.append(current)
            current = ""
        elif ch == "[":
            if current:
                parts.append(current)
            current = ""
            end = path_str.index("]", i)
            parts.append(int(path_str[i + 1 : end]))
            i = end
        else:
            current += ch
        i += 1
    if current:
        parts.append(current)

    node = obj
    for part in parts[:-1]:
        node = node[part]
    node[parts[-1]] = value


def prepare_for_translate(path: str, value: str) -> str:
    if path.endswith(".title") and ".days[" in path and "tasks[" not in path:
        m = re.match(r"Day (\d+): (.+)", value)
        if m:
            return m.group(2)
    return value


def apply_day_title(path: str, en_value: str, fr_rest: str) -> str:
    if path.endswith(".title") and ".days[" in path and "tasks[" not in path:
        m = re.match(r"Day (\d+): (.+)", en_value)
        if m:
            return post_process(f"Jour {m.group(1)} : {fr_rest}")
    return post_process(fr_rest)


def make_batches(items: list[dict]) -> list[list[dict]]:
    batches: list[list[dict]] = []
    current: list[dict] = []
    current_len = 0
    sep_len = len(SPLIT)
    for item in items:
        text = item["to_translate"]
        add_len = len(text) + (sep_len if current else 0)
        if current and current_len + add_len > MAX_BATCH_CHARS:
            batches.append(current)
            current = []
            current_len = 0
            add_len = len(text)
        current.append(item)
        current_len += add_len
    if current:
        batches.append(current)
    return batches


def translate_batch(translator: GoogleTranslator, texts: list[str]) -> list[str]:
    joined = SPLIT.join(texts)
    translated = translator.translate(joined)
    parts = translated.split("|||SPLIT|||")
    parts = [p.strip() for p in parts]
    if len(parts) != len(texts):
        # Fallback: one-by-one if splitter broke
        return [translator.translate(t) for t in texts]
    return parts


def main():
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    output = deepcopy(en)
    strings = collect_strings(en)
    cache = json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}
    translator = GoogleTranslator(source="en", target="fr")

    pending = []
    for item in strings:
        path, value = item["path"], item["value"]
        if path in OVERRIDES:
            set_by_path(output, path, OVERRIDES[path])
            continue
        if path in cache:
            set_by_path(output, path, cache[path])
            continue
        pending.append(
            {
                "path": path,
                "value": value,
                "to_translate": prepare_for_translate(path, value),
            }
        )

    print(f"Total strings: {len(strings)} | cached/override: {len(strings) - len(pending)} | to translate: {len(pending)}")
    batches = make_batches(pending)
    print(f"Batches: {len(batches)}")

    done = 0
    for bi, batch in enumerate(batches, start=1):
        texts = [item["to_translate"] for item in batch]
        try:
            translated = translate_batch(translator, texts)
        except Exception as exc:
            print(f"\nBatch {bi} failed ({exc}); retrying one-by-one…")
            time.sleep(2)
            translated = []
            for text in texts:
                try:
                    translated.append(translator.translate(text))
                except Exception as inner:
                    print(f"  skip: {inner}")
                    translated.append(text)
                time.sleep(0.2)

        for item, fr_text in zip(batch, translated):
            final = apply_day_title(item["path"], item["value"], fr_text)
            cache[item["path"]] = final
            set_by_path(output, item["path"], final)
            done += 1

        CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\rBatch {bi}/{len(batches)} · translated {done}/{len(pending)}", end="", flush=True)
        time.sleep(SLEEP_BETWEEN_BATCHES)

    FR_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {FR_PATH}")


if __name__ == "__main__":
    main()
