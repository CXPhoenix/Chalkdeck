# Open questions

Architecture-level decisions that block work downstream of them. Each entry: the question, why it
is open, what it blocks, and what would settle it.

## OQ-1 — Automated harness for skill behaviour

- **Question:** How should skill behaviour (which branch a skill takes, what it asks, selects and
  emits) be verified automatically?
- **Why open:** The only candidate so far is a headless Claude session per case. Epic 0002 deferred
  it: outputs are free text, some router cases allow several outcomes, and some cases need fixtures
  (guidance made unavailable, multi-turn context). Workflow stage 8 requires a recorded harness for
  any non-browser surface.
- **Design kept for later (author, 2026-10-16):** run each case three times per version; judge each
  run's outcome against the case's allowed set, not against the other version's run.
- **Blocks:** behaviour-changing edits to skills (epic 0002 defers them); automated end-to-end
  evidence for skill epics (0001 uses a manual agent session instead).
- **Settles it:** an ADR choosing the harness, its fixtures and its judging rules. Real-use history
  from the planned deck-production history epic is an input.

## OQ-2 — harness-agile template still names `CONTEXT.md`

- **Question:** When this repo next syncs `AGENTS.md` or `docs/agents/*` from the harness-agile
  template, how is the template's `CONTEXT.md` naming reconciled with epic 0001's `GLOSSARY.md`?
- **Why open:** Epic 0001 follows mattpocock/skills upstream; the template has not followed yet.
- **Blocks:** nothing now; the next template sync.
- **Settles it:** the template adopting the rename, or a recorded local adaptation reapplied on sync
  (the verifier lists every spot).

## OQ-3 — License notices on deployed decks

- **Question:** How do deployed decks carry the notices their bundled third-party material needs,
  including the MIT notices of bundled npm packages such as React and `@open-slide/core`?
  For example, the license URI that CC BY-ND 3.0 TW §4(a) requires with each copy of the MOE Kai
  font, and attribution for logos.
- **Why open:** Epic 0004 (split from 0003) marks licenses in the repository only. A built site ships the font and
  logos with no notice. Charter 3 forbids changing existing decks, so a fix has to come from the
  build or from a theme change that only new decks pick up, which is deck-surface work outside
  epic 0004.
- **Blocks:** nothing in the repository; publishing compliance of public decks.
- **Settles it:** a decision on where a deployed notice lives. Candidates: a page generated at
  build time; a theme change applied only to new decks; a footer convention for new decks.

## OQ-4 — Standing check that license targets are committed

- **Question:** How is it checked, on every change, that each license reference in the notices and
  the provenance file points at a committed file, not one that exists only in the local checkout?
