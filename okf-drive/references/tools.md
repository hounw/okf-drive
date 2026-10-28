# Tools map

OKF-Drive needs six capabilities. Each platform exposes them under different names. Use whatever your environment provides; if two routes exist, prefer an official Google connector or MCP server over raw HTTP.

| # | Capability | Google API underneath |
| --- | --- | --- |
| C1 | Search by full text, title, MIME type and parent folder | Drive `files.list` with `q` |
| C2 | Read a file's content (Docs, PDFs incl. OCR of scans, images, Office files) | Drive export / download, or a connector's "read content" |
| C3 | Create a folder, a Google Doc, or upload a file | Drive `files.create` |
| C4 | Rename and move a file, and set its description | Drive `files.update` (`name`, `addParents` / `removeParents`, `description`) |
| C5 | Read a Google Doc with its revision ID | Docs `documents.get` → `revisionId` |
| C6 | Edit a Google Doc only if unchanged since the read | Docs `documents.batchUpdate` with `writeControl.requiredRevisionId` |

Optional: C7 move to Trash (`files.update trashed=true`, only with a person's yes), C8 a shell with Python for MarkItDown, C9 copy a file (`files.copy`).

If C4 can rename but a move is refused, filing still works: see [mover.md](mover.md).

## Query patterns (Drive search syntax)

- Find bundles: `title = 'README' and fullText contains 'okf-drive'` (Drive API v3 uses `name` instead of `title`)
- Find one bundle: add `and fullText contains '<alias or project name>'`
- Find a bundle's Inbox (to add a file): `title = '00 Inbox for <bundle folder name>' and mimeType = 'application/vnd.google-apps.folder' and trashed = false` (API v3: `name = ...`). Then move the file with C4.
- List a folder: `parentId = '<folder id>'` (API v3: `'<folder id>' in parents`), `trashed = false`. Always set a page size of 50+ and follow `nextPageToken`.

## Claude (claude.ai, Cowork, desktop) with the Google Drive and Google Docs connectors

Verified 2026-10-20 (My Drive) and 2026-10-26 (Shared Drive).

| Capability | Tool |
| --- | --- |
| C1 | Google Drive `search_files` (supports `title`, `fullText`, `mimeType`, `parentId`, `owner`, `sharedWithMe`) |
| C2 | Google Drive `read_file_content` (Docs, Sheets, Slides, PDF incl. OCR, Office, PNG/JPEG) |
| C3 | Google Drive `create_file` (folder: MIME `application/vnd.google-apps.folder`; doc from text: `contentMimeType: text/plain`; raw file: `base64Content` + `disableConversionToGoogleType: true`) |
| C4 | Google Drive `update_file` (`title`, `parentId`, `description`). **Moves fail inside Shared Drives** with "The caller does not have permission", even for managers; renames and descriptions work. Use [mover.md](mover.md) there. |
| C5 | Google Docs `read_doc` → `revisionId` |
| C6 | Google Docs `update_doc` with `writeControl.requiredRevisionId`; prefer `replaceAllText` or index-based `insertText` from the fresh read |
| C7 | Google Drive `trash_file` |
| C9 | Google Drive `copy_file` (`parentId`, `title`) |

Both connectors must be enabled in the chat. In Claude Code, use a Google Workspace MCP server instead (see below).

## ChatGPT (Business, Enterprise, Edu)

Uses ChatGPT's Google Drive connector. Write capabilities vary by plan and admin settings, so run the onboarding self-test and report which of C1–C6 work. If C4 or C6 is missing, the skill still works read-only plus "create new doc", and tells the person which steps they must do by hand.

## Hermes, OpenClaw, Codex, Claude Code, Cursor and other agents with MCP or a shell

Any of these works:

1. **A Google Workspace MCP server** that exposes Drive search/read/create/update and Docs get/batchUpdate. Configure it in the agent's MCP settings and sign in with Google.
2. **The REST APIs directly** through a CLI or script with OAuth credentials the person sets up, using the calls in the first table. Never store tokens inside a bundle.

Check that the Docs edit tool passes `writeControl.requiredRevisionId`. If it can't, edits are still possible but unsafe for concurrent work: tell the person and reread immediately before every edit.

## Header writing tips

- A Google Doc created from `text/plain` keeps each line as a paragraph, so the header parses cleanly.
- Some read tools escape markdown-like lines (`\---`, `\-`). Treat them as `---` and `-` when parsing.
