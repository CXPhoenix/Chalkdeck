---
epic: 0005-license-reference-check
status: draft
revision: 3
split_from: 0003-license-split
---

# Spec 0005 — The verifier checks license references

`traceability.md` holds what this spec does not repeat:

- the definitions: B0, B, license references (a)–(d), path rules, notices grammar, unreadable
  inputs, quoted rendering;
- the exact message table and its order;
- the target texts T1–T9;
- a worked example;
- the matrix rows, with the test, red and skip rules.

`grill.md` quotes every answer the repository owner gave in stage 1. The Rulings of
`review/round-1.md` and `review/round-2.md` quote the review decisions.

Epic 0005 is the verifier half of epic 0003, which was split after its second review round. Epic
0004, the documentation half, is included in B0 (`2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`), whose
files are the facts this spec checks against.

Revision 2 applies the round-1 Rulings R1–R8 and the parent fixes recorded with them. Revision 3
is a post-review patch: it applies the round-2 Rulings S1–S3 and the parent fixes recorded with
them, is self-checked, and is not reviewed again (Ruling S4). The close-out corrections of
2026-10-24, listed at the end of `traceability.md`, apply ticket rulings to the wording without a
review round.

## Problem Statement

Epic 0004 gave the repository two root license files, `LICENSE` (CC BY-SA 4.0) and `LICENSE-CODE`
(MIT), and pointed the notices and the provenance records at them and at per-skill license files.
Nothing checks those pointers.

Before 0004, the notices and provenance records named "the root MIT LICENSE", a file that did not
exist, and no check noticed. The same can happen again:

- a renamed or deleted license file;
- a path typed with the wrong case, which still opens on macOS;
- a link that shows in the Markdown source but not on the rendered page, such as one inside an
  HTML comment;
- the two license links swapped, so the CC BY-SA text sits behind the "MIT" link;
- a provenance entry copied in from elsewhere that says `"license": "MIT"` while pointing at the CC
  BY-SA `LICENSE`.

## Solution

`scripts/verify-project.py` gains a license-reference check, and its PASS line says so. The check
reads the provenance file and the notices and reports every license reference that does not
resolve to a regular file in the repository, named with exact case and reached without symlinks.
It also reports:

- a provenance entry whose `license` disagrees with the root license file it names;
- notices that lack `[CC BY-SA 4.0](LICENSE)` or `[MIT](LICENSE-CODE)`;
- any Markdown construct in the notices that the check cannot judge.

The check runs on the file system alone and needs no Git. It does not check whether a file is
committed. Committed state is verified once, by this epic's end-to-end run in a fresh worktree of
HEAD. OQ-4 tracks a standing check.

## User Stories

1. As an agent running the verifier, I want a failure when a license reference in the provenance
   file or the notices does not resolve to a regular file with exact case and no symlinks, so that
   a stale license pointer is caught the next time the verifier runs.
2. As the repository owner, I want a failure when a provenance entry's `license` disagrees with the
   root license file it names, so that an entry copied in from elsewhere cannot quietly claim MIT
   for content.
3. As a reuser, I want the notices to keep a link labelled `CC BY-SA 4.0` to `LICENSE` and a link
   labelled `MIT` to `LICENSE-CODE`, so that I can always reach the right license text.
4. As an agent editing the notices, I want every construct the verifier cannot judge to fail with
   its line number, so that a link that is hidden or malformed on the rendered page cannot pass
   unseen.
5. As an agent reading a failure, I want each message to name the file, the line or JSON Pointer
   and a fixed reason, with unprintable characters escaped, so that I can fix it without guessing
   and a crafted value cannot forge output lines.
6. As the repository owner, I want the verifier to stay a read-only, offline file-system check
   that runs without Git, so that any copy can be checked before it is handed to another runtime.
7. As the author doing deck content work that edits the notices' Assets rows, I want to be told to
   run the verifier, so that a row the grammar rejects is caught in the same change.

## Implementation Decisions

- **One new function.** `check_license_references(root)` in the verifier, marked `# chalkdeck:`
  like the other local additions, returns a list of messages in the order `traceability.md`
  defines. `verify()` extends its errors with that list right after the glossary check, so the
  license messages come last. `main()` prints each one as `FAIL: <message>` as it does today.
