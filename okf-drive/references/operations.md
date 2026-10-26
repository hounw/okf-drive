# Operations

Step-by-step procedures. All of them follow the Rules in SKILL.md. Every operation that changes a bundle ends with "Close the session" (below).

## Continue a project

1. Find the bundle (link, or search by README + alias). If several match, ask.
2. Read the README. Parse the header; note `inbox`, `status`, and the Notes and Structure.
3. If `okf-drive` is a version newer than you know, say so and proceed carefully, preserving anything unfamiliar.
4. List the Inbox. If it isn't empty, mention it ("3 files waiting in the Inbox; want me to file them?").
5. Read the docs the person's task needs, in Index order, preferring summaries and `.md` conversions.
6. Summarize in a few lines: what the project is, Current state, pending items, Inbox count. Ask what to work on.

## New project

1. Ask (one message): where the folder should go (a link to the parent, or "My Drive"), the project name, and how it should be organized. Offer two options: "copy an existing bundle's Structure" or "start simple" (Inbox only, flat).
2. Create the folder (lowercase-with-dashes name unless they prefer otherwise), the Inbox folder, and any subfolders the Structure names.
3. Create the README from [templates.md](templates.md) with the header filled in: today's date, the person as `owner`, `status: active`.
4. If they gave you material (a contract, notes), upload it to the Inbox and run "File the inbox".
5. Close the session.

## Make this folder a bundle

1. List the folder recursively (page size 50+, follow tokens). Note file names, types and subfolders.
2. If a README already exists, read it and treat this as "Check this bundle" instead.
3. Create the Inbox (ask its name; default `00 Inbox`).
4. Draft the README: About from what you can infer; a Structure that describes the layout as it is (don't reorganize); a list of the doc types you see; an Index of every file with a one-line description; Current state "Converted to OKF-Drive, review pending".
5. Show the person the draft Structure and Index in chat before writing. Apply their corrections.
6. Write the README with `status: paused` until they approve, then set `status: active`.
7. Add headers to existing working Google Docs only with their yes (one batch approval is fine), using checked edits.
8. Don't rename or move existing files unless they ask.
9. Close the session.

## File the inbox

For each file in the Inbox, then each unindexed file found elsewhere in the bundle:

1. **Read it.** Large or thin read: follow [large-files.md](large-files.md).
2. **Identify it**: what it is, who it's from, its date. Can't tell (empty file, unnamed image)? Leave it in the Inbox and add it to the report.
3. **Name it** by the Structure's rule, else the default `YYYY-MM-DD <What it is> (from <source>)`.
4. **Move it** where the Structure says. If the Structure has no place for it, ask (and offer to add a line to the Structure).
5. **Summarize** if longer than a couple of pages: create `<What it is> - summary` as a Google Doc with header (`type` from Structure, `source` link) next to it.
6. **Index it**: add a line (and one for its summary or `.md`) in the right Index group, using a checked edit.
7. **Check contradictions** with existing docs (e.g. a brandbook says formal tone, the Customer Profile says casual). Don't change the existing doc; list it for the person.
8. **Log it** at the end of the run: one Log line for the batch.

Report: files filed (old name → new name, where), summaries and conversions created, contradictions to decide, files left in the Inbox and why.

## Check this bundle

Run the conformance checklist in [spec.md](spec.md) §9 and report pass/fail per item, with specifics (e.g. "3 files in Reference aren't in the Index", "doc 'Notes v2' has no header"). Offer fixes as a list. Apply only the ones the person approves.

## Close the session

Whenever you changed the bundle:

1. Reread the README (fresh revision ID).
2. Update Current state in a few lines.
3. Append a Log line: `YYYY-MM-DD, <person's name>: <what happened>`.
4. Set `updated:` to today.
5. Send as one checked batch edit. If it's rejected, reread and redo.

If the Log is past about 50 lines, offer to move older lines to a `LOG` doc.

## Editing a doc safely

1. Read the doc and keep its revision ID.
2. Build the smallest edit: `replaceAllText` for a unique phrase, or `insertText` at an index from that read.
3. Send it with `requiredRevisionId` = that revision ID.
4. Rejected? Reread, recompute, resend. After three rejections, tell the person someone is actively editing and ask how to proceed.
