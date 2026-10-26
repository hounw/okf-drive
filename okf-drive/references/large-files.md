# Large files and MarkItDown

Drive's own text extraction handles normal PDFs and simple scans well. Very long or complex files (roughly 30+ pages, heavy tables, slides exported to PDF) can come back truncated or thin. For those, convert with [MarkItDown](https://github.com/microsoft/markitdown), Microsoft's open-source converter for PDF, Word, PowerPoint, Excel, images and more.

## When to recommend it

- The file is roughly 30+ pages, or
- A read returns noticeably less text than the file should hold (e.g. a 40-page brandbook yields two paragraphs), or ends mid-sentence, or
- The person needs exact tables or wording from a long file.

Tell the person why in one sentence and ask before converting.

## How

**If you have a shell with Python:**

1. Download the file from Drive to a temporary local folder (never into a synced Drive folder).
2. `pip install 'markitdown[all]'` (once).
3. `markitdown "<file>" -o "<file>.md"`
4. Upload `<original name>.md` to the same Drive folder as the original as a plain markdown file (MIME `text/markdown`, no conversion to Google Docs).
5. Delete the local temporary copies.

**If you have a MarkItDown tool or MCP server:** convert with it and upload the result the same way.

**If you have neither:** tell the person how to run it on their computer (steps 2–3 above, then drag the `.md` into the bundle's Inbox), and file it when they're done.

## After converting

- Keep both files next to each other. Never replace or delete the original.
- Add both to the Index: `- <Name> (PDF, original) [link]` and `- <Name> (markdown conversion; read this first) [link]`.
- Read the `.md` from now on. Write a summary doc from it if the file is long.
- Log it: `<date>, <person>: converted <name> to markdown`.
