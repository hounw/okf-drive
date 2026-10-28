# Changelog

## Skill 0.3.0 · Standard 0.2.1 · 2026-10-28

- Standard: files in transit. An agent that can't move a file indexes it at its destination and tags its Drive description `okf-move-to: <folder ID>`; a tagged file is filed, not new. Failures become `okf-move-error: <reason> (<date>)`. Conformance allows files in transit. Patch release: READMEs keep `okf-drive: 0.2`.
- Skill: new `scripts/okf-drive-mover/` Apps Script that moves tagged files every 5 minutes, only within the file's own bundle, and `references/mover.md` (install, tags, fallbacks: copy + trash, or a list for the person).
- Skill: filing, continuing, checking and adding files handle refused moves; tools map notes that Claude's Google Drive connector can't move files inside Shared Drives; self-test repeats the move test in a Shared Drive.

## Skill 0.2.0 · Standard 0.2 · 2026-10-26

- Standard: the Inbox MUST be named `00 Inbox for <bundle folder name>`, so an agent finds it with one Drive search by exact name. Renaming a bundle renames its Inbox. Upgrade note for 0.1 bundles.
- Skill: new "Add this to <project>" operation (find the Inbox by name, move the file), "Rename a bundle" procedure, offer to upgrade 0.1 bundles, Inbox search pattern in the tools map, self-test checks the Inbox search.

## Skill 0.1.0 · Standard 0.1 · 2026-10-20

- First release.
- Standard: bundles (README + required Inbox), README header and six sections, document headers, free per-bundle types, Structure section, default naming, MarkItDown conversions for large files, conformance checklist, mapping to OKF v0.1.
- Skill: rules, five operations, onboarding with a Drive self-test, platform tools map (verified on Claude with the Google Drive and Google Docs connectors).
