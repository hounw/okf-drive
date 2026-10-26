# Templates

Create Google Docs from these as plain text (one line per paragraph). Replace everything in angle brackets.

## README

```
okf-drive: 0.1
type: <bundle type, e.g. client-project>
title: <project name>
description: <one sentence>
inbox: 00 Inbox
status: active
owner: <person>
updated: <YYYY-MM-DD>
aliases: <short-name, other-name>
---

About
<Two or three lines on the project and, if any, the client.>

Notes
<Language for docs, tone, who approves, things to never do. "None yet." is fine.>

Structure
- 00 Inbox/: drop anything here; the agent files it
- <subfolder>/: <what goes there>
- Types: <type> (<what it holds>), <type> (<what it holds>)

Index
(empty)
Retired
(none)

Current state
<Where things stand.>

Log
- <YYYY-MM-DD>, <person>: created bundle
```

## Working doc header

```
type: <a type listed in the Structure>
description: <one sentence>
updated: <YYYY-MM-DD>
status: draft
---
```

## Summary doc

Name: `<What it is> - summary`

```
type: summary
description: Key facts from <original name>
updated: <YYYY-MM-DD>
source: <link to original>
---

<Key facts as short bullets: names, numbers, dates, rules, dos and don'ts.>
```

## Index line

```
- <Doc or file name> (<format if not a Google Doc>): <one line on what it is and when to read it> [<link>]
```
