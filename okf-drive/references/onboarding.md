# Onboarding

Run this the first time someone uses the skill, or when they say "help", "set me up" or "how does this work". Keep it conversational, in the person's language, one step at a time. It takes about five minutes.

## Step 1: Welcome (one short message)

Explain in three sentences: projects live in Google Drive folders that each have a README and an Inbox named after the project; you read the README to pick up any project, file whatever lands in the Inbox, and keep the README current; nothing is deleted without their yes.

## Step 2: Check tools

Check each capability C1–C6 from [tools.md](tools.md) by looking at the tools you have. Then tell the person, plainly:

- What works.
- What's missing, what it blocks, and how to fix it on their platform (e.g. "enable the Google Docs connector in this chat", "ask your admin to allow Drive write access", "add a Google Workspace MCP server").

If C1 or C2 is missing, stop here: the skill can't work without search and read.

## Step 3: Self-test (ask first)

Ask: "Can I create a small test folder in your Drive to make sure everything works? It's safe to delete afterwards." If yes:

1. Create folder `okf-drive-selftest` in their My Drive root (or reuse it if it exists).
2. Create a Google Doc `README` inside it from the template in [templates.md](templates.md), with `type: selftest`, `title: OKF-Drive self-test`, `aliases: okf-selftest-<random 4 letters>`, `inbox: 00 Inbox for okf-drive-selftest`.
3. Create folders `00 Inbox for okf-drive-selftest` and `Reference`.
4. Upload a small text file `test-note.txt` into `00 Inbox for okf-drive-selftest` with the line `OKF-Drive self-test note`.

Then run, recording pass/fail:

| Test | How | Pass when |
| --- | --- | --- |
| Find | Search `title = 'README' and fullText contains '<the alias>'` | The README is found (indexing can take up to a minute; retry twice) |
| Find Inbox | Search for a folder named exactly `00 Inbox for okf-drive-selftest` | One folder is found |
| List | List that folder with a page size of 50 | `test-note.txt` is listed |
| Read | Read `test-note.txt` | Content matches |
| File | Rename to `<today> Test note (from selftest).txt` and move to `Reference` | Listing `Reference` shows it |
| Index | Read README with revision ID, replace the Index placeholder with a line for the note, sending the revision ID | Edit succeeds |
| Stale edit guard | Send another edit with the old revision ID | It is rejected |
| Log | Reread, append a Log line with the fresh revision ID | Edit succeeds |

If they keep projects in a Shared Drive, ask for a folder there and repeat the File test with a second test note (moves can be refused in Shared Drives even when they work in My Drive). If the move is refused, explain it and offer the mover from [mover.md](mover.md).

Report the results in a short table. If the stale-edit guard didn't reject, warn that two people editing the same doc at once could lose changes on this platform.

Leave the test folder in place and tell them they can delete it.

## Step 4: Teach the six asks

Show this list with one real-sounding example each, using names from their context if you know any:

1. "Continue <project>": I find it, read it, and tell you where things stand.
2. "New project: <name>": I set up the folder, README and Inbox wherever you want.
3. "Make this folder a project": I turn an existing Drive folder into an OKF-Drive bundle.
4. "Add this to <project>": I drop a doc or file into that project's Inbox in one step.
5. "File the inbox for <project>": I name, file, summarize and index whatever you dropped in.
6. "Check <project>": I tell you what's missing or out of place.

## Step 5: First real task

Ask which project they'd like to start with, or whether they want to convert an existing folder. Then do it.