- **What it checks.** The four license-reference kinds (a)–(d) of `traceability.md`:
  - provenance `license_location` values at any depth:
    - values holding a `<…>` placeholder, as `traceability.md` defines it, and sentences (inner
      whitespace) are skipped;
    - values with only leading or trailing whitespace fail;
    - no URL scheme is accepted;
  - notices link and image destinations, skipping `#` anchors and `http`, `https` and `mailto` URLs
    only;
  - the two required links, with exact link text; an image does not count;
  - agreement between `license` and a root license file, reported right after that entry's own
    reference message.
- **Path rules.** A target is rejected, in order:
  - when it leaves the repository (absolute, backslash, `..`), or names a drive through the scheme
    step;
  - when it is not a plain repository path (`%`, `?`, `<`, `>`, whitespace, `.` or empty segments);
  - otherwise it is resolved one segment at a time with `os.listdir` and `os.lstat`, so case,
    Unicode normalization and symlinks are judged the same way on every file system.

  The two input files are walked the same way, so a symlinked parent directory is refused too.
- **No Git, no standing guarantee.** The check does not ask whether a target is tracked. 0003's
  "tracked by Git" rule and its no-Git message are dropped (grill Q2'). The spec claims no workflow
  rule that re-checks committed state (Ruling R1). The module starts no process, opens no network
  connection and writes no file; it imports only an allow-listed set of standard-library modules.
  It walks the provenance file with its own stack, so its output does not depend on recursion
  depth.
- **Notices grammar contract.** The check recognizes only one-line inline links and images,
  `[text](dest)` and `![alt](dest)`, with an optional angle-bracket destination and title. It finds
  code spans first, skips them and fenced blocks, and recognizes links left to right without
  overlap. Fifteen constructs fail with their line instead of being guessed (Rulings R2, S1, S2):
  - a byte order mark, a carriage return;
  - a backtick fence opener with a backtick in its info string, a fence opener that is indented, an
    unmatched backtick;
  - a `|` inside a code span, link text or title on a table row;
  - raw HTML or an autolink (any `<` outside code spans except an angle-bracket destination or a
    title);
  - a blockquote line, a list item holding a block (a fence, indented code, a blockquote or a link
    reference definition), a tab in leading whitespace;
  - a link reference definition, an indented line holding a link;
  - a backslash escape of a link character;
  - empty link text, and a `](` that belongs to no recognized link.

  An unclosed fence also fails. At B0 the notices hold none of these. Link text over two lines,
  which grill Q8 allowed, now fails.
- **Messages.** Every placeholder that comes from file content or from a name on disk is printed
  through quoted rendering. It is JSON-encoded, then any unprintable characters are escaped as
  `scripts/check_style_skills.py` already does, with that code copied rather than imported. JSON
  Pointers follow RFC 6901 and are quoted the same way.
- **Unchanged behaviour.** The existing provenance check and its message are unchanged, so a
  missing provenance file is reported twice by `verify()`. No other check changes.
- **Documentation.**
  - The PASS line, the verifier docstring, the test-module docstring and the `AGENTS.md` build
    section name license references (T1–T3, T6).
  - Deck content work that adds, updates or removes the notices' Assets rows runs the verifier, and
    a FAIL blocks the merge; a FAIL outside the deck's own rows goes to the repository owner. This
    is written in the `AGENTS.md` slide hard rules (T7) and in the deck-track list of
    `docs/agents/workflow.md` (T8), and ADR-0007 gains an "Amended by ADR-0008" line (T9)
    (Rulings R5, S3).
  - A new ADR-0008 records the decisions listed in T4: the grammar contract, the file-system-only
    choice, the skipped destinations, the required link text, the end-to-end harness, and its
    amendment of ADR-0007.
  - `docs/README.md` indexes it (T5).
  - `docs/agents/runtime.md`, `docs/guide.md` and `README.md` do not change; `README.md:51` stays
    accurate (Ruling R6).
- **Open question.** OQ-4 in `.proj.specs/OPEN-QUESTIONS.md`, added with this revision, tracks a
  standing check of committed state.
- **Charter constraints.** No dependency is added (Charter 4). No file under `slides/`, `themes/` or
  `assets/` changes (Charter 3 and 5). The notices and the provenance file do not change.

## Testing Decisions

- **What a good test is.** It builds a fixture tree in a temporary directory from plain files, with
  no Git. It calls `check_license_references(root)` and compares the returned list exactly, as the
  glossary tests in `scripts/test_verify_project.py` do. The fixture root is passed through
  `os.path.realpath`, because the macOS temporary directory sits behind a symlink. The matrix
  defaults fix the fixture's files and the notices' first two lines.
- **One test per sub-case.** Every sub-case named in the matrix rows P1–O4 is its own test, a
  method or a `subTest`. The stage-5 test plan table lists them. Tests are written under `/tdd`.
- **Red for every sub-case.** Each sub-case's red is recorded in ticket Comments before the code
  that turns it green, with the failing output, the HEAD commit and the test file's blob written by
  `git hash-object -w`. An error because the function does not exist yet counts as red. A sub-case
  that passes on its first run, whether or not it expects a message, takes its red by mutation:
  - change the implementation so the rule it guards no longer holds;
  - record the failure;
  - restore the implementation.

  The test plan table names each mutation. This extends the mutation technique of ADR-0006 beyond
  that ADR's scope, which is tickets that forbid behaviour change. The extension is explicit and
  applies to this epic only (grill Q6, Ruling R7).
- **Platform skips.** Symlink, FIFO and permission sub-cases may skip only where the platform cannot
  create the fixture or the run is as root. On macOS as a non-root user, the reference platform,
  nothing skips. A normalization sub-case may also skip where the file system does not keep a
  decomposed (NFD) name; APFS keeps it. A skip elsewhere is recorded and does not count as a pass.
- **Wiring.** One test calls `verify()` on a fixture that also fails the glossary check. It asserts
  that the returned errors end with exactly the license-reference messages, right after the glossary
  message (W1).
- **Several tickets.** If stage 4 splits the epic, each ticket names the rows and ACs it closes, and
  W2, E1–E4 and X3 are judged on the HEAD of the last ticket to land.
- **Content checks in Comments.** These are checked by reading, not by tests:
  - the texts T1–T9;
  - the process and write calls (W3);
  - the verifier's diff hunks (W4);
  - the diff scope (X1).
- **End to end.** The surface is the verifier CLI on macOS. Its commands and output are recorded in
  Comments.
  - E1: run it on the ticket worktree.
  - E2: run that checkout's own script, `python3 <tmp>/scripts/verify-project.py`, in a
    `git worktree add --detach` checkout of HEAD in a temporary directory. This is the epic's one
    check of committed state.
  - E3: in that checkout, break the line-34 link, then run its script again. It must exit 1 with
    exactly the one expected `FAIL:` line.
  - E4: confirm the temporary path in `git worktree list`, then remove that worktree.

## Acceptance Criteria

- **AC1.** Each sub-case of the provenance rows P1–P9 and D1–D6 has a passing test at HEAD. Its red
  is recorded as Testing Decisions describes, and nothing skips on the reference platform.
- **AC2.** The notices rows N1–N6, R1–R7, G1–G10 and C1–C4 meet the same condition.
- **AC3.** The input, order and rendering rows I1–I4 and O1–O4 meet the same condition.
- **AC4.**
  - W1's test passes.
  - On the real tree at HEAD, `verify-project.py` exits 0 and prints the T1 PASS line (W2).
  - Reading the module confirms W3, and reading its diff confirms W4.
- **AC5.** The verifier docstring, the test-module docstring, `AGENTS.md`, ADR-0008, the
  `docs/README.md` index, `docs/agents/workflow.md` and ADR-0007 hold texts T2–T9. The PASS line is
  T1.
- **AC6.** The end-to-end runs E1–E4 give the results their matrix rows state. Their commands and
  output are recorded in Comments, naming the verifier CLI as the surface.
- **AC7.**
  - `git diff <B SHA>...HEAD --name-only`, with the latest recorded B, lists only the paths of row
    X1.
  - B is the first Comment the ticket writes, before any code or test change, and any re-recorded B
    quotes the repository owner's agreement (X2).
  - The three commands of row X3 exit 0 at HEAD.

## Out of Scope

- **Committed state, standing.** The check passes an untracked or ignored file that exists on disk.
  E2 verifies committed state once. OQ-4 asks how to check it on every change. The deck-track step
  T8 runs the verifier on the work tree; no workflow rule checks committed state.
- **Sentences in provenance.** A `license_location` value with inner whitespace is skipped as a
  sentence, even one that names a root license file, such as "the root MIT LICENSE". This is
  accepted as residual risk (Ruling R4). (d) only checks values that are exactly `LICENSE` or
  `LICENSE-CODE`.
- **Other files.** Links in `README.md`, including its `## License` section, and links anywhere other
  than the notices and the provenance file. Revisit when such a link is found broken after landing.
- **License contents.** Whether a skill's own `LICENSE` text matches the `license` recorded for it.
  Only the two root files are compared, and only by name. Revisit when a skill's recorded license is
  found wrong.
- **Markdown beyond the grammar.** Reference-style links are not license references. Full
  CommonMark conformance is not a goal: the grammar is a contract for the notices, recorded in
  ADR-0008.
- **Content changes.** Any change to the notices, the provenance file or a license file.
- **CI.** The verifier is not added to a GitHub workflow.
- **Recorded, not changed** (round 1):
  - duplicate JSON keys, where the parser keeps the last value (4-13);
  - very long one-line messages for large non-string values (4-14);
  - time-of-check races on the inputs (4-18);
  - hardlinks (4-19);
  - regex performance (4-20);
  - misspelled `license_location` keys (4-21).
- **The duplicate message.** The `verify()` provenance message for a missing provenance file is
  left unchanged.

## Further Notes

- **0003 drafts, changed here.** Sources: grill Q1, Q2', Q4, Q8; Rulings R2–R4.
  - Removed: the `is not tracked by Git` reason, the no-Git message and row V11.
  - Scheme handling: the scheme rule is an allow-list.
  - New reasons: `has leading or trailing whitespace` and `is not a plain repository path`.
  - Unreadable inputs: they gain `not a regular file` and `not readable`, and are walked like
    targets.
  - Required links: they need exact link text.
  - Placeholders: every one uses quoted rendering, JSON Pointers included.
- **Changed from revision 1.** Rulings R1–R7, plus these parent fixes:
  - corrected Facts at B0;
  - the O3 expectation;
  - O1 split into O1 and I4;
  - E3's line number and E4;
  - matrix defaults;
  - unclosed-fence scope;
  - (d) message position;
  - input walk;
  - `RecursionError`;
  - W1, W3 and W4;
  - T6;
  - new rows P8, D5, R7, G2, G6 and the extra sub-cases.
- **Changed from revision 2.** Rulings S1–S3, plus these parent fixes:
  - rows P9, D6, G7–G10 and the extra sub-cases in G1, G2, C3, C4, I1, I2, O1–O4;
  - code spans found before links, and links scanned left to right without overlap;
  - the provenance walk with its own stack;
  - the input walk as ordered steps;
  - `os.lstat` errors during resolution;
  - W1 "right after", W3 by identifier with an import allow-list, W4 by changed line;
  - T6 and T7 rewritten, T8 and T9 added;
  - E2 and E3 run the checkout's own script, E4 confirms before removing;
  - the red definition and `git hash-object -w`;
  - the several-tickets rule;
  - OQ-4 reworded.
- **Recorded from round 2, not changed:**
  - placeholder skips by substring (4-6);
  - (d) only on same-object keys (4-5);
  - mislabelled extra links (4-4);
  - `\!` and HTML entities (4-17);
  - NFD and casefold false alarms (4-18);
  - the remaining glossary, deferral and wording items of axis 3.
- **Retrospective decision 1.** The epic 0004 retrospective asks whether a standing "do it to
  completion" counts as test plan approval. The repository owner has not answered yet. The agent
  asks before stage 5 of this epic starts.
