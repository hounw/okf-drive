# OKF-Drive specification

Version 0.2 · Webifica · 2026-10-26

OKF-Drive is a format for project knowledge stored in Google Drive. It applies the [Open Knowledge Format (OKF)](https://agentic-ai.readthedocs.io/en/latest/Standards/open-knowledge-format/) to Google Docs. It defines which documents a project folder must contain, how they are arranged and linked, and the metadata each one carries. It does not define where folders live, how they are organized internally, or which AI agent reads them.

The key words MUST, MUST NOT, SHOULD and MAY are used as in RFC 2119.

## 1. Scope

The standard defines:

- A **bundle**: a Drive folder with a README doc and an Inbox folder.
- The **README**: a header and six sections, including the bundle's own Structure and the Index of every file.
- A **metadata header** on every working doc.
- A **type** on every README and working doc: a free value each bundle defines for itself.
- An **Inbox**: the only place a file may sit without being indexed, named after its bundle so any agent can find it with one search.
- **Rules for agents** that read and write bundles.

It leaves to each team: where bundles live, who owns the Drive, each bundle's folder structure and doc types, and any extra fields. Two bundles can be organized completely differently and both conform.

Working documents are Google Docs, not markdown files, because several people and their agents edit the same project at once. Google Docs merges concurrent edits and rejects stale ones; synced files overwrite each other.

## 2. Bundles

A bundle is a Google Drive folder that contains, at its top level:

1. A Google Doc named `README` whose first line is `okf-drive: 0.2`.
2. An Inbox folder named `00 Inbox for <bundle folder name>`, recorded in that README's `inbox` field.

Nothing else makes a folder a bundle. Its location and internal layout do not matter.

- **Anywhere in Drive.** My Drive, a Shared Drive, or a folder shared with you. Access follows normal Drive sharing.
- **One project per bundle.** A bundle is the unit people hand off.
- **Nesting.** A bundle MAY contain child bundles. The parent's Index links each child's README, and each child's header names its `parent`.
- **Collections.** A folder that only groups bundles MAY have its own README that indexes them.

**Finding a bundle.** Agents MUST NOT rely on a fixed path. In order:

1. A link to the README or folder, if the person gives one.
2. A Drive full-text search for Google Docs titled `README` that contain `okf-drive:` and the project name or an alias.
3. If several match, list them (title, owner, location) and ask which one.

## 3. The README

The README is the bundle's entry point. Agents read it first, read only what its Index lists, and keep it current.

### 3.1 Header

Plain `key: value` lines at the very top of the doc, ending with a line containing only `---`. It plays the role of OKF's YAML frontmatter.

| Field | Required | Meaning | Example |
| --- | --- | --- | --- |
| `okf-drive` | Yes | Standard version; MUST be the first line | `0.2` |
| `type` | Yes | What kind of bundle this is, in the team's own words | `client-project` |
| `title` | Yes | Human name of the project | `AcmeCo content strategy` |
| `description` | Yes | One sentence on what the project is | `Meta Ads and content for Acme, Oct 2026 to Mar 2027` |
| `inbox` | Yes | Name of the bundle's Inbox folder: `00 Inbox for <bundle folder name>` | `00 Inbox for acme-co` |
| `status` | Yes | `active`, `paused`, `done` or `archived` | `active` |
| `owner` | Yes | Person accountable for the bundle | `Ana` |
| `updated` | Yes | Date of the last change, `YYYY-MM-DD` | `2026-10-20` |
| `aliases` | No | Other names people use, comma-separated | `acme, acme-co` |
| `parent` | No | Link to the parent bundle's README | `https://docs.google.com/...` |
| `tags` | No | Free labels, comma-separated | `meta-ads, guatemala` |

Other fields MAY be added. Agents MUST preserve fields they don't recognize.

### 3.2 Sections

After the header, in this order:

| Section | Holds | Updated by |
| --- | --- | --- |
| About | Two or three lines on the project and, if any, the client | People, rarely |
| Notes | Standing instructions: language, tone, approvals, things to never do | People, as learned |
| Structure | This bundle's own layout: subfolders, the doc types it uses, what goes where, naming rules. One line per item | People, or an agent with a person's approval |
| Index | Every file and child bundle outside the Inbox, linked, one line each, in reading order | Agent, whenever a file is filed, added, renamed or retired |
| Current state | Where the project stands and what is pending | Agent, end of every session |
| Log | One dated line per session or event, newest at the bottom: `YYYY-MM-DD, <person>: <what happened>` | Agent, end of every session |

The Index MAY group entries under subheadings (e.g. one per subfolder). Files that no longer apply go under a `Retired` group with a reason.

When the Log passes about 50 lines, older lines SHOULD move to a doc named `LOG` in the bundle, linked from the Index.

## 4. Document metadata

Every working Google Doc in a bundle starts with a header in the same `key: value` form, ending with `---`.

| Field | Required | Meaning | Example |
| --- | --- | --- | --- |
| `type` | Yes | What kind of doc this is; MUST be a type listed in the bundle's Structure | `brief` |
| `description` | Yes | One sentence on what the doc holds | `Goals, scope and deadlines for the Acme engagement` |
| `updated` | Yes | Date of the last meaningful change | `2026-10-20` |
| `status` | No | `draft`, `in-review`, `approved` or `superseded` | `draft` |
| `owner` | No | Person responsible, if not the bundle owner | `Juan` |
| `source` | For summaries and conversions | Link to the original file | `https://drive.google.com/...` |
| `supersedes` | No | Link to the earlier version this replaces | `https://docs.google.com/...` |

The doc's Drive name is its title. Files that can't hold a header (PDFs, images, spreadsheets, markdown conversions) are described by their Index line.

## 5. Files in a bundle

| Kind | Format | How it changes |
| --- | --- | --- |
| Working docs | Google Docs only, never uploaded Word or markdown files | Edited in place through the Docs API, with a revision check |
| Reference files | Kept as received: PDF, image, spreadsheet, anything | Never edited; renamed, moved and indexed only |
| Summaries | Google Doc with a `source` field | Rewritten when the original is replaced |
| Conversions | `<original name>.md`, a plain markdown file next to the original | Regenerated when the original is replaced |

**Summaries.** A reference file longer than a couple of pages SHOULD get a summary doc named `<What it is> - summary`, holding the key facts and a link to the original. Agents read the summary first and open the original only when they need exact wording.

**Large files.** When a file is too big to read reliably through the connector (roughly 30+ pages, or a read that comes back truncated or thin), the agent SHOULD recommend converting it with [MarkItDown](https://github.com/microsoft/markitdown). Both files stay in the bundle: the original as received and `<original name>.md` next to it, uploaded as plain markdown (not converted to a Google Doc). The Index lists both, and agents read the `.md` first.

**Default naming** (a bundle's Structure MAY override):

- Reference files: `YYYY-MM-DD <What it is> (from <source>)`, using the date received, e.g. `2026-10-20 Brandbook (from client).pdf`.
- Working docs: a plain title, e.g. `Project Brief`. Versions go in the name (`v1`, `v2`), and each new version's header links the old one with `supersedes`.
- Child bundle folders: lowercase with dashes, e.g. `acme-co`.

**Nothing is deleted.** Retired files move to the Index's `Retired` group. Removing a file from Drive (or moving it to Trash) requires a person's explicit approval.

## 6. Types

OKF-Drive requires a `type` on every README and working doc but defines no type values.

- **Free values.** Lowercase words with dashes, e.g. `brief`, `sop`, `campaign-plan`.
- **Declared per bundle.** Every doc type a bundle uses MUST appear in its Structure with one line on what it holds.
- **Inherited downward.** A child bundle MAY use its parent's types without repeating them.
- **Shared by habit.** Teams MAY keep a template bundle and copy it. The standard doesn't require that.

## 7. The Inbox

Every bundle has exactly one Inbox: a top-level subfolder named `00 Inbox for <bundle folder name>`, where the part after `for ` is exactly the bundle folder's Drive name (folder `acme-co` → `00 Inbox for acme-co`). The README's `inbox` field holds the same name.

- **Findable in one search.** To add a file to a bundle, an agent searches Drive for a folder with that exact name and moves the file there, without opening the README or walking folders.
- **Renamed together.** Renaming a bundle folder MUST rename its Inbox and update `inbox` in the same step.

- **All new material enters here.** People drop files by any means. Dropping is always safe.
- **Filing empties it.** Filing gives each file a name, a place from the Structure, a summary or conversion if needed, an Index line and a Log line.
- **Anything unindexed is Inbox material.** A file anywhere in the bundle that isn't in the Index is treated as if it were in the Inbox: filed or reported, never silently ignored.
- **Agent-created docs** are created in place and indexed in the same step, so they skip the Inbox.

Apart from the Inbox, subfolders are up to each bundle and described in its Structure.

**Upgrading from 0.1.** Rename the Inbox to `00 Inbox for <bundle folder name>`, set `inbox` to the new name, and change the first line to `okf-drive: 0.2`.

## 8. Rules for agents

1. **README first.** Read the README, then linked docs in Index order. Prefer a summary or `.md` conversion over its original.
2. **Write through the Google APIs.** All writes go through Drive and Docs APIs (connectors, MCP servers or CLIs), never to a locally synced folder. Reading a synced copy is fine.
3. **Small, checked edits.** Read a doc before each edit and send the edit with that read's revision ID. If it is rejected because the doc changed, reread and redo it.
4. **New work is a new doc**, with a header, named by the bundle's conventions.
5. **Register immediately.** Every file created, filed or retired is reflected in the Index in the same step.
6. **Never overwrite or delete** without a person's explicit approval.
7. **Ask on contradictions.** New material never silently overrides a decision recorded in the bundle.
8. **Close the session.** Update Current state, add a Log line and set `updated`.
9. **Follow the bundle's Structure.** Never impose another bundle's layout. Preserve unknown fields and sections.
10. **Speak the person's language.** Answer in the language the person uses; write docs in the language the README Notes set.

## 9. Conformance

A folder conforms to OKF-Drive 0.2 when:

- [ ] A Google Doc named `README` sits at the folder's top level
- [ ] Its first line is `okf-drive: 0.2` and its header has every required field, ending with `---`
- [ ] A top-level folder named `00 Inbox for <bundle folder name>` exists, and `inbox` holds that name
- [ ] The README has About, Notes, Structure, Index, Current state and Log, in that order
- [ ] Every file and child bundle outside the Inbox appears in the Index with a link and one line
- [ ] Files sit where the Structure says
- [ ] Every working doc is a Google Doc with a header carrying `type`, `description` and `updated`, and its type is listed in the Structure
- [ ] Long reference files have a summary or conversion with `source`
- [ ] Each child bundle conforms on its own and names its `parent`

## 10. Mapping to OKF

| OKF v0.1 | OKF-Drive 0.2 |
| --- | --- |
| Bundle: a directory tree of markdown files | Bundle: a Drive folder with a README doc and an Inbox |
| `index.md` per directory | `README` doc per bundle |
| YAML frontmatter; `type` required | `key: value` header ending in `---`; `type` required |
| `title`, `description`, `resource`, `tags`, `timestamp` | Drive name, `description`, `source`, `tags`, `updated` |
| Markdown links form a graph | Drive links in the Index and inside docs |
| Optional `log.md` | Log section, overflowing to a `LOG` doc |
| Producer conventions | Structure section in each README |
| (none) | Required Inbox, named after the bundle |

A bundle can be exported to plain OKF markdown, one `.md` per doc with the header turned into frontmatter.

## 11. Example README

For a bundle folder named `acme-co`:

```
okf-drive: 0.2
type: client-project
title: AcmeCo content strategy
description: Meta Ads and content for Acme, Oct 2026 to Mar 2027
inbox: 00 Inbox for acme-co
status: active
owner: Ana
updated: 2026-10-20
aliases: acme, acme-co
---

About
Acme sells industrial paint in Guatemala and El Salvador.

Notes
Docs in formal Spanish ("usted"). Deliverables approved by their marketing lead.

Structure
- 00 Inbox for acme-co/: drop anything here; filed by the agent
- Reference/: client files as received, named "YYYY-MM-DD <What> (from <source>)", plus summaries and .md conversions
- Deliverables/: work we send the client
- Types: brief (goals, scope, deadlines), customer-profile (audience, voice, competitors),
  deliverable (anything sent to the client), summary (key facts from one reference file)

Index
1. Project Brief: goals, scope, deadlines [link]
2. Customer Profile: audience, voice, competitors [link]
Reference
- Contract (PDF): scope and terms; check before promising anything [link]
- Brandbook summary: colors, fonts, voice, dos and don'ts [link]
- Brandbook (PDF, original) [link]
Deliverables
- Content Strategy Proposal v1 (draft) [link]
Retired
(none)

Current state
Strategy v1 drafted, waiting on client feedback.

Log
- 2026-10-15, Ana: kickoff call, brief updated
- 2026-10-20, Ana: filed inbox; summarized brandbook
```
