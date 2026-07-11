#!/usr/bin/env python3
"""Polish fr.json for natural French and consistent terminology."""
import json
import re
from pathlib import Path

FR_PATH = Path(__file__).resolve().parents[2] / "i18n" / "content" / "quit-plan" / "fr.json"

TEXT_KEYS = {"plan_name", "method_note", "name", "role", "title", "intro", "text"}


def polish(text: str) -> str:
    if not isinstance(text, str):
        return text

    rules = [
        (r"\b(\d+) semaines gratuites\b", r"\1 semaines sans cigarette"),
        (r"\bUne semaine gratuite\b", "Une semaine sans cigarette"),
        (r"\bSix mois gratuits\b", "Six mois sans tabac"),
        (r"\bsix mois gratuits\b", "six mois sans tabac"),
        (r"\bfringales\b", "envies"),
        (r"\bFringales\b", "Envies"),
        (r"\bl'âge de six mois\b", "les six mois"),
        (r"\blettre de fin d'études\b", "lettre de fin de parcours"),
        (r"\btu t'es récupéré\b", "vous vous êtes retrouvé(e)"),
        (r"\bTu gardes le café\b", "Vous gardez le café"),
        (r"\bEt si tu glissais\b", "Et si vous glissiez"),
        (r"\bpour laquelle tu es reconnaissant\b", "pour laquelle vous êtes reconnaissant(e)"),
        (r"\bque tu as attrapé\b", "que vous avez repéré"),
        (r"\bRéclamez votre badge\b", "Récupérez votre badge"),
        (r"\bcollectez cette étape\b", "récupérez ce jalon"),
        (r"\bcollectez ce jalon\b", "récupérez ce jalon"),
        (r"\babandonnez un fardeau\b", "vous délestez d'un fardeau"),
        (r"\bVous n'abandonnez rien\b", "Vous ne renoncez à rien"),
        (r"\bvous n'abandonnez pas un ami\b", "vous ne perdez pas un ami"),
        (r"\bchewing-gum\b", "gomme"),
        (r"\bkit de sauvetage oral\b", "kit oral de secours"),
        (r"\boutil d'envie\b", "outil anti-envie"),
        (r"\bPartagez votre diplôme\b", "Partagez votre réussite"),
        (r"\bobtention du diplôme\b", "fin du parcours guidé"),
        (r"\bdiplôme du plan guidé\b", "fin du plan guidé"),
        (r"\bÉcrivez votre lettre de fin de parcours\b", "Écrivez votre lettre de fin de parcours"),
        (r"\ben leur racontant\b", "en lui racontant"),
        (r"\bà vous-même le premier jour\b", "à votre vous du jour 1"),
        (r"\bsans fumée\b", "sans fumer"),
        (r"\bsans une seule cigarette, sans nicotine\b", "sans une seule cigarette, libre de nicotine"),
        (r"\u00a0", " "),
    ]
    for pattern, repl in rules:
        text = re.sub(pattern, repl, text)

    return re.sub(r"\s{2,}", " ", text).strip()


def walk(obj, key=None):
    if isinstance(obj, dict):
        return {k: walk(v, k) for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk(item, key) for item in obj]
    if isinstance(obj, str) and key in TEXT_KEYS:
        return polish(obj)
    return obj


def main():
    data = json.loads(FR_PATH.read_text(encoding="utf-8"))
    data = walk(data)
    FR_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Polished {FR_PATH}")


if __name__ == "__main__":
    main()
