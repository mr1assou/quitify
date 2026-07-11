#!/usr/bin/env python3
"""Post-process tips translations to fix common MT errors."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def fix_fr(text: str) -> str:
    text = text.replace(
        "Surfer en urgence, c'est surfer sur la vague",
        "Surfer sur l'envie, c'est surfer sur la vague",
    )
    text = text.replace("s'éclairer", "allumer une cigarette")
    text = text.replace("l'envie de s'éclairer", "l'envie d'allumer une cigarette")
    return text


def fix_de(text: str) -> str:
    replacements = [
        ("Heißhungerattacken", "Nikotinverlangen"),
        ("Heißhungerschleife", "Verlangensschleife"),
        ("Heißhungerprotokoll", "Verlangensprotokoll"),
        ("Heißhunger-Tagebuch", "Verlangenstagebuch"),
        ("abendlichem Heißhunger", "abendlichem Nikotinverlangen"),
        ("Heißhunger auf Oralsex", "Verlangen nach oraler Beschäftigung"),
        ("nach einem Rucksack zu greifen", "nach einer Zigarette zu greifen"),
        ("nach einem Rucksack", "nach einer Zigarette"),
        ("nach einem Rucksack zusteuern", "nach einer Zigarette zu greifen"),
        ("Greifen nach einem Rucksack", "Greifen nach einer Zigarette"),
        ("greifen seltener nach einem Rucksack", "greifen seltener nach einer Zigarette"),
        ("mit einem Rucksack in der Nähe", "mit einer Zigarette in der Nähe"),
        ("Rucksack auf der Veranda", "Zigarette auf der Veranda"),
        ("einen Rucksack gekauft", "Zigaretten gekauft"),
        ("Packen eine einzige Bewegung", "Zigaretten kaufen eine einzige Bewegung"),
        ("automatische Greifen nach einem Rucksack", "automatisches Greifen nach einer Zigarette"),
        ("Ihrem Austrittsdatum", "Ihrem Aufhördatum"),
        ("Ihrer Kündigung", "Ihrem Rauchstopp"),
        ("verdienten Austritt", "erreichten Rauchstopp"),
        ("Ihren Austritt", "Ihren Rauchstopp"),
        ("deinen Austritt", "deinen Rauchstopp"),
        ("Ihren Austrittsgrund", "Ihren Grund fürs Aufhören"),
        ("Austrittstermin", "Aufhördatum"),
        ("auf einen Rucksack zusteuern", "nach einer Zigarette greifen"),
        ("Heißhunger", "Verlangen"),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def sanitize(text: str) -> str:
    text = re.sub(r"\s*—\s*", ", ", text)
    text = re.sub(r"\s*–\s*", ", ", text)
    text = re.sub(r"\s*--\s*", ", ", text)
    return text.strip()


for locale, fixer in [("fr", fix_fr), ("de", fix_de)]:
    path = ROOT / f"i18n/content/cards/tips-{locale}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    for k, v in data["texts"].items():
        data["texts"][k] = sanitize(fixer(v))
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Post-processed tips-{locale}.json")
