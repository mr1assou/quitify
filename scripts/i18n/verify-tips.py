#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EN = json.loads((ROOT / "i18n/content/cards/tips-en.json").read_text(encoding="utf-8"))

for locale in ("fr", "de"):
    data = json.loads((ROOT / f"i18n/content/cards/tips-{locale}.json").read_text(encoding="utf-8"))
    tr = sum(1 for k in EN["texts"] if data["texts"].get(k) and data["texts"][k] != EN["texts"][k])
    bad = [k for k, v in data["texts"].items() if re.search(r"—|–|--", v)]
    eng = [k for k in EN["texts"] if data["texts"].get(k) == EN["texts"][k]]
    miss = [k for k in EN["texts"] if k not in data["texts"]]
    print(
        f"{locale}: texts={len(data['texts'])} translated={tr} "
        f"english_left={len(eng)} missing={len(miss)} bad_punct={len(bad)} categories={len(data['categories'])}"
    )
