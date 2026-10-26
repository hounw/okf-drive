---
name: okf-drive
description: Work on projects stored in Google Drive using the OKF-Drive standard (a README doc with header, Structure, Index, Current state and Log, plus a required Inbox folder). Use when someone asks to continue, open, set up, organize or check a project in Google Drive, file or organize an inbox, convert a folder into an OKF-Drive bundle, or says "okf", "okf-drive", or "help me with OKF-Drive". Also use the first time it is installed, to guide the person through setup.
license: MIT
compatibility: Needs Google Drive access (search, read, create, update/move files) and Google Docs access (read and batch-update with a revision ID), through connectors, MCP servers or a CLI. A shell with Python is optional, for MarkItDown conversions.
metadata:
  version: "0.1.0"
  spec-version: "0.1"
  homepage: "https://github.com/hounw/okf-drive"
---

# OKF-Drive

You help people work on projects ("bundles") that live in Google Drive and follow the OKF-Drive standard. Any Drive folder anywhere is a bundle when its top level holds a Google Doc named `README` whose first line is `okf-drive: 0.1`, plus the Inbox folder that README names. The full standard is in [references/spec.md](references/spec.md). Read it the first time you work on a bundle in a session.

## First, check your tools

Before any operation, confirm you can do each of these. The tool names differ by platform; [references/tools.md](references/tools.md) maps them.

1. Search Drive by full text and by parent folder
2. Read a file's content (Docs, PDFs, images)
3. Create files and folders, and upload a file
4. Rename and move a file (change its parent)
5. Read a Google Doc with its revision ID, and batch-update it with that revision ID

If something is missing, say exactly which capability is missing and what it blocks, then continue with what works. Never fall back to writing into a locally synced Drive folder.

## First run: onboarding

If this is the first time the person uses this skill, or they ask for help, follow [references/onboarding.md](references/onboarding.md). It checks tools, runs a short self-test in a sandbox bundle, and teaches the person the five things they can ask for.

## Rules (always)

1. **README first.** Read the README, then linked docs in Index order. Prefer a summary or `.md` conversion over its original.
2. **Write only through the Google APIs**, never to a synced local folder.
3. **Small, checked edits.** Read a doc, then send the edit with that read's revision ID. If rejected because the doc changed, reread and redo it. Never use whole-doc replacement on a doc someone else may be editing.
4. **New work is a new Google Doc** with a header (`type`, `description`, `updated`, then `---`), placed and named as the bundle's Structure says.
5. **Register immediately.** Every file you create, file or retire gets its Index line in the same step. Outside the Inbox, nothing exists unindexed.
6. **Never overwrite, delete or trash** without the person's explicit yes.
7. **Ask on contradictions** between new material and what the bundle already records.
8. **Close every session**: update Current state, add a Log line `YYYY-MM-DD, <person>: <what happened>`, and set `updated` in the header.
9. **Follow this bundle's Structure and types.** Never impose another bundle's layout. Keep unknown header fields and sections as they are.
10. **Language.** Reply in the person's language. Write docs in the language the README Notes set.
11. **Listing folders:** always set a page size (e.g. 50) and follow next-page tokens; default pages can silently omit files.

## What people can ask for

Detailed steps are in [references/operations.md](references/operations.md).

| Ask | Do |
| --- | --- |
| "Continue <project>" | Find the bundle, read README and Index, summarize state and pending items, then ask what to work on |
| "New project: <name>" | Ask where and how it should be organized (or which bundle to copy), then create the folder, Inbox and README from [references/templates.md](references/templates.md) |
| "Make this folder a bundle" | Inventory it, create the Inbox, draft README with a Structure describing what exists and a full Index, add headers to working docs; show the draft before marking `status: active` |
| "File the inbox" | For each Inbox file and any unindexed file: identify, rename, move per Structure, summarize or convert if long, index, check contradictions, log |
| "Check this bundle" | Run the conformance checklist in the spec; report; fix only what the person approves |

## Finding a bundle

1. Use a link if the person gives one.
2. Otherwise search: Google Docs titled `README` with full text containing `okf-drive` and the project name or alias.
3. Several matches: list title, owner and location, and ask.

## Large files

If a reference file is roughly 30+ pages, or reading it returns truncated or thin text, recommend a MarkItDown conversion and keep both files. See [references/large-files.md](references/large-files.md).

## Header format

Every README and working doc starts with plain `key: value` lines and a line with only `---`. When you parse, ignore blank lines and a leading backslash before `---` or `-` (some exports escape them). When you write, keep each field on its own line.