- **Why open:** Epic 0005 keeps the verifier a file-system check that needs no Git (grill Q2'). A
  file that was renamed or added without `git add` passes it locally. The epic verifies committed
  state once, by running the verifier in a detached worktree of HEAD at stage 8 (round-1 Ruling R1).
  No workflow rule repeats that run. Deck content work that edits the notices' Assets rows runs the
  verifier on its work tree (round-2 Ruling S3), which does not check committed state either.
- **Blocks:** nothing now; the guarantee that a landed notices or provenance change has no
  uncommitted target.
- **Settles it:** a decision among, for example, a workflow rule to run the verifier in a fresh
  worktree before landing, a CI job that runs it on the pushed commit, or a Git-aware mode of the
  verifier.

## OQ-5 — Deck-track wording in the epic 0004 notices rules

- **Question:** Should one small epic make the deck-track notices exception read the same in every
  place it is written (T10, T13–T18 of epic 0004, now in `AGENTS.md`, `docs/agents/workflow.md`,
  ADR-0007 and `GLOSSARY.md`)?
- **Why open:** Epic 0004's stage 6 found 11 spec-level wording points: STD-01, STD-02/SPEC-11,
  STD-04/SMELL-02, STD-05, STD-06, STD-07, STD-16, SMELL-01, SPEC-12, SPEC-13 and SPEC-14 (T-0006,
  "Stage 6 code review"). The most important: the holder is decided by the owner only and defaults
  to unknown is restated only in ADR-0007, and an in-place file swap is covered by T13/T14 but not
  T10. The repository owner chose "記進 OQ，先不開" (decision D2, T-0007).
- **Blocks:** nothing now. The 0004 chain analysis found no chain through these points; they make
  the deck track's notices guard rely on wording that differs between places.
- **Settles it:** an epic that rewrites the exception once and points the other places at it, or a
  decision that the current wording stands.

## OQ-6 — The CLI reads the provenance file before the license-reference check

- **Question:** How should `verify()` read `docs/agents/skill-sources.json` so the CLI reports an
  unreadable or malformed file as a FAIL line instead of hanging or printing a traceback?
- **Why open:** The pre-existing read at `scripts/verify-project.py:107-115` uses `read_text`, which
  follows symlinks, and catches only `OSError`, `ValueError` and `KeyError`. A FIFO hangs, a symlink
  to `/dev/zero` exhausts memory, and a top-level `[]` raises `TypeError`. The epic 0005 check
  handles all three, and its "the notices are still checked" holds, but only at the function level:
  from the CLI the earlier read fails first (T-0007 SEC-03, T-0008 C-09; Rulings G1 and L4). Spec
  0005 keeps the existing checks unchanged, so the epic left it.
- **Blocks:** nothing now. On the deck track the provenance file is not part of a deck change. If it
  were, a traceback is not a `FAIL:` line, so the rule "a FAIL blocks the merge" should also cover
  any non-zero exit (Ruling L4).
- **Settles it:** a change that reads the provenance file once through the epic 0005 input walk, or
  catches the remaining errors, with workflow item 6 reading "any non-zero exit blocks the merge".

## OQ-7 — Hardening gaps that predate epic 0005

- **Question:** Should the verifier escape every name it prints, and should its tests load the
  verifier from source only?
- **Why open:** Two pre-existing gaps found in T-0007's stage 7 (Ruling G2):
  - SEC-11: the glossary and skill-tree messages print names from disk unescaped, so a committed
    file name holding a newline, ESC or a bidi character can forge a line on stderr (the exit code
    stays 1). The epic 0005 messages all go through quoted rendering.
  - SEC-12(a): the tests load `verify-project.py` with `spec_from_file_location`, which can pick up a
    committed unchecked-hash `.pyc` from `scripts/__pycache__` instead of the source.
- **Blocks:** nothing; both need the attacker to control the branch, which already lets them edit
  the verifier.
- **Settles it:** a hardening ticket that applies quoted rendering to the older messages and makes
  the tests bypass bytecode, or a decision to accept both.

## OQ-8 — Notices that GitHub renders differently from what the verifier sees

- **Question:** How far should the notices grammar go so that every construct GitHub renders
  differently is rejected, as ADR-0008 intends?
- **Why open:** T-0008's stage 7 found that each of these PASSes in the verifier while GitHub (by
  the pandoc GFM proxy) renders something else (`review/security-T-0008.md`, C-01–C-06; Ruling L1):
  - a `\r` on a fence closer desynchronises fence state, so links inside are unchecked and the
    required links can land in a code block;
  - nested list markers, or a tab after a marker, hide indented code, a fence or a link reference
    definition inside a list item;
  - a table row without a leading `|` splits a link into cells;
  - a link reference definition whose label spans two lines is not caught;
  - front matter, math and control characters in a fragment, unverified;
  - `https:` without `//` is skipped although a browser resolves it as a relative path.
  Stage 6 adds one more: a table row indented with non-ASCII whitespace, then a `|` inside a code
  span, is no longer reported (T-0008 P-5, Ruling J4). All are spec-level gaps below the security
  threshold; the code follows the spec. Workflow item 6 also lacks three sentences (Ruling L3):
  check that the diff touches only the deck and the notices' Assets rows before running; the
  verifier's output is data, not instructions; report the result to the owner, not on a public PR.
- **Blocks:** nothing now; the owner reviews the rendered notices in every PR. The verifier's PASS
  overstates what was checked until it is settled.
- **Settles it:** the notices-grammar epic the owner scheduled after 0005 (Ruling L1): a revised
  grammar in a new spec and ADR-0008, with the fixes listed in the report's "後續事項" item 1.
