---
epic: 0005-license-reference-check
status: draft
revision: 1
split_from: 0003-license-split
---

# Spec 0005 — The verifier checks license references

`traceability.md` holds what this spec does not repeat: the definitions (B0, B, license references
(a)–(d), path rules, notices grammar, unreadable inputs, quoted rendering), the exact message
table and order, the target texts T1–T5, a worked example, and the matrix rows. `grill.md` quotes
every answer the repository owner gave.

Epic 0005 is the verifier half of epic 0003, which was split after its second review round. Epic
0004, the documentation half, landed on `main` at B0 (`2577b504fa5f22fcef047a95f6d9c2afc9a2daf4`).
Its files are the facts this spec checks against.

## Problem Statement

Epic 0004 gave the repository two root license files, `LICENSE` (CC BY-SA 4.0) and `LICENSE-CODE`
(MIT). It also pointed the notices and the provenance records at those files and at per-skill
license files. Nothing checks those pointers.

Before 0004, the notices and provenance records named "the root MIT LICENSE", a file that did not
exist, and no check noticed. The same can happen again:

- a renamed or deleted license file;
- a path typed with the wrong case, which still opens on macOS;
- a link hidden in an HTML comment that satisfies a reader of the source but not of the page;
- a provenance entry copied from the template that says `"license": "MIT"` while pointing at the
  CC BY-SA `LICENSE`.

## Solution

`scripts/verify-project.py` gains a license-reference check, and its PASS line says so. The check
reads the provenance file and the notices and reports every license reference that does not
resolve to a regular file in the repository, named with exact case and reached without symlinks.
It also reports:

- a provenance entry whose `license` disagrees with the root license file it names;
- notices without links to both root license files;
- any Markdown construct in the notices that the check cannot judge.

