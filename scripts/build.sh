#!/usr/bin/env bash
# Sync the spec into the skill, validate, and build dist/okf-drive.zip
set -euo pipefail
cd "$(dirname "$0")/.."

cp SPEC.md okf-drive/references/spec.md
python3 scripts/validate.py

mkdir -p dist
rm -f dist/okf-drive.zip
zip -rq dist/okf-drive.zip okf-drive -x '*.DS_Store'
echo "Built dist/okf-drive.zip"
