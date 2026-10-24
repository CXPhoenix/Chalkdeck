---
status: accepted
date: 2026-10-24
---

# The verifier checks license references on the file system, against a narrow notices grammar

`scripts/verify-project.py` checks every license reference that `THIRD_PARTY_NOTICES.md` and
`docs/agents/skill-sources.json` make: each must resolve to a regular file in the repository, named
with exact case and reached without symlinks, and the notices must link both root license files.
Epic 0005 specifies the check; this record keeps the decisions that a later change to the notices
or the verifier has to respect.

## Decisions recorded here (repository owner, 2026-10-23 and 2026-10-24)

- **The notices follow a narrow grammar, and anything outside it fails.** The verifier recognizes
  only one-line inline links and images, `[text](dest)` and `![alt](dest)`, with an optional
  angle-bracket destination and title. It finds code spans first, skips them and fenced blocks
  (opened in column 1), and recognizes links left to right without overlap. Fifteen constructs it
  cannot judge fail with their line number rather than being guessed: a byte order mark, a carriage
  return, a backtick fence opener with a backtick in its info string, an indented fence opener, an
  unmatched backtick, a `|` inside a code span, link text, destination or title on a table row,
  raw HTML or an autolink, a blockquote, a list item holding a block, a tab in leading whitespace, a
  link reference definition, an indented line holding a link, a backslash escape of a link
  character, empty link text, and a `](` that belongs to no recognized link. An unclosed fence fails
  too. Full CommonMark conformance is not a goal: a construct that would render differently from
  what the verifier sees is rejected instead of interpreted.
- **The check is file-system only.** Epic 0003 had required every target to be tracked by Git; that
  rule was dropped, so the verifier runs no subprocess and works on any copy. The verifier therefore
  does not check committed state. Epic 0005 checks it once, at stage 8, by running the verifier in a
  detached `git worktree` of HEAD, which holds committed files only. OQ-4 tracks a standing check.
- **Skipped destinations.** `#` anchors and `http`, `https` and `mailto` URLs are not checked.
  Every other destination, any other scheme included, is checked or rejected.
- **Required links.** The notices must hold `[CC BY-SA 4.0](LICENSE)` and `[MIT](LICENSE-CODE)` with
  exactly that link text, so a reader always reaches the right license text and swapped links are
  caught. An image does not count.
- **End-to-end harness.** The surface of this check is the verifier CLI. It is verified by running
  the CLI on the work tree and on a detached `git worktree` of HEAD, then once more on that checkout
  with one notices link broken (workflow stage 8).

## Amends ADR-0007

Deck content work that adds, updates or removes Assets-table rows of `THIRD_PARTY_NOTICES.md` now
runs `python3 scripts/verify-project.py` before merging. A FAIL blocks the merge; a FAIL outside the
deck's own rows is reported to the repository owner rather than fixed on the deck track. `AGENTS.md`
and `docs/agents/workflow.md` state the step.

## Consequences

- A new construct in the notices, such as an HTML comment, a reference-style link or a table cell
  holding `|` in a code span, needs this ADR and the verifier changed together.
- A holder written as `Name <email>` fails as raw HTML; write it inside a code span or without the
  angle brackets.
- A file that exists only in the local checkout passes the verifier; committed state is not checked
  on every change (OQ-4).
- Provenance `license_location` values that hold a `<…>` placeholder or inner whitespace are skipped
  as placeholders or sentences.