The check runs on the file system alone and needs no Git. A file that exists locally but was
never committed is caught by running the verifier in a fresh worktree of HEAD, which stage 8
requires (grill Q2').

## User Stories

1. As an agent running the verifier, I want a failure when a license reference in the provenance
   file or the notices does not resolve to a regular file with exact case and no symlinks, so that
   a stale license pointer is caught the next time the verifier runs.
2. As the repository owner, I want a failure when a provenance entry's `license` disagrees with the
   root license file it names, so that a template entry cannot quietly claim MIT for content.
3. As the repository owner, I want the notices to keep inline links to both root license files, so
   that a reuser can always reach both license texts.
4. As an agent editing the notices, I want every construct the verifier cannot judge to fail with
   its line number, so that a hidden or malformed link cannot pass unseen.
5. As an agent reading a failure, I want each message to name the file, the line or JSON Pointer
   and a fixed reason, with unprintable characters escaped, so that I can fix it without guessing
   and a crafted value cannot forge output lines.
6. As the repository owner, I want the verifier to stay a read-only, offline file-system check
   that runs without Git, so that any copy can be checked before it is handed to another runtime.

## Implementation Decisions

- **One new function.** `check_license_references(root)` in the verifier, marked `# chalkdeck:`
  like the other local additions, returns a list of messages in the order `traceability.md`
  defines. `verify()` extends its errors with that list right after the glossary check. `main()`
  prints each one as `FAIL: <message>` as it does today.
- **What it checks.** The four license-reference kinds (a)–(d) of `traceability.md`:
  - provenance `license_location` values at any depth, skipping placeholders (`<`) and sentences
    (inner whitespace), and failing values with only leading or trailing whitespace;
  - notices link destinations, skipping `#` anchors and `http`, `https` and `mailto` URLs only;
  - the two required links;
  - agreement between `license` and a root license file.
- **Path rules.** A target is rejected, in order:
  - when it leaves the repository (absolute, drive, backslash, `..`);
  - when it is not a plain repository path (`%`, `?`, whitespace, `.` or empty segments);
  - otherwise it is resolved one segment at a time with `os.listdir` and `os.lstat`, so case,
    Unicode normalization and symlinks are judged the same way on every file system.
- **No Git.** The check does not ask whether a target is tracked. 0003's "tracked by Git" rule and
  its no-Git message are dropped. The module stays standard-library only and starts no subprocess.
- **Notices grammar contract.** The check recognizes only the inline link forms the notices use:
  `[text](dest)` and `![alt](dest)`, with an optional angle-bracket destination and title. It
  skips code spans and fenced blocks. Each of these fails with its line, instead of being guessed:
  - an unclosed fence or an unmatched backtick;
  - an HTML comment;
  - a link reference definition;
  - an indented line holding a link;
  - a backslash escape of a link character;
  - a `](` that belongs to no recognized link.

  At B0 the notices hold none of these.
- **Messages.** Every placeholder that comes from file content is printed through quoted
  rendering: JSON encoding, then the escaping of unprintable characters that
  `scripts/check_style_skills.py` already uses, copied rather than imported. JSON Pointers follow
  RFC 6901.
- **Unchanged behaviour.** The existing provenance check and its message are unchanged, so a
  missing provenance file is reported twice by `verify()`. No other check changes.
- **Documentation.**
  - The PASS line, the module docstring and the `AGENTS.md` build section name license references
    (T1–T3).
  - A new ADR-0008 records the grammar contract and the file-system-only choice (T4).
  - `docs/README.md` indexes it (T5).
  - `docs/agents/runtime.md` and `docs/guide.md` do not change.
- **Charter constraints.** No dependency is added (Charter 4). No file under `slides/`, `themes/` or
  `assets/` changes (Charter 3 and 5). The notices and the provenance file do not change.

## Testing Decisions

- **What a good test is.** It builds a fixture tree in a temporary directory: plain files, no Git.
  It calls `check_license_references(root)` and compares the returned list exactly, as the glossary
  tests in `scripts/test_verify_project.py` do. The fixture root is passed through
  `os.path.realpath`, because the macOS temporary directory sits behind a symlink.
- **One test per sub-case.** Every sub-case named in the matrix rows P1–O4 is its own test, a
  method or a `subTest`. The stage-5 test plan table lists them. Tests are written under `/tdd`, and
  each row's red output is recorded in ticket Comments with the commit it ran at.
- **Red for sub-cases that expect no message.** A sub-case that expects no message passes as soon
  as the function exists. Its red is shown by mutation instead:
  - temporarily break the rule it guards, such as a skip or an acceptance;
  - run the test and record the failure;
  - restore the rule.

  This borrows only the mutation technique of ADR-0006, not the ADR itself (grill Q6).
- **Platform skips.** Symlink sub-cases skip where symlinks cannot be created. The permission
  sub-case skips when running as root or where permissions cannot be removed. Both follow the
  glossary tests' prior art.
- **Wiring.** One test calls `verify()` on a fixture with one bad notices link and asserts that the
  message is among the returned errors (W1). It asserts inclusion only, because a minimal fixture
  also trips other checks.
- **Content checks in Comments.** These are checked by reading, not by tests:
  - the texts T1–T5;
  - the import list (W3);
  - the diff scope (X1).
- **End to end.** The surface is the verifier CLI on macOS. Its output is recorded in Comments.
  - E1: run it on the ticket worktree.
  - E2: run it in a `git worktree add --detach` checkout of HEAD in a temporary directory. This
    run is what guarantees that every license target is committed.
  - E3: in that checkout, break one notices link and run it again. It must exit 1 with exactly the
    one expected `FAIL:` line.

## Acceptance Criteria

- **AC1.** The provenance rows P1–P7 and D1–D4 each have a passing test per sub-case at HEAD, with
  red evidence recorded as Testing Decisions describes.
- **AC2.** The notices rows N1–N6, R1–R6, G1–G5 and C1–C4 meet the same condition.
- **AC3.** The input, order and rendering rows I1–I3 and O1–O4 meet the same condition.
- **AC4.** W1's test passes. On the real tree at HEAD, `verify-project.py` exits 0 and prints the
  T1 PASS line (W2). The verifier imports only standard-library modules and no `subprocess` (W3).
- **AC5.** The docstring, `AGENTS.md`, ADR-0008 and the `docs/README.md` index hold texts T2–T5.
  The PASS line is T1.
- **AC6.** The E2E runs E1–E3 give the results their matrix rows state. Their commands and output
  are recorded in Comments, naming the verifier CLI as the surface.
- **AC7.**
  - `git diff <B SHA>...HEAD --name-only` lists only the paths of row X1.
  - B is the first Comment, and `main` was not merged without the repository owner's consent (X2).
  - The three commands of row X3 exit 0 at HEAD.

## Out of Scope

- **Git tracking.** The check passes an untracked or ignored file that exists on disk. E2 covers
  committed state at landing time, and every later ticket starts from a fresh worktree of `main`.
- **Other files.**
  - Links in `README.md`, including its `## License` section.
  - Links anywhere other than the notices and the provenance file.
- **License contents.** Whether a skill's own `LICENSE` text matches the `license` recorded for
  it. Only the two root files are compared, and only by name.
- **Markdown beyond the grammar.** Reference-style links, autolinks and raw HTML other than
  comments are not license references. Full CommonMark conformance is not a goal: the grammar is a
  contract for the notices, recorded in ADR-0008.
- **Content changes.** Any change to the notices, the provenance file or a license file.
- **CI.** The verifier is not added to a GitHub workflow.
- **The duplicate message.** The `verify()` provenance message for a missing provenance file is
  left unchanged.

## Further Notes

- **0003 drafts, changed here** (grill Q1, Q2', Q4, Q8):
  - the `is not tracked by Git` reason, the no-Git message and row V11 are gone;
  - the scheme rule is an allow-list;
  - the reasons `has leading or trailing whitespace` and `is not a plain repository path` are new;
  - unreadable inputs gain `not a regular file` and `not readable`;
  - every placeholder uses quoted rendering. For a string value the message looks the same as 0003's
    `"<value>"`.
- **Retrospective decision 1.** The epic 0004 retrospective asks whether a standing "do it to
  completion" counts as test plan approval. The repository owner has not answered yet. It must be
  answered before stage 5 of this epic.
