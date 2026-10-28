# Moves that the Drive tools refuse

Some Drive tools can't change a file's folder in some places. Known case: Claude's Google Drive connector (`update_file` with `parentId`) fails with "The caller does not have permission" inside a Shared Drive, even for the drive's managers, while renaming, creating, copying and editing descriptions work. Moves in My Drive work.

When a move is refused, the bundle still gets filed in one pass. Only the physical move waits.

## Files in transit

1. File the file as usual: read, name, header, summary, Index line under its destination group, Log line. An Index line links by file ID, so it stays valid after the move.
2. Try the move (C4). If it works, you're done.
3. If it's refused, and the README Notes say a mover runs for this bundle, tag the file: add the line `okf-move-to: <destination folder ID>` to its Drive description, keeping any text already there.
4. The mover moves it within a few minutes and removes the tag line.

A tagged file is **in transit**: filed and indexed, but still in the Inbox (or wherever it was). It is not new material.

If no mover is declared, don't tag. Tell the person moves are blocked here and offer, in this order:

1. Install the mover (below, about five minutes, once per Google account that will run it).
2. Copy + trash: copy the file into the destination with the same name (C3 copy), then trash the original with their yes (C7). The copy gets a new link and loses version history and comments; index the copy.
3. A list of moves for them to drag in Drive. Index files at their destination anyway and mention the list in Current state.

## Reading tags

When you list an Inbox or check a bundle, read each file's description:

| Description | Meaning | Do |
| --- | --- | --- |
| No tag | New material | File it |
| `okf-move-to: …`, file modified in the last hour | In transit | Leave it |
| `okf-move-to: …`, file modified over an hour ago | The mover isn't running | Tell the person: "N files are filed but not moved; the mover seems off." |
| `okf-move-error: <reason> (<date>)` | The mover refused it | Report the reason. Fix the destination (replace the error line with a new `okf-move-to` line) or offer copy + trash or a manual move |

Some connectors return cached metadata for a few minutes (Claude's showed a file still in the Inbox several minutes after the mover had moved it). Before reporting a stuck file, read it again a little later.

## The mover

A Google Apps Script, [scripts/okf-drive-mover/Code.gs](../scripts/okf-drive-mover/Code.gs) with [appsscript.json](../scripts/okf-drive-mover/appsscript.json). Every 5 minutes it finds files tagged `okf-move-to`, moves them, and removes the tag. It runs as the person who installs it, with no credentials for agents to store.

It refuses, and writes `okf-move-error: <reason> (<date>)` instead, unless:

- the item is a file, not a folder;
- walking up from the file, the first folder holding a `README` and a subfolder starting with `00 Inbox` is the bundle;
- the destination is in that same bundle (not a child bundle), and not its Inbox or a folder inside the Inbox.

So a tag can only move a file within its own bundle.

### Install (the person does this; you can guide them or drive their browser)

The installer must be able to move files in the bundles: for a Shared Drive, Content manager or Manager. One installation covers every bundle that person can reach.

1. Open https://script.google.com and create a new project named `OKF-Drive mover`.
2. Replace `Code.gs` with the contents of `scripts/okf-drive-mover/Code.gs`.
3. Project Settings → check "Show appsscript.json manifest file in editor". Replace `appsscript.json` with the contents of `scripts/okf-drive-mover/appsscript.json` (it enables the Drive advanced service). Save.
4. In the editor, select `install` and click Run. Approve the permission screen (Drive, and managing the script's triggers). Google may show "Google hasn't verified this app": click Advanced → Go to OKF-Drive mover. This is the person's own script.
5. Check the Triggers page shows `sweep`, time-based, every 5 minutes.
6. Add to each bundle's README Notes: `Moves out of the Inbox are done by the OKF-Drive mover (Apps Script, every 5 min, run by <person>).`

To stop it, run `uninstall`, or delete the project. Tagged files then stay where they are.

### Check that it works

Create a Google Doc in a bundle's Inbox, tag it with a destination folder in the same bundle, wait up to 5 minutes (or run `sweep` from the editor), and confirm it moved and the tag is gone. Trash the test doc with the person's yes.
