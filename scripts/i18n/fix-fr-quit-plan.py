from pathlib import Path

p = Path(__file__).resolve().parents[2] / "i18n" / "content" / "quit-plan" / "fr.json"
s = p.read_text(encoding="utf-8")
fixes = [
    ("du gomme", "de la gomme"),
    ("en cas de envies", "en cas d'envies"),
    ("tout autant de envies", "tout autant d'envies"),
    ("vous vous vous débarrassez", "vous vous délestez"),
    ("jalon majeure", "jalon majeur"),
    ("à votre vous du jour 1, en lui racontant", "au vous du jour 1, en lui racontant"),
    (
        "Une courte lettre à votre vous du jour 1, leur expliquant",
        "Une courte lettre au vous du jour 1, en lui expliquant",
    ),
    (
        "vous n'abandonnez pas un ami, vous vous délestez",
        "vous ne perdez pas un ami, vous vous délestez",
    ),
]
for old, new in fixes:
    s = s.replace(old, new)
p.write_text(s, encoding="utf-8")
print("Applied fixes")
