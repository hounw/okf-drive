#!/usr/bin/env python3
"""Validate the okf-drive skill against the Agent Skills format.

Checks: frontmatter present and parseable, name rules, description length,
optional field limits, relative links resolve, spec copy in sync, body size.
Exit code 1 on any error.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL_DIR = ROOT / "okf-drive"
SKILL_MD = SKILL_DIR / "SKILL.md"

errors, warnings = [], []


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return None, text
    raw, body = m.groups()
    try:
        import yaml  # type: ignore
        return yaml.safe_load(raw), body
    except ImportError:
        data = {}
        for line in raw.splitlines():
            if line and not line.startswith(" ") and ":" in line:
                k, v = line.split(":", 1)
                data[k.strip()] = v.strip().strip('"')
        return data, body


text = SKILL_MD.read_text(encoding="utf-8")
fm, body = parse_frontmatter(text)
if fm is None:
    errors.append("SKILL.md has no YAML frontmatter")
    fm = {}

name = fm.get("name", "")
if not name:
    errors.append("frontmatter: name is required")
elif (len(name) > 64 or not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name)):
    errors.append(f"frontmatter: invalid name {name!r}")
elif name != SKILL_DIR.name:
    errors.append(f"frontmatter: name {name!r} must match directory {SKILL_DIR.name!r}")

desc = fm.get("description", "")
if not desc:
    errors.append("frontmatter: description is required")
elif len(desc) > 1024:
    errors.append(f"frontmatter: description is {len(desc)} chars (max 1024)")
elif "<" in desc or ">" in desc:
    errors.append("frontmatter: description must not contain angle brackets")

compat = fm.get("compatibility", "")
if compat and len(compat) > 500:
    errors.append(f"frontmatter: compatibility is {len(compat)} chars (max 500)")

words = len(body.split())
approx_tokens = int(words * 1.4)
if approx_tokens > 5000:
    warnings.append(f"SKILL.md body is ~{approx_tokens} tokens (recommended under 5000)")

for md in [SKILL_MD, *sorted((SKILL_DIR / "references").glob("*.md"))]:
    for link in re.findall(r"\]\(([^)#]+)(?:#[^)]*)?\)", md.read_text(encoding="utf-8")):
        if re.match(r"^[a-z]+://", link):
            continue
        if not (md.parent / link).resolve().exists():
            errors.append(f"{md.relative_to(ROOT)}: broken link {link}")

spec_src = (ROOT / "SPEC.md").read_text(encoding="utf-8")
spec_copy = SKILL_DIR / "references" / "spec.md"
if not spec_copy.exists() or spec_copy.read_text(encoding="utf-8") != spec_src:
    errors.append("okf-drive/references/spec.md is missing or out of sync with SPEC.md (run scripts/build.sh)")

for w in warnings:
    print(f"warning: {w}")
for e in errors:
    print(f"error: {e}")
print(f"{'FAILED' if errors else 'OK'}: name={name} description={len(desc)} chars body~{approx_tokens} tokens")
sys.exit(1 if errors else 0)
